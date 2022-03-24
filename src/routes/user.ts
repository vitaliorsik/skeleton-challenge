import express from 'express';
import {generateAccessToken} from '../controllers/auth';
import {compare} from 'bcrypt';
import {getUserByEmail, registerUser} from '../controllers/user';
import {INVALID_CREDENTIALS, REQUIRED_INPUTS, UNKNOWN_ERROR, USER_ALREADY_EXIST} from '../constants/errors';
import {UserWithToken} from '../models/user';

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).send(REQUIRED_INPUTS);
        }

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
userRouter.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            return res.status(400).send(REQUIRED_INPUTS);
        }
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

export default userRouter;
