import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('Get the order', async () =>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price:20
    });
    await ticket.save();

    const user = global.signin();

    // make request to build order
    const {body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send( {ticketId: ticket.id })
        .expect(201);

    // get the order
    const {body: fecthedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);
    expect(fecthedOrder.id).toEqual(order.id)
})

it('returns error if a user try to get an order not belongs to them', async () =>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price:20
    });
    await ticket.save();

    const user = global.signin();

    // make request to build order
    const {body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send( {ticketId: ticket.id })
        .expect(201);

    // get the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(400);
})