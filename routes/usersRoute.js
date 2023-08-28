import express from 'express';
import { getProfile } from '../controllers/auth.js';
import { BookingModel } from '../models/Booking.js';
import { CarerModel } from '../models/Carer.js';
import { PetModel } from '../models/Pet.js';
import { UserModel } from '../models/User.js';
import { sendEmail } from '../utils/email.js';
import { verifyToken } from '../utils/verifyToken.js';




const router = express.Router();

router.get('/profile', getProfile)

router.get('/context',verifyToken, async (req, res, next) => {
    try {
        // Assuming that after verifying the token, the user's ID is available in req.user.id
        const userId = req.user.id;

        // Fetch user details
        const user = await UserModel.findById(userId).select('-password'); // Excluding the password for security reasons

        // Fetch user's pets
        const pets = await PetModel.find({ ownerId: userId });

        // Combine and send the data
        res.json({
            user,
            pets
        });
    } catch (err) {
        console.error('Error fetching user context:', err);
        res.status(500).send('Server Error');
    }
})


router.post('/booking', verifyToken, async (req, res) => {
    try {
        const { petIds, startDate, endDate, pickUpTime, dropOffTime, carerId, message } = req.body;
        const userId = req.user.id;

        const booking = new BookingModel({
            carerId,
            userId,
            petIds,
            startDate,
            endDate,
            pickUpTime,
            dropOffTime,
            message
        });

        await booking.save();

        // Fetch the carer's email to send the notification
        const carer = await CarerModel.findById(carerId);
        
        if (carer) {
            await sendEmail(
                carer.email,
                'New Booking Request',
                `Hello ${carer.firstName}, you have a new booking request from ${req.user.firstName}.`
            );
        }
        res.status(201).send(booking);

    } catch (error) {
        console.error('Error when processing booking:', error);
        res.status(500).send(error.message);
    }

})

router.get('/bookings', async (req, res) => {
    try {
      const userId = req.query.userId;
      const bookings = await BookingModel.find({ userId: userId });
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).send('Server Error');
    }
  });
  

router.delete('/booking/:id', async (req, res) => {
    try {
        await BookingModel.findByIdAndDelete(req.params.id);
        res.status(200).send('Booking deleted successfully');
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).send('Server Error');
    }
});

export default router




