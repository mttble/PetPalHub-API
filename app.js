import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json())

app.get('/', app.get('/', (request, response) => response.send({ info: 'API!' })))


export default app