import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth } from '@mh132001tickets/common';

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async( req: Request, res: Response) => {
    const {id } = req.params;
    const order = await Order.findOne({id});
    if (!order){
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id){
        throw new BadRequestError('Cant find the order!');
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish an event say that order is cancelled!
    res.status(204).send(order);
})

export {router as deleteOrderRouter}