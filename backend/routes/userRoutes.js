const express = require('express');

const router = express.Router();

const { registerUser, loginUser, protect, allUsers }  = require('../services/userServices')

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", loginUser);


module.exports = router