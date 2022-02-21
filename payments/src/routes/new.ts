import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@mh132001tickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments', requireAuth,
[
    body('token')
        .not()
        .isEmpty()
        .withMessage('Missing token!'),
    body('orderId')
        .not()
        .isEmpty()
        .withMessage('Missing order id!')
], validateRequest,
async (req: Request, res: Response ) => {
    const { token, orderId } = req.body;
    const order = await Order.findOne({id: orderId});
    if (!order){
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled){
        throw new BadRequestError('Order has been expired!');
    }

    res.send({ success: true })
})

export { router as createChargerRouter }