import {dbClose, dbConnection} from "./db.js";
import {UserModel} from "./models/User.js";
import dotenv from 'dotenv'


dotenv.config()

dbConnection()


const users = [
    {firstName: 'John', lastName:'Smith',email: '111111@sina.com', password: '111111'},
    {firstName: 'Tom', lastName:'Hardy',email: '222222@gmail.com', password: '222222'},
]


await UserModel.deleteMany()
console.log('Deleted Users')
const cats = await UserModel.insertMany(users)
console.log('Inserted Users')

dbClose()

