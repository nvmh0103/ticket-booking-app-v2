import request from 'supertest';
import { app } from '../../app';

it('has a route listening to /api/tickets for posts', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})
    expect(response.status).not.toEqual(404);
})

it('can be accessed if user is signed in!', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401)
    
})

it('return other status if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({})
    expect(response.status).not.toEqual(401);
})


it('return error if invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400);

        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10
        })
        .expect(400);
})

it('return error if invalid price is provided', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abcd',
        price: -10
    })
    .expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abcd',
    })
    .expect(400);
})

it('success if provide valid title and price', async () => {
    await request(app)
        .post('/api/tickets')
        .send({
            ticket: 'sadad',
            price: 20
        })
        .expect(201)
})
