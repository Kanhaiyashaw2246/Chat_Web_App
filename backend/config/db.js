const mongoose = require("mongoose");
const colors = require('colors');

const url = process.env.MONGO_URL || 'mongodb+srv://chatapp:chatapp2246@cluster0.xjy9tfg.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MONGODB Connected : ${connect.connection.host}`.cyan.underline);
    console.log("URL=>>", url.green.underline);
  } catch (error) {
    console.log(`ERROR : ${error.message}`.red.bold);
    process.exit();
  }

};

module.exports = connectDB;
