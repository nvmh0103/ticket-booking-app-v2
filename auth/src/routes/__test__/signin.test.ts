import request from 'supertest';
import { app } from '../../app';

it('Fails when enter an email that does not exists', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email:'something@gmail.com',
            password:' something'
        })
        .expect(400)
})

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password: 'password'
        })
        .expect(201)
    await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password: 'password1'
        })
        .expect(400)
})

it('Response with cookies when provide valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password: 'password'
        })
        .expect(201);
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password: 'password'
        })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
})