import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import jwt from "jsonwebtoken"
import multer from 'multer'
import carersRoutes from './routes/carersRoute.js'
import usersRoutes from './routes/usersRoute.js'


import { verifyToken } from './utils/verifyToken.js';
import { register, login } from './controllers/auth.js'
import { booking } from './controllers/user.js'
import { petcreation, uploadpetimage } from './controllers/pet.js'

import { CarerModel } from './models/Carer.js'
import { UserModel } from './models/User.js'


const app = express()

app.use(cookieParser())

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:5173'
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });



app.use(cors(corsOptions))
app.use(express.json())
app.use('/user', usersRoutes)
app.use('/carer', carersRoutes)
app.use('/uploads', express.static('uploads'));



app.get('/', app.get('/', (request, response) => response.send({ info: 'API!' })))
app.post('/register', register)
app.post('/login', login,)

app.post('/booking', verifyToken, booking)

app.use('/user', usersRoutes)




app.post('/petcreation', verifyToken, upload.single('petImage'), petcreation)


// Unified profile route with user type as a parameter
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