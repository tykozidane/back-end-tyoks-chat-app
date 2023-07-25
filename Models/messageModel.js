const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {type: mongoose.Schema.Types.ObjectId, required: true},
    typeMessage: {type: String, default: "text"},
    senderId: {type: mongoose.Schema.Types.ObjectId, required:true},
    text: {type: String}
},{
    timestamps : true // to add createdAt and updatedAt fields in the schema
});

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;