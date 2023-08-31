import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from 'moment';
import { CarerModel } from "../models/Carer.js";
import { UserModel } from "../models/User.js";
import { checkExistingEmail, validateAndHashPassword, validateDateOfBirth } from '../utils/validation.js';
import { JWT_SECRET } from '../config.js'


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
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                postalCode: req.body.postalCode,
                country: req.body.country
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

        res.status(200).json({ message: 'registered successfully!', register: registerObject });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Error registering', error: error.message });
    }
}


export const changeDetails = async (req, res, next) => {
    try {
        const userId = req.params.userId; // Extract userId from route parameter
        const userRole = req.params.userRole; // Extract userRole from route parameter

        const Model = userRole === 'user' ? UserModel : CarerModel

        const existingUser = await Model.findById(userId); // Fetch the existing user

        if (!existingUser) {
            return res.json({ error: 'User not found' })
        }
        const tokenName = userRole === 'user' ? 'userToken' : 'carerToken';
        const token = req.cookies[tokenName]
        if (!token) {
            return res.json({ error: 'Unauthorized' });
        }
        try {
            jwt.verify(token, JWT_SECRET)
        } catch (error) {
            return res.json({ error: 'Unauthorized' });
        }
        const emailExists = await checkExistingEmail(req.body.email, UserModel, CarerModel)
        if (emailExists) {
            return res.json({ error: 'Email already exists' })
        }

        existingUser.email = req.body.email || existingUser.email
        existingUser.phoneNumber = req.body.phoneNumber || existingUser.phoneNumber

        if (req.body.password) {
            // Hash the new password before saving
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            existingUser.password = hashedPassword;
        }
        
        existingUser.address.country = req.body.country || existingUser.address.country;
        existingUser.address.state = req.body.state || existingUser.address.state;
        existingUser.address.city = req.body.city || existingUser.address.city;
        existingUser.address.street = req.body.street || existingUser.address.street;
        existingUser.address.postalCode = req.body.postalCode || existingUser.address.postalCode

        const updatedUser = await existingUser.save();

        res.status(200).json({ message: 'User details updated successfully!', user: updatedUser });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Error updating user details', error: error.message });
    }
}


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
        let model, role, tokenName;
        if (user) {
            model = UserModel;
            role = 'user'
            tokenName = "userToken"
        } else if (carer) {
            model = CarerModel;
            role = 'carer'
            tokenName = "carerToken"
        }

        // Check if the provided password matches the stored hash
        const foundUser = user || carer;
        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordCorrect) {
            return res.status(404).json({ error: "Password is incorrect" });
        } else if (isPasswordCorrect) {
            // Destructuring the user details and excluding password and any other sensitive information
            const { password: userPassword, ...otherDetails } = foundUser._doc;

        // Create and send an authentication token
            const token = jwt.sign({ id: foundUser._id, firstName: foundUser.firstName, role: foundUser.role, email: foundUser.email }, JWT_SECRET, {}, (err, token) => {
                const userObject = foundUser.toObject();
                const { password, ...userWithoutPassword } = userObject;
                res.cookie(tokenName, token, {httpOnly: false, sameSite: 'none', secure: true}).json({...userWithoutPassword, userId: foundUser._id});
            })}

    } catch (err) {
        console.error("Error during login:", err);
        next(err);
    }
}

export const getProfile = (req, res) => {
    const tokenName = req.baseUrl === '/users' ? 'userToken' : 'carerToken' // Adjust based on the route
    const token = req.cookies[tokenName] // Get the token from the cookies

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                // Token verification failed
                console.error("Error verifying token:", err);
                res.status(401).json({ error: "Unauthorized" });
            } else {
                // Token verification succeeded, return the user's data
                res.json(decodedToken);
            }
        });
    } else {
        // No token found in cookies
        res.status(401).json({ error: "Unauthorized" });
    }
}

