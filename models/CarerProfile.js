import mongoose from 'mongoose';

const carerProfileSchema = new mongoose.Schema({
    PetType: {
        type: String,
        trim: true,
    },
    additionalServices: {
        type: String,
        trim: true,
    },
    aboutMe: {
        type: String,
        trim: true,
    },
    experience: {
        type: String,
        trim: true,
    },
})



const CarerProfileModel = mongoose.model('CarerProfile', carerProfileSchema);
export { CarerProfileModel };
