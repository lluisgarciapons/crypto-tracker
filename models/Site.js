const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SiteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    crypto: [{
        coinId: {
            type: Number,
            required: true
        },
        symbol: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            set: v => mongoose.Types.Decimal128.fromString(v.toFixed(8)),
            default: 0
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Site", SiteSchema);
