import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { CarerModel } from '../models/Carer.js';
import { CarerProfileModel } from '../models/CarerProfile.js';
import { carerProfileUpload } from '../utils/uploadConfig.js';
import { BookingModel } from '../models/Booking.js';

const router = express.Router();


router.get('/context',verifyToken, async (req, res, next) => {
    try {
        // Assuming that after verifying the token, the user's ID is available in req.user.id
        const userId = req.user.id;
    
        // Fetch user details
        const user = await CarerModel.findById(userId).select('-password'); // Excluding the password for security reasons

        res.json({
            user
        });

    } catch (err) {
        console.error('Error fetching user context:', err);
        res.status(500).send('Server Error');
    }
})

// creates profile is one doesn't exist or updates with new data if it does
router.post('/profile', verifyToken, carerProfileUpload.single('avatar'), async (req, res) => {
    try {
        const userId = req.body.userId;
        const profileData = req.body;

        // Check if a profile with the given user ID exists
        const existingProfile = await CarerProfileModel.findOne({ userId });

        if (existingProfile) {
            // Profile exists, update it with the new data
            existingProfile.companyFullName = profileData.companyFullName;
            existingProfile.location = profileData.location;
            existingProfile.aboutMe = profileData.aboutMe;
            existingProfile.experience = profileData.experience; // Fix this line
            existingProfile.petType = profileData.petType; // Fix this line
            existingProfile.additionalServices = profileData.additionalServices; // Fix this line

            // Update profile image if a new avatar is provided
            if (req.file) {
                existingProfile.profileImage = `/uploads/carer_profile_image/${req.file.filename}`;
            }

            // Save the updated profile
            await existingProfile.save();

            res.status(201).send({ message: 'Profile updated successfully!' });
        } else {
            // Profile doesn't exist, create a new profile
            if (req.file) {
                profileData.profileImage = `/uploads/carer_profile_image/${req.file.filename}`;
            }
            const newCarerProfile = new CarerProfileModel(profileData);
            await newCarerProfile.save();
            res.status(201).send({ message: 'Profile created successfully!' });
        }
    } catch (error) {
        console.error("Error while creating/updating profile:", error);
        res.status(500).send({ message: 'Failed to create/update profile.', error: error.message });
    }
});


router.get('/profile', async (req, res) => {
    const userId = req.query.userId; // Retrieve user ID from the query parameter

    try {
        // Retrieve the profile data from the database based on the userId
        const profileData = await CarerProfileModel.findOne({ userId: userId });

        if (!profileData) {
            // Return a response indicating that no profile exists
            return res.status(204).send({ message: 'No profile found.' });
        }

        res.status(200).send(profileData);
    } catch (error) {
        console.error("Error while fetching profile:", error);
        res.status(500).send({ message: 'Failed to fetch profile data.', error: error.message });
    }
});



router.delete('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.query.userId; // Retrieve user ID from the query parameter
        
        // Find and delete the carer profile based on the user ID
        await CarerProfileModel.findOneAndDelete({ userId: userId });
        
        // Optionally, you can also delete the user's associated data in other models, if needed
    
        res.status(200).send({ message: 'Profile deleted successfully!' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).send({ message: 'Failed to delete profile.', error: error.message });
    }
    });

// for carer profiles to be displayed on homepage
router.get('/carer-profiles', async (req, res) => {
    try {
        const carerProfiles = await CarerProfileModel.find();
        res.json(carerProfiles);
    } catch (error) {
        console.error('Error fetching carer profiles:', error);
        res.status(500).send('Server Error');
    }
});


router.get('/carer/:id', async (req, res) => {
    try {
        const carer = await CarerModel.findById(req.params.id);
        if (carer) {
            res.json(carer);
        } else {
            res.status(404).send('Carer not found');
        }
    } catch (error) {
        console.error('Error fetching carer:', error);
        res.status(500).send('Server Error');
    }
});

router.get('/bookings', async (req, res) => {
    try {
      const carerId = req.query.carerId;
      const bookings = await BookingModel.find({ carerId: carerId });
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings for carer:', error);
      res.status(500).send('Server Error');
    }
});


export default router

