const express = require("express");
const { createMessage, getMessage, deleteMessage, deleteImage } = require("../Controllers/messageController");

const router = express.Router();

router.post("/create-message",  createMessage);
router.post("/get-message", getMessage  );
router.post("/delete-message", deleteMessage);
router.post("/delete-image", deleteImage);


module.exports = router;