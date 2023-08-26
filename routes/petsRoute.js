import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { petUpload } from '../utils/uploadConfig.js';
import { PetModel } from '../models/Pet.js';



const router = express.Router();


router.post('/profile',verifyToken, petUpload.single('petImage'), async (req, res) => {
    try {
      const profileData = req.body;
      if (req.file) {
        profileData.petImage = `/uploads/pet_image/${req.file.filename}`;
        }
      const newPetProfile = new PetModel(profileData);
      await newPetProfile.save();
      res.status(201).send({ message: 'Profile created successfully!' });
    } catch (error) {
        console.error("Error while creating profile:", error);
        res.status(500).send({ message: 'Failed to create profile.', error: error.message });
      }
  });


export default router