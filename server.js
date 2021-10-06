require('dotenv').config();
const express = require("express");
const app = express();
const todoRouter = require('./routes/todoRouter');
const authRouter = require('./routes/authRouter');
const cookieParser = require('cookie-parser');


require('./dbconnect');

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello Worlds")
})
app.use("/todo", todoRouter);
app.use("/auth", authRouter)


app.listen(3000, () => {
    console.log("Our server is running!")
})