import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { CarerModel } from '../models/Carer.js';

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




