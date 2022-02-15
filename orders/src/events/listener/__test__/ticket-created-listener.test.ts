import { Message } from 'node-nats-streaming';
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from '../../../nat-wrapper';
import { TicketCreatedEvent } from "@mh132001tickets/common";
import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket';

const init = async () => {
     // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        userId: ' something'
    }
    // create a fake message
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, msg };
}

it(' creates and saves a ticket', async () => {
    const { listener, data, msg } = await init();
    // call the onMessage function
    await listener.onMessage(data, msg);
    // expect ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);

});

it('acks the message', async () => {
    const { listener, data, msg } = await init();
    // call the onMessage function
    await listener.onMessage(data, msg);
    // expect something
    expect(msg.ack).toHaveBeenCalled();
})