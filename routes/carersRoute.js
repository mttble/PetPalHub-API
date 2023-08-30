import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { CarerModel } from '../models/Carer.js';
import { CarerProfileModel } from '../models/CarerProfile.js';
import { carerProfileUpload } from '../utils/uploadConfig.js';
import { BookingModel } from '../models/Booking.js';
import { handleError } from '../utils/errorHandler.js';

const router = express.Router();

const updateOrCreateProfile = async (req, existingProfile, profileData) => {
    if (existingProfile) {
        Object.assign(existingProfile, profileData);
    } else {
        existingProfile = new CarerProfileModel(profileData);
    }
    if (req.file) {
        existingProfile.profileImage = `/uploads/carer_profile_image/${req.file.filename}`;
    }
    await existingProfile.save();
};

router.post('/profile', verifyToken, carerProfileUpload.single('avatar'), async (req, res) => {
    try {
        const profileData = req.body;
        const existingProfile = await CarerProfileModel.findOne({ userId: profileData.userId })
    
        await updateOrCreateProfile(req, existingProfile, profileData);
    
        res.status(201).send({ message: existingProfile ? 'Profile updated successfully!' : 'Profile created successfully!' });
    } catch (error) {
        handleError(res, error, 'Failed to create profile.');}
});

router.get('/context',verifyToken, async (req, res, next) => {
    try {
        // Assuming that after verifying the token, the user's ID is available in req.user.id
        const userId = req.user.id;
    
        // Fetch user details
        const user = await CarerModel.findById(userId).select('-password') // Excluding the password for security reasons

        res.json({
            user
        });
    } catch (error) {
        handleError(res, error, 'Error fetching user context:');}
    }
)

router.get('/profile', async (req, res) => {
    const userId = req.query.userId; // Retrieve user ID from the query parameter

    try {
        // Retrieve the profile data from the database based on the userId
        const profileData = await CarerProfileModel.findOne({ userId: userId })

        if (!profileData) {
            // Return a response indicating that no profile exists
            return res.status(204).send({ message: 'No profile found.' })
        }

        res.status(200).send(profileData)
    } catch (error) {
        handleError(res, error, "Error while fetching profile:")
    }
});

router.delete('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.query.userId

        await CarerProfileModel.findOneAndDelete({ userId: userId })
        
        res.status(200).send({ message: 'Profile deleted successfully!' })
    } catch (error) {
        handleError(res, error, 'Error deleting profile:')
    }
    });

// for carer profiles to be displayed on homepage
router.get('/carer-profiles', async (req, res) => {
    try {
        const carerProfiles = await CarerProfileModel.find()
        res.json(carerProfiles)
    } catch (error) {
        handleError(res, error, 'Error fetching carer profiles:')
    }
});

router.get('/carer/:id', async (req, res) => {
    try {
        const carer = await CarerModel.findById(req.params.id)
        if (carer) {
            res.json(carer);
        } else {
            res.status(404).send('Carer not found')
        }
    } catch (error) {
        handleError(res, error, 'Error fetching carer profiles:')
    }
});

router.get('/confirmedBookings', async (req, res) => {
    const { carerId } = req.query

    try {
        // Fetch bookings where status is 'approved' and userId matches
        const bookings = await BookingModel.find({ carerId, status: 'Approved' })
        res.status(200).json(bookings)
    } catch (error) {
        handleError(res, error, 'Error fetching carer confirmed bookings:')
    }
});

router.put('/booking/updateStatus', async (req, res) => {
    const { bookingId, status } = req.body;

    if (!bookingId || !['Approved', 'Denied'].includes(status)) {
        return res.status(400).send({ message: 'Invalid input.' })
    }
    try {
        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
        return res.status(404).send({ message: 'Booking not found.' })
        }
        booking.status = status
        await booking.save()
        console.log(`Booking ID: ${bookingId} status updated to ${status}`)
        res.status(200).send({ message: 'Booking status updated successfully.' })
    } catch (error) {
        handleError(res, error, 'Error updating booking:')
    }
});

export default router

