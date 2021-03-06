import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nat-wrapper";
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from "@mh132001tickets/common";
import mongoose from 'mongoose';


const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'something'
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        userId: 'something',
        expiresAt: 'something',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { listener, ticket, data, msg};
}

it('sets the userId of the ticket', async() => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data,msg);
    const updatedTicket = await Ticket.findOne({id: ticket.id});

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async() => {
    const { listener, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('publish a ticket updated event', async () => {
    const { listener, ticket, data, msg} = await setup();
    await listener.onMessage(data,msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})