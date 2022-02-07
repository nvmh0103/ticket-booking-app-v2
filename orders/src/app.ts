import express from 'express';
import {json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';

import { errorHandler, currentUser } from '@mh132001tickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
}));

app.use(currentUser);

// Using router
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);



// 404 router
// app.all("*", (req, res) => {
//     return res.status(404).send({message: "Page not found!"});
// })

// Error handler
app.use(errorHandler);

export {app};