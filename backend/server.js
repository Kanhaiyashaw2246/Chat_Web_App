const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
connectDB();
const app = express();
app.use(express.json()); //to accept json data

//--------------HOME PAGE----------------
app.get("/", (req, res) => {
  res.send("अपि  इस रनिंग ");
});

//-------------GET SINGLE CHAT BY ID ------------
app.get("/api/chat/:id", (req, res) => {
  let id = req.params.id;
  const singleChat = chats.find((e) => e._id === id);
  res.send(singleChat);
});

//------------------USER ROUTES-------------------
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//------------------ERROR HANDLING----------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`SERVER STARTED ON PORT ${PORT}`.yellow.bold));
