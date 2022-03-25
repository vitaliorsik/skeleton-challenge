import {dynamoClient} from '../constants/aws';
import {hash} from 'bcrypt';
import {USER_ALREADY_EXIST, USER_NOT_FOUND} from '../constants/errors';
import {User} from '../models/user';
import {randomBytes} from 'crypto';
import {sendNewPassword} from './email';
import {isEmptyObject} from '../utils';

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
    const newPassword = randomBytes(8).toString('hex');
    const updatedUser = {email, password: newPassword};
    await addOrUpdateUser(updatedUser);
    await sendNewPassword(updatedUser);
}
