const express = require("express");
const { asyncMiddleware, mySite } = require("../middleware");
const Site = require("../models/Site");
const User = require("../models/User");
const { isCoin } = require("../utils/validations");
const siteRouter = express.Router();

siteRouter
    .route("/addCrypto")
    .put(asyncMiddleware(async (req, res, next) => {
        const { user: { _id }, body: { name, coinId, symbol, quantity } } = req;

        if (!name || !coinId || !symbol || !quantity) {
            return next({
                status: 403,
                message: "Please fill in all required information."
            });
        }
        const { isValid, error } = await isCoin(symbol);

        if (!isValid) {
            return next({
                status: 403,
                message: error
            });
        }

        if (quantity <= 0) {
            return next({
                status: 403,
                message: "Quantity must be a valid number."
            });
        }

        const user = await User.findById(_id).populate("sites");
        if (!user) return next({
            status: 404,
            message: "User not found"
        });

        const foundSite = user.sites.find(site => site.name.toLowerCase() == name.toLowerCase());

        if (!foundSite) {
            const newSite = new Site({
                name,
                crypto: [{ coinId, symbol, quantity: Number(quantity) }]
            });

            const createdSite = await newSite.save();
            user.sites.push(createdSite._id);
        }
        else {
            const foundCrypto = foundSite.crypto.find(coin => coin.coinId == coinId);
            if (!foundCrypto) {
                foundSite.crypto.push({ coinId, symbol, quantity: Number(quantity) });
            } else {
                foundCrypto.quantity += Number(quantity);
            }

            await foundSite.save();
        }



        const alreadyOwned = user.crypto.find(item => {
            return item.symbol == symbol;
        });

        if (alreadyOwned) {
            alreadyOwned.quantity += Number(quantity);
        }
        else {
            user.crypto.push({ coinId, symbol, quantity: Number(quantity) });
        }

        await user.save();

        res.send({
            success: true,
            message: `${quantity} ${symbol} added successfully @ ${name} site.`
        });
    }));

siteRouter
    .route("/mySites")
    .get(asyncMiddleware(async (req, res, next) => {
        const { user: { _id } } = req;
        const user = await User.findById(_id).populate("sites", "name");

        if (!user) {
            return next({
                status: 404,
                message: "Your user does not exist"
            });
        }

        return res.send({
            success: true,
            sites: user.sites.map(site => {
                return { name: site.name, id: site._id };
            })
        });
    }));

siteRouter
    .route("/find/:siteId")
    .get(mySite, asyncMiddleware(async (req, res, next) => {
        const { params: { siteId } } = req;

        let site = await Site.findById(siteId);

        if (!site) {
            return next({
                status: 404,
                message: "This site does not exist."
            });
        }

        return res.send({
            success: true,
            site
        });
    }));

siteRouter
    .route("/findByCoin/:coinId")
    .get(asyncMiddleware(async (req, res, next) => {
        const { user: { _id }, params: { coinId } } = req;

        const user = await User.findById(_id).populate("sites");

        let filteredSites = user.sites.filter(site => {
            let found = false;
            site.crypto.every(cryp => {
                if (cryp.coinId == coinId) {
                    found = true;
                    return false;
                }
                return true;
            });
            return found;
        });

        if (filteredSites.length == 0) {
            return next({
                status: 403,
                message: "You don't have this coin in any site."
            });
        }

        filteredSites.forEach(eachSite => {
            eachSite.crypto = eachSite.crypto.filter(coin => coin.coinId == coinId);
        });

        return res.send({
            success: true,
            sites: filteredSites
        });

    }));

siteRouter
    .route("/modifySite/:siteId")
    .put(mySite, asyncMiddleware(async (req, res, next) => {
        const { user: { _id }, params: { siteId } } = req;
        const site = req.body;
        if (!site || !site.crypto) {
            return next({
                status: 403,
                message: "Send a modification."
            });
        }

        site.crypto.forEach(crypto => {
            if (!isCoin(crypto.symbol)) {
                return next({
                    status: 403,
                    message: "This coin doesn't exist."
                });
            }

            if (crypto.quantity < 0) {
                return next({
                    status: 403,
                    message: "Quantity must be a valid number."
                });
            }
        });

        let sampleSite = new Site(site);
        let newSite = sampleSite.toObject();
        delete newSite._id;

        let modifiedSite = await Site.findByIdAndUpdate(siteId, newSite, { new: true, setDefaultsOnInsert: true });

        let user = await User.findById(_id).populate("sites");

        await updateUserCrypto(user);

        return res.send({
            success: true,
            modifiedSite
        });
    }));

siteRouter
    .route("/deleteSite/:siteId")
    .delete(mySite, asyncMiddleware(async (req, res, next) => {
        const { user: { _id }, params: { siteId } } = req;

        let site = await Site.findById(siteId);
        let user = await User.findById(_id).populate("sites");

        if (!site) {
            return next({
                status: 404,
                message: "This site does not exist."
            });
        }

        if (!user) {
            return next({
                status: 404,
                message: "Your user does not exist??"
            });
        }

        await site.deleteOne();

        user.sites = user.sites.filter(site => site._id != siteId);

        await updateUserCrypto(user);

        return res.send({
            success: true,
            message: "Site deleted successfully, user crypto updated."
        });

    }));

siteRouter
    .route("/deleteCoin/:siteId")
    .delete(mySite, asyncMiddleware(async (req, res, next) => {
        const { user: { _id }, params: { siteId } } = req;
        const coinId = req.query.q;

        let site = await Site.findById(siteId);


        if (!site) {
            return next({
                status: 404,
                message: "This site does not exist."
            });
        }

        let foundCoin = site.crypto.find(coin => coin.coinId == coinId);

        if (!foundCoin) {
            return next({
                status: 404,
                message: "This coin is not on your site."
            });
        }

        site.crypto = site.crypto.filter(coin => coin.coinId != coinId);

        await site.save();

        let user = await User.findById(_id).populate("sites");

        if (!user) {
            return next({
                status: 404,
                message: "Your user does not exist??"
            });
        }

        await updateUserCrypto(user);

        return res.send({
            success: true,
            site,
            message: `${foundCoin.symbol} deleted from ${site.name}.`
        });
    }));

const updateUserCrypto = async (user) => {
    user.crypto = [];

    user.sites.forEach(site => {
        site.crypto.forEach(siteCoin => {
            let foundUserCoin = user.crypto.find(coin => coin.coinId == siteCoin.coinId);
            if (!foundUserCoin) {
                user.crypto.push({
                    coinId: siteCoin.coinId,
                    symbol: siteCoin.symbol,
                    quantity: siteCoin.quantity
                });
            } else {
                foundUserCoin.quantity += siteCoin.quantity;
            }
        });
    });

    await user.save();
};



module.exports = siteRouter;