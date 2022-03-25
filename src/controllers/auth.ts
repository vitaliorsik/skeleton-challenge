import jwt from 'jsonwebtoken';
import {config} from '../constants/config';
import {Request, Response, NextFunction} from 'express';
import {INVALID_TOKEN, REQUIRED_TOKEN, USER_NOT_FOUND} from '../constants/errors';
import {User} from '../models/user';
import {getUserByEmail} from './user';


export const generateAccessToken = (user: User): string => {
    return jwt.sign(user, config.accessTokenSecret)
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send(REQUIRED_TOKEN);
    }
    try {
        const decoded = jwt.verify(token, config.accessTokenSecret) as User;
        const user = getUserByEmail(decoded.email);
        if (!user) {
            return res.status(404).send(USER_NOT_FOUND);
        }
        // @ts-ignore
        req.user = user;
    } catch (err) {
        return res.status(401).send(INVALID_TOKEN);
    }
    return next();
};
