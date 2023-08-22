import {dbClose, dbConnection} from "./db.js";
import {UserModel} from "./models/User.js";
import { CarerModel } from "./models/Carer.js";
import dotenv from 'dotenv'


dotenv.config()

dbConnection()


const users = [
    {firstName: 'UserSeeded1', lastName:'UserSeeded1',email: '111111@gmail.com', password: '1111Abc!'},
    {firstName: 'UserSeeded2', lastName:'UserSeeded2',email: '222222@gmail.com', password: '2222Abc!'},
]

const carers = [
    {firstName: 'CarerSeeded1', lastName:'CarerSeeded1',email: '111111@gmail.com', password: '1111Abc!'},
    {firstName: 'CarerSeeded2', lastName:'CarerSeeded2',email: '222222@gmail.com', password: '2222Abc!'},
]


await UserModel.deleteMany()
console.log('Deleted Users')
await CarerModel.deleteMany()
console.log('Deleted Carers')
const usersSeeded = await UserModel.insertMany(users)
console.log('Inserted Users')
const carersSeeded = await CarerModel.insertMany(carers)
console.log('Inserted Carers')

dbClose()

