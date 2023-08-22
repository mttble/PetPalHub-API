import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoute.js'
import usersRoutes from './routes/usersRoute.js'



const app = express()

app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))

app.use(express.json())

app.get('/', app.get('/', (request, response) => response.send({ info: 'API!' })))

app.use('/auth', authRoutes)
app.use('/user', usersRoutes)



export default app