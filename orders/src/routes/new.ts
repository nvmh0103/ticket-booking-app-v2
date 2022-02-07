import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { currentUser, requireAuth, validateRequest } from '@mh132001tickets/common';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/orders', requireAuth,[
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket id must be provided')
], validateRequest, async( req: Request, res: Response) => {
    res.send({});
})

export {router as newOrderRouter}