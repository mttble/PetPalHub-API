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

export default router



router.post('/profile',verifyToken, carerProfileUpload.single('avatar'), async (req, res) => {
    try {
      const profileData = req.body;
      if (req.file) {
        profileData.profileImage = `/uploads/carer_profile_image/${req.file.filename}`;
        }
      const newCarerProfile = new CarerProfileModel(profileData);
      await newCarerProfile.save();
      res.status(201).send({ message: 'Profile created successfully!' });
    } catch (error) {
        console.error("Error while creating profile:", error);
        res.status(500).send({ message: 'Failed to create profile.', error: error.message });
      }
  });

