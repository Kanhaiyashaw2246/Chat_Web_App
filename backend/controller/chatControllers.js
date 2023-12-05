const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { json } = require("express");
const { verify } = require("jsonwebtoken");

const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;


  if (!userId) {
    console.log("user id param not send with request");
    return res.sendStatus(400).send("User Id is required");
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(`ERROR:-${error.message}`);
    }
  }
});

const fetchChat = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(result);
        // console.log(result,req.user._id)
      });
  } catch (err) {
    res.status(400);
    throw new Error("Something went wrong:  ", err.message);
  }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fileds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More then 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    let verifyGroupAdmin = await Chat.findOne({ groupAdmin: req.user });
    let verifyUsers = await Chat.findOne({ users: users });
    let verifyChatName = await Chat.findOne({ chatName: req.body.name });

    if (verifyGroupAdmin && verifyUsers && verifyChatName) {
      return res.status(400).send("Already exist");
    }
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  console.log(req.body);

  const updatedChatName = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChatName) {
    res.send(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChatName);
  }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  // console.log(`SINgle:- ${chatId}\n USERTOADD:- ${userId}`);
      
  let userExist = await Chat.findOne({users:{$eq : userId},isGroupChat: true,_id:{$eq : chatId}});

  // console.log(userExist);
  if(userExist){
    return res.status(400).send("User already exist in this chat");
  }

  const addMember = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
     
  if (!addMember) {
    res.send(400);
    throw new Error("Chat not found");
  } else {
    res.status(200).json(addMember);
  }
});

const removeGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  let userExist = await Chat.findOne({users:{$eq : userId}});
  // console.log(userExist);
  if(!userExist){
    return res.status(400).send("User not exist in this chat");
  }

  const removeMember = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
     
  if (!removeMember) {
    res.send(400);
    throw new Error("Chat not found");
  } else {
    res.status(200).json(removeMember);
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeGroup,
};
