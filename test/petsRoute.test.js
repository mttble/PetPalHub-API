import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { PetModel } from '../models/Pet.js'; 
import { UserModel } from '../models/User'
import dotenv from 'dotenv';


dotenv.config();

let server;
beforeAll(async () => {
  server = app.listen(4000);

});

afterAll(async () => {

  await PetModel.deleteMany({});
  await UserModel.deleteMany({});
  await mongoose.connection.close();
  await new Promise(resolve => server.close(resolve));
});

async function loginUser(email, password, server) {
  const response = await request(server)
    .post('/login')
    .send({
      email,
      password
    });
  const userToken = response.headers['set-cookie'][0];
  return userToken;
}

describe('Pet Profile API', () => {
  let petId;
  let user;
  let userId
  let userToken

  it('Should register a new user', async () => {
    
    const response = await request(server)
      .post('/register') 
      .send({
        firstName: 'John1',
        lastName: 'Doe1',
        email: 'john.doe@example1.com',
        password: 'Password1!',
        dateOfBirth: '01/01/1990',
        role: 'user'
      });

    user = response.body.register;
    userId = user._id

    expect(response.status).toBe(200);
    expect(user.email).toBe('john.doe@example1.com');
  });

  it('Should login a user', async () => {
    userToken = await loginUser('john.doe@example1.com', 'Password1!', server);
    expect(userToken).toBeDefined(); 
  });


  it('Should create a new pet profile', async () => {
    const [owner] = await UserModel.find({ email: 'john.doe@example1.com' });
  
    const response1 = await request(server)
      .post('/pet/profile')
      .set('Cookie', [userToken])
      .send({
        ownerId : owner._id,
        petType: 'test',
        petName: 'test',
        breed: 'test',
        age: '12'
      });

    petId = response1.body.petId
    expect(response1.status).toBe(200);
  });

  it('Should fetch pet profiles for the user', async () => {
    const response = await request(server)
      .get(`/pet/pet-profiles?userId=${userId}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  it('Should view a specific pet profile', async () => {
    const response = await request(server)
      .get(`/pet/view/${petId}`);
    
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(petId); 
  });

  it('Should delete a pet profile', async () => {
    const response = await request(server)
      .delete(`/pet/${petId}`);
    
    expect(response.status).toBe(200);
  });




})



