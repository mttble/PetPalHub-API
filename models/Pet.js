import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    petName: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        default: "None"
    },
    medicalConditions: {
        type: String,
        default: "None" 
    },
    emergencyContact: {
        type: Number,
        default: "None"
    },
    specialInstructions: {
        type: String,
        default: "None"
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    petImage: {
        type: String,
        default: "" 
    },
});


const PetModel = mongoose.model('Pet', petSchema);

export {PetModel};
