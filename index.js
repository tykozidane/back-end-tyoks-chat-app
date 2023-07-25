const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const userRouter = require("./Routes/userRoute");
const chatRouter = require("./Routes/chatRoute");
const messageRouter = require("./Routes/messageRoute");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
    res.send("Connected Successfully");
})


const port = process.env.PORT || 5000 ;

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
}).then(() => console.log("MongoDB connected Successfully")).catch((error) => console.log("MongoDB connection failed : ", error.message));

