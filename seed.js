import { UserModel, dbClose} from "./db.js";


const users = [
    {firstName: 'John', lastName:'Smith',},
    {firstName: 'Tom', lastName:'Hardy',}
]


await UserModel.deleteMany()
console.log('Deleted Users')
const cats = await UserModel.insertMany(users)
console.log('Inserted Users')

dbClose()