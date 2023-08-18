import express from 'express'
import mongoose from 'mongoose'


mongoose.connect('mongodb+srv://admin:123456abcd@cluster0.katnsg0.mongodb.net/?retryWrites=true&w=majority')
    .then(m => console.log(m.connection.readyState === 1? "Mongoose connected!" : "Failed to connect Mongoose"))
const app = express()
const port = 4001



app.listen(port)