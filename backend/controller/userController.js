const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log(req.body);
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExits = await User.findOne({ email });

  if (userExits) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  // console.log(`created user : ${user}`);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExits = await User.findOne({ email });

  if (userExits && (await userExits.matchPassword(password))) {
    res.status(200);
    res.json({
      _id: userExits._id,
      name: userExits.name,
      email: userExits.email,
      pic: userExits.pic,
      token: generateToken(userExits._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

const allUser = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // const users = await User.find({ ...keyword }).sort({ createdAt: -1 });
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUser };
