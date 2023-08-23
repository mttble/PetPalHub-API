import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import usersRoutes from './routes/usersRoute.js'

import { verifyUserOnlyToken } from './utils/verifyToken.js';
import { register, login, getProfile } from './controllers/auth.js'
import { petcreation } from './controllers/pet.js'


const app = express()

app.use(cookieParser())

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:5173'
}

app.use(cors(corsOptions))

app.use(express.json())

app.get('/', app.get('/', (request, response) => response.send({ info: 'API!' })))

app.post('/register', register)
app.use('/user', usersRoutes)
app.post('/login', login)

app.post('/petcreation', verifyUserOnlyToken, petcreation)

app.use('/profile', getProfile)




export default app