import express from 'express';
import {json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler } from '@mh132001tickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
}));

// Using router


// Error handler
app.use(errorHandler);

export {app};