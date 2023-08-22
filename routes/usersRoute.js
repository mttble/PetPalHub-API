import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
const router = express.Router();

router.get("/checkauthentication", verifyToken, (req,res,next) => {
    const Admin = req.user.isAdmin
    const Carer = req.user.isCarer
    if (Admin) {
        res.send("Wow, you're logged in as an Admin!")}
    if (Carer) {
        res.send("Hello, you're logged in as a Carer!")}

    res.send("Hello, you're logged in as a User!");
})


export default router
