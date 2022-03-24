import {dynamoClient} from '../constants/aws';
import {hash} from 'bcrypt';
import {USER_ALREADY_EXIST} from '../constants/errors';
import {User} from '../models/user';

const TABLE_NAME = 'users';

const isEmptyObject = (object: Object): boolean => {
    return Object.keys(object).length === 0;
}

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

export const registerUser = async (user: User): Promise<User | null> => {
    const oldUser = await getUserByEmail(user.email);

    if (oldUser) {
        throw new Error(USER_ALREADY_EXIST);
    }

    const encryptedPassword = await hash(user.password, 10);
    const params = {
        TableName: TABLE_NAME,
        Item: {
            email: user.email,
            password: encryptedPassword,
        },
    }
    await dynamoClient.put(params).promise();
    return getUserByEmail(user.email);
}
