const  mongoose  = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        members: {type: Array},
        pin: {type: Boolean, default: false}
    },
    {
        timestamps: true,
    }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;