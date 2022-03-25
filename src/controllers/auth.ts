import jwt from 'jsonwebtoken';
import {config} from '../constants/config';
import {Request, Response, NextFunction} from 'express';
import {INVALID_TOKEN, REQUIRED_TOKEN} from '../constants/errors';
import {User} from '../models/user';


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
        const decoded = jwt.verify(token, config.accessTokenSecret);
        // @ts-ignore
        req.user = decoded;
    } catch (err) {
        return res.status(401).send(INVALID_TOKEN);
    }
    return next();
};
