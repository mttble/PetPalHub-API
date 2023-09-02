import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import jwt from "jsonwebtoken"
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { changeDetails, login, register } from './controllers/auth.js'
import { CarerModel } from './models/Carer.js'
import { UserModel } from './models/User.js'
import carersRoutes from './routes/carersRoute.js'
import petsRoutes from './routes/petsRoute.js'
import usersRoutes from './routes/usersRoute.js'

const app = express()

app.use(cors({
    credentials: true,
    origin: 'https://petpalhub.au'
}))

const corsOptions = {
    origin: 'https://petpalhub.au',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cookieParser())
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
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