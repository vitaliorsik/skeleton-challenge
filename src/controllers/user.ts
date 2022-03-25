import {dynamoClient} from '../constants/aws';
import {hash} from 'bcrypt';
import {INVALID_EMAIL, REQUIRED_INPUTS, USER_ALREADY_EXIST, USER_NOT_FOUND} from '../constants/errors';
import {User} from '../models/user';
import {randomBytes} from 'crypto';
import {sendNewPassword} from './email';
import {generateRandomString, isEmptyObject, isValidEmail} from '../utils';
import {Request, Response, NextFunction} from 'express';

const TABLE_NAME = 'users';

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            email
        }
    }
    const user = await dynamoClient.get(params).promise();
    return isEmptyObject(user) ? null : user.Item as User;
}

const addOrUpdateUser = async (user: User) => {
    const encryptedPassword = await hash(user.password, 10);
    const params = {
        TableName: TABLE_NAME,
        Item: {
            email: user.email,
            password: encryptedPassword,
        },
    }
    await dynamoClient.put(params).promise();
}

export const registerUser = async (user: User): Promise<User | null> => {
    const oldUser = await getUserByEmail(user.email);

    if (oldUser) {
        throw new Error(USER_ALREADY_EXIST);
    }
    await addOrUpdateUser(user);
    return getUserByEmail(user.email);
}

export const forgotPassword = async (email: string) => {
    const user = await getUserByEmail(email);
    if(!user) {
        throw new Error(USER_NOT_FOUND);
    }
    const newPassword = generateRandomString(8);
    const updatedUser = {email, password: newPassword};
    await addOrUpdateUser(updatedUser);
    await sendNewPassword(updatedUser);
}

export const checkUserValidity = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(400).send(REQUIRED_INPUTS);
    }
    if (!isValidEmail(email)) {
        return res.status(400).send(INVALID_EMAIL);
    }
    next();
};
