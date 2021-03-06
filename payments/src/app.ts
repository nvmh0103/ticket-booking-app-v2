import express from 'express';
import {json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, currentUser } from '@mh132001tickets/common';
import { createChargerRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
}));

app.use(currentUser);

// Using router
app.use(createChargerRouter);


// 404 router
// app.all("*", (req, res) => {
//     return res.status(404).send({message: "Page not found!"});
// })

// Error handler
app.use(errorHandler);

export {app};