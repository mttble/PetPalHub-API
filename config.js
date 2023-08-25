import dotenv from 'dotenv';
dotenv.config();


export const ATLAS_DB_URL = process.env.ATLAS_DB_URL
export const JWT_SECRET = process.env.JWT_SECRET
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;