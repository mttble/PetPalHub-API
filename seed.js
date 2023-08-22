import {dbClose, dbConnection} from "./db.js";
import {UserModel} from "./models/User.js";
import dotenv from 'dotenv'


dotenv.config()

dbConnection()


const users = [
    {firstName: 'Seeded1', lastName:'Seeded1',email: '111111@gmail.com', password: '1111Abc!'},
    {firstName: 'Seeded2', lastName:'Seeded2',email: '222222@gmail.com', password: '2222Abc!'},
]


await UserModel.deleteMany()
console.log('Deleted Users')
const cats = await UserModel.insertMany(users)
console.log('Inserted Users')

dbClose()

