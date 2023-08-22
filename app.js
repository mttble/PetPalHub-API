import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoute.js'
import usersRoutes from './routes/usersRoute.js'


import {register} from './controllers/auth.js'


const app = express()



app.use(cookieParser())


const corsOptions = {
    credentials: true,
    origin: 'http://localhost:5173'
}

app.use(cors(corsOptions))

app.use(express.json())

app.get('/', app.get('/', (request, response) => response.send({ info: 'API!' })))

app.use('/auth', authRoutes)

app.get('/test', authRoutes)

app.post('/register', register)
app.use('/user', usersRoutes)



export default app