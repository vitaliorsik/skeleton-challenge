import {User} from '../models/user';
import {config} from '../constants/config';
import {AWSError} from 'aws-sdk';
const ses = require('node-ses');

const defaultFromEmail = config.defaultFromEmail;

const client = ses.createClient({
    key: config.accessKeyId,
    secret: config.secretAccessKey,
    amazon: `https://email.${config.region}.amazonaws.com`
});

export const sendNewPassword = (user: User) => {
    return new Promise((resolve, reject) => {
        client.sendEmail({
            to: user.email,
            from: defaultFromEmail,
            subject: 'Skeleton Challenge - Password Reset',
            message: `Hello<br>This is your new password: <b>${user.password}</b><br>Thank you`
        }, function (err: AWSError) {
            if(err) {
                reject(err);
                console.error('Cannot send e-mail to: ' + user.email);
                console.error(err);
                return;
            }
            resolve(user);
            console.log('Forget password e-mail sent to: ' + user.email);
        });
    })
};
