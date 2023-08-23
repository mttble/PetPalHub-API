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
    const Model = req.body.role === 'user' ? UserModel : CarerModel;
    const roleMessage = req.body.role === 'user' ? 'User' : 'Carer';
    
    try {
        const emailExists = await checkExistingEmail(req.body.email, Model);
        if (emailExists) {
            return res.json({error: `Email already exists as ${roleMessage}`});
        }

        const hashedPassword = await validateAndHashPassword(req.body.password);
        validateDateOfBirth(req.body.dateOfBirth);
        
        if (hashedPassword === false) {
            return res.json({error: "Password must contain: at least one lowercase letter, one uppercase letter, one number, one special character and be at least 8 characters in length"});
        }

        let parsedDate = req.body.dateOfBirth ? moment.utc(req.body.dateOfBirth, "DD/MM/YYYY").toDate() : undefined;

        const details = {
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
            role: req.body.role
        };

        const newRegister = new Model(details);
        const savedRegister = await newRegister.save();

        const registerObject = savedRegister.toObject();
        if (registerObject.dateOfBirth) {
            registerObject.dateOfBirth = moment.utc(registerObject.dateOfBirth).format('DD/MM/YYYY');
        }
        delete registerObject.password;

        res.status(201).json({ message: `${roleMessage} registered successfully!`, register: registerObject });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: `Error registering the ${roleMessage}`, error: error.message });
    }
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


