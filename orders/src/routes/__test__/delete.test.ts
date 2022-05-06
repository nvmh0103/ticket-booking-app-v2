import request from 'supertest';
import mongoose from 'mongoose'
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';


it(' Change the order status to cancelled', async() => {
    // create ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();
    // make request to create order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id})
        .expect(201);
    // make request to cancel order
    const {body: fetchedOrder } = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    const updatedOrder = await Order.findOne({id: order.id});
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

// it('emits an order cancelled event', async () => {
//     const ticket = Ticket.build({
//         id: new mongoose.Types.ObjectId().toHexString(),
//         title: 'concert',
//         price: 20
//     });
//     await ticket.save();

//     const user = global.signin();
//     // make request to create order
//     const { body: order } = await request(app)
//         .post('/api/orders')
//         .set('Cookie', user)
//         .send({ ticketId: ticket.id})
//         .expect(201);
//     // make request to cancel order
//     const {body: fetchedOrder } = await request(app)
//         .delete(`/api/orders/${order.id}`)
//         .set('Cookie', user)
//         .send()
//         .expect(204)
//     expect(natsWrapper.client.publish).toHaveBeenCalled();
// })