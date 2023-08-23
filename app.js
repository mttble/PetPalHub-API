import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import usersRoutes from './routes/usersRoute.js'
import multer from 'multer'


import { verifyUserOnlyToken } from './utils/verifyToken.js';
import { register, login, getProfile } from './controllers/auth.js'
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
app.use('/user', usersRoutes)
app.post('/login', login)

app.post('/petcreation', verifyUserOnlyToken, petcreation)




export default app