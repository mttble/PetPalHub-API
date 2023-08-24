import { sendEmail } from '../utils/email.js'

export const booking = async (req, res) => {
    try {
        const { carerId, startDate, endDate } = req.body;
        const userId = req.user.id;

        
        if(new Date(startDate) >= new Date(endDate)) {
            return res.status(400).send('Start date should be before end date.');
         }

        const booking = new BookingModel({
            userId,
            carerId,
            startDate,
            endDate
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
        res.status(500).send('Server error');
    }

}