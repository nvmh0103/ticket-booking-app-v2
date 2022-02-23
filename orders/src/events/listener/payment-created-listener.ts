import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@mh132001tickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        const order = await Order.findOne({id: data.id});
        if (!order){
            throw new Error('Order not found!');
        }

        order.status = OrderStatus.Complete;
        await order.save();

        msg.ack();
    }
}