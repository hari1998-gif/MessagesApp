const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = expressAsyncHandler(async (req, res) => {
  let { name, email, password, pic } = req.body;
  console.log("hi", req.body);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const checkMailId = await User.findOne({ email });

  if (checkMailId) {
    res.status(400).send({ Error: "Email alraedy exist" });
  }

  password = password.toString();

  //password encrption
  const salt = bcrypt.genSaltSync(10);
  password = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  //Generating token and sending token as response
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    pic: user.pic,
    token: token,
  });
});

const loginUser = expressAsyncHandler(async (req, res) => {
  let { email, password } = req.body;

  const user = await User.findOne({ email });

  password = password.toString();

  if (user) {
    //check for password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).send({ error: "User or password is incorrect" });

    //Generating token and sending token as response
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    if (token) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: token,
      });
    } else {
      return res.status(500).send({ error: "Failed to create token" });
    }
  } else {
    return res.status(400).send({ error: "User or password is incorrect" });
  }
});

const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  console.log(req);

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded._id).select("-password");
      // console.log("here",req.user)

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { registerUser, loginUser, allUsers, protect };
