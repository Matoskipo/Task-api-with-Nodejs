const User = require("../models/user");
const Task = require("../models/task");
const bcrypt = require("bcryptjs");
const sharp = require('sharp')
 
exports.registerUsers = async (req, res) => { 
  const user = new User(req.body); 
  try {
    const uniqueEmail = await User.findOne({ email: user.email });
    if (uniqueEmail) {
      return res.status(400).send("email already exist"); 
    }
    await user.save(); 
    const token = await user.generateToken(); 
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.loginUsers = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    const token = await user.generateToken();
    if (!user) {
      throw new Error("unable to login");
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("unable.to login");
    }
    //  const publicProfile = await user.getPublicProfile()
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
};

exports.logoutUsers = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("headers token", token);
    const user = await User.findOne({ "tokens.token": token });
    user.tokens = user.tokens.filter((singleT) => {
      console.log("single token", singleT.token);
      return singleT.token !== token;
    });
    console.log(user.tokens);
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

exports.logoutAllUsers = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = await User.findOne({ "tokens.token": token });
    user.tokens = [];
    user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUsers = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const users = await User.find({ "tokens.token": token });
    if (!users) {
      res.status(404).send();
    }
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateUser = async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  const data = req.body;
  const updates = Object.keys(data);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates!" });
  }

  try {
    const user = await User.findOne({ "tokens.token": token });
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = await User.findOneAndDelete({ "tokens.token": token });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    await Task.deleteMany({ owner: user._id });
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};


exports.uploadAvatar=async(req,res)=>{
  const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}
exports.deleteAvatar=async(req,res)=>{
  
    req.user.avatar = undefined;
    await req.user.save()
    res.send('profile image successfuly deleted')
  
}

exports.getAvatar=async(req,res)=>{
  try {
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar){
      throw new Error()
    }
    res.set('Content-type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send()
  }
}

