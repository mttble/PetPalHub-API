import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true, // Removes any whitespace from the beginning and end of the value
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email addresses in the database are unique
        trim: true,
        lowercase: true, // Converts email to lowercase
        match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Email validation
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password should be at least 8 characters long'],
    },
    dateOfBirth: {
        type: Date,
    },
    profileImage: {
        type: String, // URL or path to the image file
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        postalCode: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
    },
    accountStatus: {
        type: String,
        enum: ['Active', 'Inactive', 'Banned'],
        default: 'Active',
    },
    isAdmin: {
        type: Boolean,
        default: 'false',
    },
    isCarer: {
        type: Boolean,
        default: 'false',
    },
});

const UserModel = mongoose.model('User', userSchema);
export {UserModel}


