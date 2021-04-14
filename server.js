const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const authRouter = require("./api/authRouter");
const userRouter = require("./api/userRouter");
const siteRouter = require("./api/siteRouter");
const { checkToken, errorHandler } = require("./middleware");
const path = require("path");
const fetch = require("node-fetch");

const app = express();

const { env: { PORT, DB_URI } } = process;

mongoose.connect(DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("Database connected");
}).catch(err => {
    console.log(err);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client", "build")));

app.post("/api/getData", (req, res) => {
    fetch(req.body.url, { headers: req.body.headers })
        .then(response => response.json())
        .then(data => res.send(data));
});
app.use("/api/auth", authRouter);
app.use("/api/user", checkToken, userRouter);
app.use("/api/site", checkToken, siteRouter);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.use('*', (req, res) => {
    res.sendStatus(404);
});
app.use(errorHandler);

app.listen(PORT || 5000, () => console.log(`Now listening for requests on port ${PORT}`));

