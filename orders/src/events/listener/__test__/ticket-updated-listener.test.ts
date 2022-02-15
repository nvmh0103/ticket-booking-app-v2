import { TicketUpdatedListener } from "../ticket-updated-listener"
import { TicketUpdatedEvent } from "@mh132001tickets/common"
import { natsWrapper } from "../../../nat-wrapper"
import { Ticket } from "../../../models/ticket"
import { Message } from "node-nats-streaming"
import mongoose from 'mongoose'

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'another concert',
        price: 999,
        userId: 'abcsds'
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { msg, listener, data, ticket};
}

it(' finds, updates, saves a ticket', async() => {
    const { msg, data, ticket, listener } = await setup();
    await listener.onMessage(data, msg);
    
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
    
})

it(' acks the message', async() => {
    const { msg, data, ticket, listener } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})