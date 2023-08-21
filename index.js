import app from './app.js'
import dotenv from 'dotenv'
import { dbConnection } from './db.js';

dotenv.config()

dbConnection()

const port = 4001

app.listen(port, () => {
    console.log(`Server started and listening on port ${port}`);
});




