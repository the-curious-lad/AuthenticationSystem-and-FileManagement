const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// connect database
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log(err);
});

// routes
const signupRoutes = require("./src/routes/signup.route");
const loginRoutes = require("./src/routes/login.routes");



app.use("/", signupRoutes);
app.use("/", loginRoutes);

// test route
app.get("/", (req, res) => {
    res.send("server running");
});

// start server
app.listen(3000, () => {
    console.log("server working perfectly alright");
});