const request = require('supertest');
const mongoose = require('mongoose');
import Usuario from "../models/Users.js";
import app from '../index';

describe('Tests for the API', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/db_turismo')
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })

    describe('POST /api/users', ()=> {

        const newUser = {nombreUsuario: 'Correct user', celularUsuario: '4446950'}
        const wrongUser = {nombre: 'Wrong user'}

        afterAll(async()=>{
            await Usuario.deleteMany({nombreUsuario: 'Correct user'})
        })

        it('The route works', async () => {
            const response = await request(app).post('/api/users').send(newUser)

            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toContain('json')
        })

        it('Insert a new user', async ()=>{
            const response = await request(app).post('/api/users').send(newUser)

            jest.setTimeout(() => {
                expect(response.status).toBe(200);
                expect(response.body._id).toBeDefined()
                expect(response.body.nombreUsuario).toBe(newUser.nombreUsuario);
            }, 1000);

        })

        it("Don't insert a new user", async ()=>{
            const response = await request(app).post('/api/users').send(wrongUser)

            jest.setTimeout(()=>{
                expect(response.status).toBe(500)
                expect(response.error).toBeDefined()
            }, 1000)

        })
    })

    describe('GET /api/users', ()=>{

        let response
        beforeEach(async() =>{
            response = await request(app).get('/api/users').send()
        })

        it('The route works', async() => {            
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toContain('json')
        })

        it('Get all users', async() => {
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
        })

        it('If the route is wrong', async() => {
            const response = await request(app).get('/api/user')
            expect(response.status).toBe(404)
        })
    })

    describe('PUT /api/users', ()=>{
        let user
        const updateUser = {nombreUsuario: 'Update user', celularUsuario: '4446950'}
        beforeEach(async ()=>{
            user = await Usuario.create(updateUser)
        })

        afterEach(async ()=>{
            await Usuario.findByIdAndDelete(user._id)
        })

        it('Route works', async ()=>{
            const response = await request(app).put(`/api/users/${user._id}`).send(updateUser)
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toContain('json')

        })

        it('User Updated', async ()=>{
            const response = await request(app).put(`/api/users/${user._id}`).send({nombreUsuario:'User Updated'})
            jest.setTimeout(()=>{
                expect(response.status).toBe(200)
                expect(response.body.nombreUsuario).toBe('User Updated')
            }, 1000)

        })
    })

    describe('DELETE /api/users', ()=>{
        let user
        let response
        const deleteUser = {nombreUsuario: 'Delete user', celularUsuario: '4446950'}
        beforeEach(async()=>{
            user = await Usuario.create(deleteUser)
            response = await request(app).delete(`/api/users/${user._id}`).send()
        })

        it('The route works', ()=>{
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toContain('json')
        })

        it('Delete a user', async()=>{
            const userFund = await Usuario.findById(user._id)
            jest.setTimeout(()=>{
                expect(response.body._id).toBeDefined()
                expect(userFund).toBeNull()
            }, 1000)
        })

    })

})