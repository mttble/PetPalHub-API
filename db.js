import mongoose from 'mongoose'
import dotenv from 'dotenv'


dotenv.config()

async function dbClose() {
    await mongoose.connection.close()
    console.log('Database disconnected')
  }

mongoose.connect(process.env.ATLAS_DB_URL)
//   .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed to connect'))
  .catch(err => console.error(err))


  const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true }
  })

  const UserModel = mongoose.model('User', userSchema)


  export {UserModel, dbClose} 