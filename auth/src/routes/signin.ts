import express, {Response, Request} from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Please provide password!')
], validateRequest,
async (req: Request, res: Response) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});
    if (!user){
        throw new BadRequestError("Login failed!");
    }

    const isMatch = await Password.compare(user.password, password);
    if (!isMatch){
        throw new BadRequestError("Login failed!");
    }

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY! );

    req.session = {
        jwt: userJwt
    }

    return res.status(200).send(user);
})

export { router as signinRouter };