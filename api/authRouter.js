const express = require("express");
const authRouter = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { checkToken, asyncMiddleware } = require("../middleware");
const { env: { JWT_SECRET } } = process;

const createToken = (user, secret, expiresIn) => {
    const { _id } = user;
    return jwt.sign({ _id }, secret, { expiresIn });
};

authRouter.post(
    "/signup",
    asyncMiddleware(async (req, res, next) => {
        const { email, password, passwordValidation } = req.body;
        if (!email || !password || !passwordValidation) {
            return next({
                status: 400,
                message: "Please, fill in all required information."
            });
        }
        if (password !== passwordValidation) {
            return next({
                status: 400,
                message: "Passwords must be equal."
            });
        }
        if (password.length < 6) {
            return next({
                status: 400,
                message: "Password must be at least 6 characters long."
            });
        }

        const userByEmail = await User.findOne({ email: email });
        if (userByEmail) {
            return next({
                status: 403,
                message: "This email is already in use."
            });
        }
        const newUser = await new User({
            email,
            password
        }).save();
        console.log(newUser);
        res.status(201).send({
            success: true,
            token: createToken(newUser, JWT_SECRET, "24h")
        });
    })
);

authRouter.post(
    "/login",
    asyncMiddleware(async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next({
                status: 400,
                message: "Please, fill in all required information."
            });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return next({
                status: 404,
                message: "User not found."
            });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return next({
                status: 400,
                message: "Invalid password."
            });
        }
        res.status(200).json({
            success: true,
            token: createToken(user, JWT_SECRET, "24h")
        });
    })
);

authRouter.get(
    "/currentUser",
    checkToken,
    asyncMiddleware(async (req, res, next) => {
        const user = await User.findById(req.user._id)
            .select("-password");

        if (!user) {
            return next({
                status: 404,
                message: "User not found."
            });
        }
        console.log(user);
        res.status(200).json({
            success: true,
            user
        });
    })
);

module.exports = authRouter;
