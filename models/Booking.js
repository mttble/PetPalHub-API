import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    carerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carer',
        required: true
    },
    carerName: {
        type: String,
        required: true
    },
    carerEmail: {
        type: String,
    },
    petIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }], //allow multiple pets
    petNames: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Denied'],
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
