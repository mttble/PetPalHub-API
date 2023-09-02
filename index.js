import './config.js';
import app from './app.js';
import { dbConnection } from './db.js';

dbConnection()

const port = 5505

app.listen(port, () => {
    console.log(`Server started and listening on port ${port}`);
});




