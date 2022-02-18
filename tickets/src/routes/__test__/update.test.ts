import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket'




it('returns a 404 if ticket does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'something',
            price: 20
        })
        .expect(404)
})


it('returns a 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'something',
            price: 20
        })
        .expect(401)    
})


it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'something',
            price: 20
        });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'random',
            price: 1000
        })
        .expect(401);
})


it('returns a 400 if the user provide invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'something',
        price: 20
    });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price:20
        })
        .expect(400)
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'something',
            price: -10
        })
        .expect(400)
})

it('update ticket if provided paramaters is valid ', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'something',
        price: 20
    });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'another',
            price: 100
        })
        .expect(200)
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
    expect(ticketResponse.body.title).toEqual('another');
    expect(ticketResponse.body.price).toEqual(100);
    
})

it('rejects update if the ticket is reserved', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'something',
        price: 20
    });

    const ticket = await Ticket.findOne({id: response.body.id});
    ticket!.orderId = new mongoose.Types.ObjectId().toHexString();
    await ticket!.save()

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'another',
            price: 100
        })
        .expect(400)

})