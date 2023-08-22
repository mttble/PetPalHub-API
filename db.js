import mongoose from 'mongoose'

async function dbClose() {
    await mongoose.connection.close()
    console.log('Database disconnected')
}


const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        
        console.log('Mongoose connected to', process.env.ATLAS_DB_URL);

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
}


export { dbClose, dbConnection }