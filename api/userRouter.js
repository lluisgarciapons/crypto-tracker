const express = require("express");
const { asyncMiddleware } = require("../middleware");
const User = require("../models/User");
const { isCoin } = require("../utils/validations");
const userRouter = express.Router();

userRouter.route("/mycryptos")
    .get(asyncMiddleware(async (req, res, next) => {
        const { user: { _id } } = req;
        const user = await User.findById(_id).select("-password");
        if (!user) return next({
            status: 404,
            message: "User not found"
        });

        res.send(user);
    }));

// userRouter
//     .route("/addCrypto")
//     .put(asyncMiddleware(async (req, res, next) => {
//         const { user: { _id }, body: { coinId, symbol, quantity } } = req;

//         if (!coinId || !symbol || !quantity) {
//             return next({
//                 status: 403,
//                 message: "Please fill in all required information."
//             });
//         }

//         if (!isCoin(symbol)) {
//             return next({
//                 status: 403,
//                 message: "This coin doesn't exist."
//             });
//         }

//         if (quantity <= 0) {
//             return next({
//                 status: 403,
//                 message: "Quantity must be a valid number."
//             });
//         }

//         const user = await User.findById(_id).select("-password");
//         if (!user) return next({
//             status: 404,
//             message: "User not found"
//         });


//         const alreadyOwned = user.crypto.find(item => {
//             return item.symbol == symbol;
//         });

//         if (alreadyOwned) {
//             alreadyOwned.quantity += Number(quantity);
//         }
//         else {
//             user.crypto.push({ coinId, symbol, quantity: Number(quantity) });
//         }

//         await user.save();

//         res.send({
//             success: true,
//             message: `${quantity} ${symbol} added successfully.`
//         });
//     }));

userRouter
    .route("/subsCrypto")
    .put(asyncMiddleware(async (req, res, next) => {
        const { user: { _id }, body: { coinId, symbol, quantity } } = req;

        if (!coinId || !symbol || !quantity) {
            return next({
                status: 403,
                message: "Please fill in all required information."
            });
        }

        if (!isCoin(symbol)) {
            return next({
                status: 403,
                message: "This coin doesn't exist."
            });
        }

        if (quantity <= 0) {
            return next({
                status: 403,
                message: "Quantity must be a valid number."
            });
        }

        const user = await User.findById(_id).select("-password");
        if (!user) return next({
            status: 404,
            message: "User not found"
        });

        const alreadyOwned = user.crypto.find(item => {
            return item.symbol == symbol;
        });

        if (!alreadyOwned) {
            return next({
                status: 404,
                message: "You don't own this coin."
            });
        }

        if (Number(quantity) > alreadyOwned.quantity) {
            return next({
                status: 403,
                message: `Please enter a valid amount, your max is ${alreadyOwned.quantity.toFixed(8)}`
            });
        }

        alreadyOwned.quantity -= Number(quantity);


        await user.save();

        res.send({
            success: true,
            message: `${quantity} ${symbol} substracted successfully.`
        });
    }));

userRouter
    .route("/eraseCrypto")
    .put(asyncMiddleware(async (req, res, next) => {
        let { user: { _id }, body: { symbol } } = req;
        let coin = symbol.toUpperCase();
        if (!coin) {
            return next({
                status: 403,
                message: "Please fill in all required information."
            });
        }

        if (!isCoin(coin)) {
            return next({
                status: 403,
                message: "This coin doesn't exist."
            });
        }

        const user = await User.findById(_id).select("-password");
        if (!user) return next({
            status: 404,
            message: "User not found"
        });


        const alreadyOwned = user.crypto.find(item => {
            return item.coin == coin;
        });

        if (!alreadyOwned) {
            return next({
                status: 404,
                message: "You don't own this coin."
            });
        }

        const index = user.crypto.indexOf(alreadyOwned);
        if (index > -1) {
            user.crypto.splice(index, 1);
        }

        await user.save();

        res.send({
            success: true,
            message: `${coin} deleted from your profile successfully.`
        });
    }));



module.exports = userRouter;