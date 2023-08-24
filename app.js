import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import usersRoutes from './routes/usersRoute.js'
import multer from 'multer'
import jwt from "jsonwebtoken"


import { verifyToken } from './utils/verifyToken.js';
import { register, login } from './controllers/auth.js'
import { getProfile } from './controllers/auth.js'
import { petcreation, uploadpetimage } from './controllers/pet.js'


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
app.use('/uploads', express.static('uploads'));


app.get('/', app.get('/', (request, response) => response.send({ info: 'API!' })))
app.post('/register', register)
app.post('/login', login,)



app.use('/user', usersRoutes)


app.post('/petcreation', verifyToken, upload.single('petImage'), petcreation)




// Unified profile route with user type as a parameter
app.get('/profile/:userType', verifyToken, (req, res) => {
    const tokenName = req.params.userType === 'user' ? 'userToken' : 'carerToken';
    
    const token = req.cookies[tokenName];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.error("Error verifying token:", err);
                res.status(401).json({ error: "Unauthorized" });
            } else {
                res.json(decodedToken);
            }
        });
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
});



export default app