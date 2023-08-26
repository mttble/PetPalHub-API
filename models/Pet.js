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
        type: String,
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
        type: String,
        default: "null"
    },
    specialInstructions: {
        type: String,
        default: "None"
    },
    general: {
        type: String,
        default: "None"
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

petSchema.index({ ownerId: 1, petName: 1 }, { unique: true });

const PetModel = mongoose.model('Pet', petSchema);

export {PetModel};
