import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@mh132001tickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher copy';
import { natsWrapper } from '../nat-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders', requireAuth,[
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket id must be provided')
], validateRequest, 
async ( req: Request, res: Response) => {
    const { ticketId } = req.body;
    // find if there was a ticket in database
    const ticket = await Ticket.findById(ticketId);
    // if not, throw 404
    if (!ticket){
        throw new NotFoundError();
    }
    // check if the ticket has been reserved by any order or not
    const isReserved = await ticket.isReserved();
    if (isReserved){
        throw new BadRequestError('Ticket is already reserved!');
    }
    // set expiration time for this order 
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // save order to database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt : expiration,
        ticket
    });
    await order.save();

    // Publish an event
    // new OrderCreatedPublisher(natsWrapper.client).publish({
    //     id: order.id,
    //     status: order.status,
    //     userId: order.userId,
    //     version: order.version,
    //     expiresAt: order.expiresAt.toISOString(),
    //     ticket: {
    //         id: ticket.id,
    //         price: ticket.price
    //     }
    // })

    res.status(201).send(order);


})

export {router as newOrderRouter}