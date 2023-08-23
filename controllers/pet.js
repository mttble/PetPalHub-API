import { PetModel } from '../models/Pet.js';


export const petcreation = async (req, res) => {
    const pet = new PetModel({
        petName: req.body.petName,
        breed: req.body.breed,
        age: req.body.age,
        gender: req.body.gender,
        medicalConditions: req.body.medicalConditions,
        emergencyContact: req.body.emergencyContact,
        specialInstructions: req.body.specialInstructions,
        ownerId: req.user.id
    });

    try {
        const savedPet = await pet.save();
        res.status(201).send(savedPet);
    } catch (err) {
        res.status(400).send(err.message);
    }
}

