import express from 'express';
import {generateAccessToken} from '../controllers/auth';
import {compare} from 'bcrypt';
import {checkUserValidity, forgotPassword, getUserByEmail, registerUser} from '../controllers/user';
import {
    INVALID_CREDENTIALS,
    INVALID_EMAIL,
    REQUIRED_INPUTS,
    UNKNOWN_ERROR,
    USER_ALREADY_EXIST, USER_NOT_FOUND
} from '../constants/errors';
import {UserWithToken} from '../models/user';
import {isValidEmail} from '../utils';

const userRouter = express.Router();

userRouter.post("/register", checkUserValidity, async (req, res) => {
    try {
        const { email, password } = req.body;

        let token;

        const user = await registerUser({email, password});

        if (user) {
            token = generateAccessToken(user);
        }

        res.status(201).json({ token });
    } catch (err) {
        if (err instanceof Error && err.message === USER_ALREADY_EXIST) {
            return res.status(409).send(USER_ALREADY_EXIST);
        }
        res.status(500).json({ err: UNKNOWN_ERROR });
        console.log(err);
    }
});

// Login
userRouter.post("/login", checkUserValidity, async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;
        // Validate if user exist in our database
        const user = await getUserByEmail(email);

        if (user && (await compare(password, user.password))) {
            // Create token
            const token = generateAccessToken(user);

            // save user token
            const userWithToken: UserWithToken = {
                ...user,
                token
            };

            // user
            return res.status(200).json(userWithToken);
        }
        return res.status(400).send(INVALID_CREDENTIALS);
    } catch (err) {
        res.status(500).json({ err: UNKNOWN_ERROR });
        console.log(err);
    }
});

userRouter.post('/forget', async (req, res) => {
    const { email } = req.body;
    if (!isValidEmail(email)) {
        return res.status(400).send(INVALID_EMAIL);
    }
    try {
        await forgotPassword(email);
        return res.sendStatus(204);
    } catch (err) {
        if (err instanceof Error && err.message === USER_NOT_FOUND) {
            return res.status(404).send(USER_NOT_FOUND);
        }
        res.status(500).json({ err: UNKNOWN_ERROR });
        console.log(err);
    }
})

export default userRouter;
