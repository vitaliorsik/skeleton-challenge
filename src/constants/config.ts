import dotenv from 'dotenv';

dotenv.config()

export const config = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'secret',
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    defaultFromEmail: process.env.DEFAULT_FROM_EMAIL,
}
