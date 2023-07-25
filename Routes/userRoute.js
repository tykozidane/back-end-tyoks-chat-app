const express = require("express");
const { userRegister, userLogin, userSearch, updateProfile } = require("../Controllers/userController");

const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.post("/find/:userId", userSearch);

router.post("/update-profile", updateProfile);

module.exports = router;