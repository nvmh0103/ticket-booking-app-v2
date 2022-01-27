import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@mh132001tickets/common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findOne({id: req.params.id});
    if (!ticket){
        throw new NotFoundError();
    }
    res.send(ticket);
})

export { router as showTicketRouter};