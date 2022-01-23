import request from 'supertest';
import { app } from '../../app';

it('Returns a 201 on successfully sign up', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'something'
        })
        .expect(201)
})


it('Returns a 400 for an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@',
            password: 'something'
        })
        .expect(400)
})

it('Returns a 400 for an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@gmail.com',
            password: '1'
        })
        .expect(400)
})

it('Returns a 400 when missing email or password', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email:"test@gmail.com"
    })
    .expect(400)
    request(app)
        .post('/api/users/signup')
        .send({
            password:"something"
        })
        .expect(400)
})

it('Disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@gmail.com',
            password:'password'
        })
        .expect(201)
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@gmail.com',
            password:'password'
        })
        .expect(400)
})

it('Sets a cookie after successfully signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@gmail.com',
            password:'password'
        })
        .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined();
})