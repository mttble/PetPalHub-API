import dotenv from 'dotenv';
dotenv.config();


export const ATLAS_DB_URL = process.env.ATLAS_DB_URL
export const JWT_SECRET = process.env.JWT_SECRET
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;  //This app providing using Gmail as email sender, if you have 2-Step Verification of your Google account, you need to apply an App password and sign in with it. https://support.google.com/accounts/answer/185833?hl=en

