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
    try {
        const emailExists = await checkExistingEmail(req.body.email, UserModel, CarerModel);
        
        if (emailExists) {
            return res.json({ error: 'Email already exists' });
        }

        const Model = req.body.role === 'user' ? UserModel : CarerModel;

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

        res.status(201).json({ message: 'registered successfully!', register: registerObject });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Error registering', error: error.message });
    }
}


// export const login = async (req, res, next) => {
//     try {
//         const user = await UserModel.findOne({email:req.body.email})
//         if(!user)
//             return res.json({
//                 error: "User not found"
//         })

//         const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
//         if(!isPasswordCorrect)
//             return res.json({
//                 error: "Password is incorrect"
//             })
//         if (isPasswordCorrect) {
//             res.json('Passwords match')
//         }


//         const {password, isAdmin, ...otherDetails} = user._doc

//         const token = jwt.sign({id:user._id, role:req.body.role}, process.env.JWT_SECRET, {}, (err, token) => {
//         if(err) throw err;
//         res.cookie("access_token", token,{httpOnly: true,}).status(200).json({...otherDetails})
//         })
//     }catch(err){
//         next(err);
//     }
// }


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find the user by email in the users collection
        const user = await UserModel.findOne({ email });
        // Find the carer by email in the carers collection
        const carer = await CarerModel.findOne({ email });

        // Check if the provided email exists in either users or carers collection
        if (!user && !carer) {
            return res.status(404).json({ error: "User not found" })
        }

        // Determine which model to use based on the found user or carer
        let model;
        if (user) {
            model = UserModel;
        } else if (carer) {
            model = CarerModel;
        }

        // Check if the provided password matches the stored hash
        const foundUser = user || carer;
        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordCorrect) {
            return res.status(404).json({ error: "Password is incorrect" });
        }

        // Destructuring the user details and excluding password and any other sensitive information
        const { password: userPassword, ...otherDetails } = foundUser._doc;

        // Create and send an authentication token
        const token = jwt.sign({ id: foundUser._id, role: foundUser.role }, process.env.JWT_SECRET);
        res.cookie("access_token", token, { httpOnly: true }).status(200).json({ ...otherDetails });

    } catch (err) {
        console.error("Error during login:", err);
        next(err);
    }
}
