import nodemailer from 'nodemailer';
import {EMAIL_USERNAME, EMAIL_PASSWORD } from '../config.js'

// Setup mail transporter service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
});

export const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME, // sender
        to, // receiver
        subject, // Subject
        text, // plaintext body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending the email', error);
        throw error
    }
};
