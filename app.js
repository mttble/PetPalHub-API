import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoute.js'

const app = express()

app.use(cors())

app.use(express.json())

app.get('/', app.get('/', (request, response) => response.send({ info: 'API!' })))

app.use('/auth', authRoutes)



export default app