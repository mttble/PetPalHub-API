import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import jwt from "jsonwebtoken"
import carersRoutes from './routes/carersRoute.js'
import usersRoutes from './routes/usersRoute.js'
import petsRoutes from './routes/petsRoute.js'
import { login, register, changeDetails} from './controllers/auth.js'
import { CarerModel } from './models/Carer.js'
import { UserModel } from './models/User.js'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express()

const corsOptions = {
    credentials: true,
    origin: 'https://petpalhub.netlify.app/'
}
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use('/user', usersRoutes)
app.use('/carer', carersRoutes)
app.use('/pet', petsRoutes)
app.use('/uploads', express.static('uploads'));
app.post('/register', register)
app.post('/login', login,)
app.put('/change-details/:userRole/:userId', changeDetails)

// create two empty folder for uploaded files
const createFolderIfNotExist = (folderPath) => {
    if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath, { recursive: true });
    }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const petImageFolder = path.join(__dirname, 'uploads/pet_image');
const carerProfileImageFolder = path.join(__dirname, 'uploads/carer_profile_image');
createFolderIfNotExist(petImageFolder);
createFolderIfNotExist(carerProfileImageFolder);

// Unified profile route with user type as a parameter utilised for useContext in frontend
app.get('/profile',  (req, res) => {
    const carerToken = req.cookies.carerToken;
    const userToken = req.cookies.userToken;

    if (carerToken) {
        jwt.verify(carerToken, process.env.JWT_SECRET, async (err, user) => {
            if (err) throw err;
            const {firstName, email, _id, role} = await CarerModel.findById(user.id)
            res.json({firstName, email, _id, role})
        })
    } else if (userToken) {
        jwt.verify(userToken, process.env.JWT_SECRET, async (err, user) => {
            if (err) throw err;
            const {firstName, email, _id, role} = await UserModel.findById(user.id)
            res.json({firstName, email, _id, role})
        })
    } else {
        res.json(null)
    }
});

export default app