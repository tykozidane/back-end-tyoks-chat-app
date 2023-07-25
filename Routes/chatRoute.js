const express = require("express");
const { createChat, findUserChat, findChat, createChatUsingCodeReferral, tryfindChat, deleteChat } = require("../Controllers/chatController");

const router = express.Router();

router.post("/create-chat", createChat );
router.post("/create-chat-by-referral-code", createChatUsingCodeReferral );
router.post("/find-user-chat", findUserChat );
router.post("/find-chat", findChat );
router.post("/tryfindchat", tryfindChat);
router.post("/delete-chat", deleteChat);


module.exports = router;