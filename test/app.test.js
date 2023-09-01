import request from 'supertest';
import app from '../app';  
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../models/User';

dotenv.config();

let server;
let userToken;
let user;

beforeAll(() => {
  server = app.listen(4000);
});

afterAll(async () => {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
  });
  
describe('Auth API', () => {
  it('Should register a new user', async () => {
    const response = await request(server)
      .post('/register') 
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password1!',
        dateOfBirth: '01/01/1990',
        role: 'user'
      });
    user = response.body.register;
    expect(response.status).toBe(200);
    expect(user.email).toBe('john.doe@example.com');
  });

  it('Should authenticate the user', async () => {
    const response = await request(server)
      .post('/login')
      .send({
        email: 'john.doe@example.com',
        password: 'Password1!'
      });

    userToken = response.header['set-cookie'][0].split(';')[0].split('=')[1];
    
    expect(response.status).toBe(200);
    expect(userToken).toBeDefined();
  });

  it('Should return profile information with a valid token', async () => {
    const response = await request(server)
      .get('/profile') 
      .set('Cookie', [`userToken=${userToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('john.doe@example.com');
  });
});
