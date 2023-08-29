import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { petUpload } from '../utils/uploadConfig.js';
import { PetModel } from '../models/Pet.js';



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
      console.error("Error while creating profile:", error)
      res.status(500).send({ message: 'Failed to create profile.', error: error.message })
  }
});

// for users to view their pet profiles in account
router.get('/pet-profiles', async (req, res) => {
  try {
    const userId = req.query.userId; // Get the userId from the query parameter
    const petProfiles = await PetModel.find({ ownerId: userId }) // Fetch pet profiles owned by the specified user
    res.json(petProfiles)
  } catch (error) {
    console.error('Error fetching pet profiles:', error)
    res.status(500).send('Server Error')
  }
});


// router.get('/pet-profiles/:id', async (req, res) => {
//     try {
//       const { id } = req.params; // Retrieve the id from request parameters
//       console.log(id);
//       const petProfile = await PetModel.findById(id); // Fetch pet profile by its id
//       if (petProfile) {
//           res.json(petProfile);
//       } else {
//           res.status(404).send('Pet profile not found')
//       }
//     } catch (error) {
//       console.error('Error fetching pet profile:', error)
//       res.status(500).send('Server Error')
//     }
// });

// allows user to delete pet profile
router.delete('/:petId', verifyToken, async (req, res) => {
  try {
      const petId = req.params.petId;
      await PetModel.findByIdAndDelete(petId);
      res.status(200).json({ message: 'Pet deleted successfully.' });
  } catch (error) {
      console.error('Error deleting pet:', error)
      res.status(500).send('Server Error')
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
      console.error('Error fetching pet profile:', error)
      res.status(500).send('Server Error')
  }
});

export default router