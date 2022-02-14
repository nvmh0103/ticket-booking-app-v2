import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@mh132001tickets/common'
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message)  {
        const { id, title, price, version } = data;
        const ticket = await Ticket.findOne({
            id,
            version: version - 1,
        });
        if (!ticket){
            throw new Error('Ticket not found');
        }
        ticket.title = title;
        ticket.price = price;
        await ticket.save();

        msg.ack();
    }
}