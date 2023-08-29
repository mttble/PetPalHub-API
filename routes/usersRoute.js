import express from 'express';
import { getProfile } from '../controllers/auth.js';
import { BookingModel } from '../models/Booking.js';
import { CarerModel } from '../models/Carer.js';
import { PetModel } from '../models/Pet.js';
import { UserModel } from '../models/User.js';
import { sendEmail } from '../utils/email.js';
import { verifyToken } from '../utils/verifyToken.js';
import { handleError } from '../utils/errorHandler.js';

const router = express.Router();

const createBooking = async (bookingData) => {
    const booking = new BookingModel(bookingData);
    await booking.save();
    return booking;
};

const fetchBookings = async (query) => {
    return await BookingModel.find(query);
};


router.get('/profile', getProfile)

router.get('/context', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId).select('-password');
        const pets = await PetModel.find({ ownerId: userId });
        res.json({ user, pets });
    } catch (error) {
        handleError(res, error, 'Failed to fetch user context.');
    }
});


router.post('/booking', verifyToken, async (req, res) => {
    try {
        const bookingData = { ...req.body, userId: req.user.id };
        const booking = await createBooking(bookingData);
        const carer = await CarerModel.findById(req.body.carerId);
        
        if (carer) {
            await sendEmail(
                carer.email,
                'New Booking Request',
                `Hello ${carer.firstName}, you have a new booking request from ${req.user.firstName}.`
            );
        }
        res.status(201).send(booking)

    } catch (error) {
        handleError(res, error, 'Error when processing booking:')
    }
})

router.get('/petPalRequests', async (req, res) => {
    try {
        const query = { status: { $in: ['Pending', 'Denied'] } };
        if (req.query.userId) query.userId = req.query.userId;
        if (req.query.carerId) query.carerId = req.query.carerId;

        const bookings = await fetchBookings(query);
        res.status(200).json(bookings);
    } catch (error) {
        handleError(res, error, 'Error when fetching PetPalRequest:');
    }
});

router.get('/confirmedBookings', async (req, res) => {
    try {
        const bookings = await fetchBookings({ userId: req.query.userId, status: 'Approved' });
        res.status(200).json(bookings);
    } catch (error) {
        handleError(res, error, 'Error when fetching confirmed bookings:');
    }
});

router.delete('/booking/:id', async (req, res) => {
    try {
        await BookingModel.findByIdAndDelete(req.params.id)
        res.status(200).send('Booking deleted successfully')
    } catch (error) {
        handleError(res, error, 'Error when deleting booking:')
    }
});

export default router
