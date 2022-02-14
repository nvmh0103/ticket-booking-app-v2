import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth } from '@mh132001tickets/common';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nat-wrapper';

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async( req: Request, res: Response) => {
    const {id } = req.params;
    const order = await Order.findOne({id}).populate('ticket');
    if (!order){
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id){
        throw new BadRequestError('Cant find the order!');
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish an event say that order is cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        },
    });

    res.status(204).send(order);
})

export {router as deleteOrderRouter}