import express from 'express';
import {register, login, test} from '../controllers/auth.js';
import cors from 'cors'

const router = express.Router();

// middleware
// router.use(
//     cors({
//         credentials: true,
//         origin: 'https://localhost:5173'
//     })
// )

router.get('/test', test)

router.post('/register', register)
router.post('/login', login)

export default router