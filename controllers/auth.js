import {UserModel} from "../models/User.js"
import {CarerModel} from "../models/Carer.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import moment from 'moment';
import { checkExistingEmail, validateAndHashPassword, validateDateOfBirth } from '../utils/validation.js'

export const test = async (req, res, next) => {
    res.json('test is working')
}

export const register = async (req, res, next) => {
   // when user register as User
    if (req.body.isCarer === false){ 
        try {
            const emailExists = await checkExistingEmail(req.body.email, UserModel);
            if (emailExists) {
                return res.json({error: "Email already exists as User"});
            }

            const hashedPassword = await validateAndHashPassword(req.body.password);
            validateDateOfBirth(req.body.dateOfBirth)
            if (hashedPassword === false) {
                return res.json({error: "Password must contain: at least one lowercase letter, one uppercase letter, one number, one special character and be at least 8 characters in length"})
            }

            let parsedDate
            if (req.body.dateOfBirth) {
                parsedDate = moment.utc(req.body.dateOfBirth, "DD/MM/YYYY").toDate()}
            else {parsedDate = undefined}
            

            const newUser = new UserModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashedPassword,
                dateOfBirth: parsedDate,
                profileImage: req.body.profileImage,
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
            res.status(201).json({ message: "User registered successfully!", user: userObject });

        } catch (error) {
            console.error("Error:", error);
            // Catch any errors and send an error response
            res.status(500).json({ message: "Error registering the user", error: error.message });
        }}
    // when user register as Carer
    if (req.body.isCarer === true){ 
        try {
            const emailExists = await checkExistingEmail(req.body.email, CarerModel);
            if (emailExists) {
                return res.json({error: "Email already exists as Carer"});
            }

            const hashedPassword = await validateAndHashPassword(req.body.password);
            validateDateOfBirth(req.body.dateOfBirth)
            if (hashedPassword === false) {
                return res.json({error: "Password must contain: at least one lowercase letter, one uppercase letter, one number, one special character and be at least 8 characters in length"})
            }

            let parsedDate
            if (req.body.dateOfBirth) {
                parsedDate = moment.utc(req.body.dateOfBirth, "DD/MM/YYYY").toDate()}
            else {parsedDate = undefined}

            const newCarer = new CarerModel({
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
    
                // Save the new carer to the database
                const savedCarer = await newCarer.save();
                const carerObject = savedCarer.toObject(); // Convert the Mongoose document to a plain JavaScript object
                if (carerObject.dateOfBirth) {
                    carerObject.dateOfBirth = moment.utc(carerObject.dateOfBirth).format('DD/MM/YYYY');
                }
                delete carerObject.password; // Remove the password
                res.status(201).json({ message: "Carer registered successfully!", carer: carerObject });
    
            } catch (error) {
                console.error("Error:", error);
                // Catch any errors and send an error response
                res.status(500).json({ message: "Error registering the user", error: error.message });
            }}


}


export const login = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({email:req.body.email})
        if(!user)
            return res.json({
                error: "User not found"
        })

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordCorrect)
            return res.json({
                error: "Password is incorrect"
            })
        if (isPasswordCorrect) {
            res.json('Passwords match')
        }


        const {password, isAdmin, ...otherDetails} = user._doc

        const token = jwt.sign({id:user._id, isCarer:req.body.isCarer}, process.env.JWT_SECRET, {}, (err, token) => {
        if(err) throw err;
        res.cookie("access_token", token,{httpOnly: true,}).status(200).json({...otherDetails})
        })
    }catch(err){
        next(err);
    }
}


