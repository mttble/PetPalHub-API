import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { getProfile } from '../controllers/auth.js';
const router = express.Router();

router.get("/checkauthentication", verifyToken, (req,res,next) => {
    const Carer = req.user.isCarer
    if (Carer) {
        res.send("You're logged in as a Carer!")}

    res.send("You're logged in as a User!");
})

router.get('/profile', getProfile)

export default router
