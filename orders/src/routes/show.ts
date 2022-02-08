import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, requireAuth } from '@mh132001tickets/common';
import { Order } from '../models/order'; 

const router = express.Router();

router.get('/api/orders/:id', async( req: Request, res: Response) => {
    const order = await Order.findOne({id: req.params.orderId}).populate('ticket');
    if (!order){
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id){
        throw new BadRequestError('Cant find the order!');
    }
    return res.send(order);
})

export {router as showOrderRouter}