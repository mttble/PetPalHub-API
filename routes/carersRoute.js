import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { getProfile } from '../controllers/auth.js';
const router = express.Router();

router.get('/profile', getProfile)

router.get('/context',verifyToken, async (req, res, next) => {
    try {
        // Assuming that after verifying the token, the user's ID is available in req.user.id
        const userId = req.user.id;

        // Fetch user details
        const user = await UserModel.findById(userId).select('-password'); // Excluding the password for security reasons

        // Fetch user's pets
        const pets = await PetModel.find({ ownerId: userId });

        // Combine and send the data
        res.json({
            user,
            pets
        });
    } catch (err) {
        console.error('Error fetching user context:', err);
        res.status(500).send('Server Error');
    }
})






export default router




