const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    crypto: [{
        coin: { type: String },
        quantity: {
            type: Number,
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
