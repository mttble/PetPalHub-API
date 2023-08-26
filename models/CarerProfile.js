import mongoose from 'mongoose';

const carerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    companyFullName: {
        type: String,
        trim: true,
    },
    petType: {
        type: [String],
        trim: true,
    },
    additionalServices: {
        type: [String],
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
    profileImage: {
        type: String,
    },
})



const CarerProfileModel = mongoose.model('CarerProfile', carerProfileSchema);
export { CarerProfileModel };
