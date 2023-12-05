const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require('moment-timezone');

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) throw new Error("Invalid Email");
      // },
    },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg?w=740",
    },
  },
  {
    timestamps: true,
  }
);

userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword,this.password);
};


userModel.pre('save', async function (next){
  if (!this.isModified('password')) {
    this.createdAt = moment(this.createdAt).tz('Asia/Kolkata').toDate();
    this.updatedAt = moment(this.updatedAt).tz('Asia/Kolkata').toDate();
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
}); 

const User = mongoose.model("User", userModel);

module.exports = User;
