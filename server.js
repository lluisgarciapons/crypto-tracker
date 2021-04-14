const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const authRouter = require("./api/authRouter");
const userRouter = require("./api/userRouter");
const { checkToken, errorHandler } = require("./middleware");
const path = require("path");

const app = express();

const { env: { PORT, DB_URI } } = process;

mongoose.connect(DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Database connected");
}).catch(err => {
    console.log(err);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/api/auth", authRouter);
app.use("/api/user", checkToken, userRouter);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
// app.use('*', (req, res) => {
//     res.sendStatus(404);
// });
app.use(errorHandler);

// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = 8080;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function () {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
app.listen(PORT || 5000, () => console.log("Now listening for requests on port 5000"));

