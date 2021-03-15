const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: [6, 'Password too short'],
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
        }
    }],
    joinDate: {
        type: Date,
        default: Date.now()
    }
});

// Hash password so it can't be seen w/ access to database
UserSchema.pre("save", function (next) {
    if (!this.isNew || !this.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            this.password = hash;

            next();
        });
    });
});

module.exports = mongoose.model("User", UserSchema);
