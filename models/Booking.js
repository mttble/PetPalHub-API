import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carer',
        required: true
    },
    petIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }], //allow multiple pets
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'],
        default: 'Pending'
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    pickUpTime: {
        type: String,
        required: true
    },
    dropOffTime: {
        type: String,
        required: true
    },
    message: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BookingModel = mongoose.model('Booking', bookingSchema);

export { BookingModel };
