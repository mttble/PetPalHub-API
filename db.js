import { ATLAS_DB_URL } from './config.js'
import mongoose from 'mongoose'

async function dbClose() {
    await mongoose.connection.close()
    console.log('Database disconnected')
}


const dbConnection = async () => {
    // Determine the correct database URL based on the environment
    const dbURL = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.ATLAS_DB_URL;

    try {
        await mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
        
        console.log('Mongoose connected to', dbURL);

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        // Exit the process with failure
        process.exit(1);
    }
};



export { dbClose, dbConnection }