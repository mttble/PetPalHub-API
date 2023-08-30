import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { petUpload } from '../utils/uploadConfig.js';
import { PetModel } from '../models/Pet.js';
import { handleError } from '../utils/errorHandler.js';



const router = express.Router();

// allows user to create a pet profile
router.post('/profile', verifyToken, petUpload.single('petImage'), async (req, res) => {
  try {
      const profileData = req.body;
      if (req.file) {
          profileData.petImage = `/uploads/pet_image/${req.file.filename}`
      }
      const newPetProfile = new PetModel(profileData);
      await newPetProfile.save();
      res.status(201).send({ message: 'Profile created successfully!' })
  } catch (error) {
      handleError(res, error, 'Failed to create profile.')
  }
});

// for users to view their pet profiles in account
router.get('/pet-profiles', async (req, res) => {
  try {
    const userId = req.query.userId; // Get the userId from the query parameter
    const petProfiles = await PetModel.find({ ownerId: userId }) // Fetch pet profiles owned by the specified user
    res.json(petProfiles)
  } catch (error) {
    handleError(res, error, 'Error fetching pet profiles:')
  }
});



router.delete('/:petId', verifyToken, async (req, res) => {
  try {
      const petId = req.params.petId;
      await PetModel.findByIdAndDelete(petId);
      res.status(200).json({ message: 'Pet deleted successfully.' });
  } catch (error) {
    handleError(res, error, 'Failed to delete profile.')
  }
})

// allows user and carer to see pet profile in petpal request
router.get('/view/:petId', async (req, res) => {
  try {
      const { petId } = req.params
      const petProfile = await PetModel.findById(petId)
      if (petProfile) {
          res.json(petProfile);
      } else {
          res.status(404).send('Pet profile not found')
      }
  } catch (error) {
    handleError(res, error, 'Failed to fetch pet profile.')
  }
});

export default router


