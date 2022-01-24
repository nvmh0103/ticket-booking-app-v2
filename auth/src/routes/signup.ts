import express, {Request, Response} from 'express';
import { body } from 'express-validator'
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@mh132001tickets/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup', [
    body("email")
        .isEmail()
        .withMessage('Email must be valid'),
    body("password")
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage("Password must have the suitable length")
], validateRequest,
async (req: Request, res: Response) => {
    const {email, password} = req.body;
    console.log(req.body);
    const existingUser= await User.findOne({email});
    if (existingUser){
        throw new BadRequestError('Email existed!');
    }

    const user = User.build({email, password});
    await user.save();
    // generate jwt
    if (!process.env.JWT_KEY){
        throw new Error('No JWT_KEY');
    }
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY );

    req.session = {
        jwt: userJwt
    }

    return res.status(201).send(user);
})

export { router as signupRouter };