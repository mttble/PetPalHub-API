import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { CarerModel } from '../models/Carer.js';
import { CarerProfileModel } from '../models/CarerProfile.js';
import { carerProfileUpload } from '../utils/uploadConfig.js';

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


router.post('/profile',verifyToken, carerProfileUpload.single('avatar'), async (req, res) => {
try {
    const profileData = req.body;
    if (req.file) {
    profileData.profileImage = `/uploads/carer_profile_image/${req.file.filename}`;
    }
    profileData.userId = req.body.userId
    const newCarerProfile = new CarerProfileModel(profileData);
    await newCarerProfile.save();
    res.status(201).send({ message: 'Profile created successfully!' });
} catch (error) {
    console.error("Error while creating profile:", error);
    res.status(500).send({ message: 'Failed to create profile.', error: error.message });
    }
});


router.get('/profile', async (req, res) => {
    const userId = req.query.userId; // Retrieve user ID from the query parameter

    try {
      // Retrieve the profile data from the database based on the userId
        const profileData = await CarerProfileModel.findOne({ userId: userId });

        if (!profileData) {
            return res.status(404).send({ message: 'Profile not found.' });
        }
    
        res.status(200).send(profileData);
        } catch (error) {
        console.error("Error while fetching profile:", error);
        res.status(500).send({ message: 'Failed to fetch profile data.', error: error.message });
        }
    });

router.get('/random-profile', async (req, res) => {
    try {
        // Count the total number of profiles in the database
        const totalProfiles = await CarerProfileModel.countDocuments();
        if (totalProfiles === 0) {
            return res.status(404).send({ message: 'No profiles found.' });
        }

        // Generate a random index between 0 and totalProfiles - 1
        const randomIndex = Math.floor(Math.random() * totalProfiles);

        // Find the profile at the random index
        const randomProfile = await CarerProfileModel.findOne().skip(randomIndex);

        res.status(200).send(randomProfile);
    } catch (error) {
        console.error("Error while fetching random profile:", error);
        res.status(500).send({ message: 'Failed to fetch random profile.', error: error.message });
    }
});


  export default router

