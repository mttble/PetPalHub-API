// import { sendEmail } from '../utils/email.js'
import { BookingModel } from '../models/Booking.js';
// import { CarerModel } from '../models/Carer.js';

export const booking = async (req, res) => {
    try {
        const { carerId, petIds } = req.body;
        const userId = req.user.id;
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        
        if(startDate >= endDate) {
            return res.status(400).send('Start date should be before end date.');
         }

        const booking = new BookingModel({
            userId,
            carerId,
            petIds,
            startDate,
            endDate
        });

        await booking.save();

        // // Fetch the carer's email to send the notification
        // const carer = await CarerModel.findById(carerId);
        
        // if (carer) {
        //       await sendEmail(
        //           carer.email, 
        //           'New Booking Request', 
        //           `Hello ${carer.firstName}, you have a new booking request from ${req.user.firstName}.`
        //       );
        // }

        res.status(201).send(booking);

    } catch (error) {
        res.status(500).send(error.message);
    }

}