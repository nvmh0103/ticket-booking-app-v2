import request from 'supertest';
import mongoose from 'mongoose'
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTIcket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    return ticket;
}

it(' Get all orders of a user', async() => {
    // create 3 tickets
    const ticketOne = await buildTIcket();
    const ticketTwo = await buildTIcket();
    const ticketThree = await buildTIcket();
    
    const userOne = global.signin();

    const userTwo = global.signin();

    // create one order as userOne
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId : ticketOne.id})
        .expect(201)

    // create two order as userTwo
    const { body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId : ticketTwo.id})
        .expect(201)

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId : ticketThree.id})
        .expect(201)

    // make request to get orders for userTwo
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);


    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
})