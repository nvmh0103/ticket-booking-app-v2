import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nat-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@mh132001tickets/common";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price:20,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'something',
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };
    
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, order, data, msg};
}

it(' updates the order status to cancelled', async () => {
    const { listener, order, ticket, data, msg} = await setup();
    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findOne({id: order.id});
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it(' Emit OrderCancelled event', async () => {
    const { listener, order, ticket, data, msg} = await setup();
    await listener.onMessage(data,msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(eventData.id).toEqual(order.id);
});

it(' ack the message', async () => {
    const { listener, order, ticket, data, msg} = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});
