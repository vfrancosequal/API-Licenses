const request = require('supertest');
const mongoose = require('mongoose');
import Usuario from '../models/Users.js';
import app from '../index';

// Prueba de integración para la API
describe('GET /api/users', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/db_turismo');
  });

  afterEach(async () => {
    await Usuario.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Get all users from data base', async () => {
    const response = await request(app).get('/api/users');
    const users = [
      { nombreUsuario: 'Ana lopez', celularUsuario: 54545454 },
      { nombreUsuario: 'Pepito perez', celularUsuario: 76767676 },
    ];
    await Usuario.insertMany(users);

    jest.setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(users.length);
      expect(response.body[0].nombreUsuario).toBe(users[0].nombreUsuario);
      expect(response.body[1].celularUsuario).toBe(users[1].celularUsuario);
    }, 1000);

  });
});
