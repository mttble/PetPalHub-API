import { PetModel } from '../models/Pet.js';

export const petcreation = async (req, res) => {
    let imageUrl = "";

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    const pet = new PetModel({
        petName: req.body.petName,
        breed: req.body.breed,
        age: req.body.age,
        gender: req.body.gender,
        medicalConditions: req.body.medicalConditions,
        emergencyContact: req.body.emergencyContact,
        specialInstructions: req.body.specialInstructions,
        ownerId: req.user.id,
        petImage: imageUrl
    });

    try {
        const savedPet = await pet.save();
        res.status(201).send(savedPet);
    } catch (err) {
        res.status(400).send(err.message);
    }
}


export const uploadpetimage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    try {
        const pet = await PetModel.findById(req.body.petId);
        if (!pet) return res.status(404).send("Pet not found");

        pet.petImage = imageUrl;
        await pet.save();
        res.status(200).json({ imageUrl: imageUrl });
    } catch (err) {
        res.status(500).send(err.message);
    }
}


