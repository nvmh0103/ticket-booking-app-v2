import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@mh132001tickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe'
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../event/publishers/payment-created-publisher'
import { natsWrapper } from '../nat-wrapper'

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

    const payment = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    })
    const newPayment = Payment.build({
        orderId,
        stripeId: payment.id,
    })
    await newPayment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: newPayment.id,
        orderId: newPayment.orderId,
        stripeId: newPayment.stripeId
    });

    res.status(201).send({ id: newPayment.id })
})

export { router as createChargerRouter }