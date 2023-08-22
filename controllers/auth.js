import {UserModel} from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import createError from 'http-errors';
import moment from 'moment';
import { checkExistingEmail, validateAndHashPassword, validateDateOfBirth } from '../utils/validation.js'

export const test = async (req, res, next) => {
    res.json('test is working')
}

export const register = async (req, res, next) => {
    try {
        await checkExistingEmail(req.body.email, UserModel);
        const hashedPassword = await validateAndHashPassword(req.body.password);
        validateDateOfBirth(req.body.dateOfBirth)
        const parsedDate = moment.utc(req.body.dateOfBirth, "DD/MM/YYYY").toDate();

        const newUser = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            dateOfBirth: parsedDate,
            profilepImage: req.body.profileImage,
            address: {
                street: req.body.address?.street,
                city: req.body.address?.city,
                state: req.body.address?.state,
                postalCode: req.body.address?.postalCode,
                country: req.body.address?.country
            },
            phoneNumber: req.body.phoneNumber,
            bio: req.body.bio,
            isCarer: req.body.isCarer
        });

        // Save the new user to the database
        const savedUser = await newUser.save();
        const userObject = savedUser.toObject(); // Convert the Mongoose document to a plain JavaScript object
        if (userObject.dateOfBirth) {
            userObject.dateOfBirth = moment.utc(userObject.dateOfBirth).format('DD/MM/YYYY');
        }
        delete userObject.password; // Remove the password
        delete userObject.isAdmin;  // Remove the isAdmin field
        res.status(201).json({ message: "User registered successfully!", user: userObject });

    } catch (error) {
        console.error("Error:", error);
        // Catch any errors and send an error response
        res.status(500).json({ message: "Error registering the user", error: error.message });
    }
}


export const login = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({email:req.body.email})
        if(!user) return next(createError(404, "User not found"))

       const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
       if(!isPasswordCorrect) 
            return next(createError(400, "Wrong password or username!"))


       const {password, isAdmin, ...otherDetails} = user._doc

       const token = jwt.sign({id:user._id, isAdmin:req.body.isAdmin, isCarer:req.body.isCarer}, process.env.JWT_SECRET, {}, (err, token) => {
        if(err) throw err;
        res.cookie("access_token", token,{httpOnly: true,}).status(200).json({...otherDetails})
        }
       )
        
    }catch(err){
        next(err);
    }
}


