const express = require("express");
const { sendMessage, allMessage } = require("../services/messageServices");
const { protect } = require("../services/userServices");

const router = express.Router();

router.route("/").post(protect, sendMessage);

router.route("/:chatId").get(protect, allMessage);

module.exports = router;
