const mongoose = require("mongoose");


const connectionUrl = "mongodb://127.0.0.1:27017/manager";

async function connectToDatabase() {
  try {
    const client = await mongoose.connect(connectionUrl, {
      useNewUrlParser: true,
    });
    console.log("database connected successfully");
  } catch (error) {
    console.log("unable to connect to the database", error);
    process.exit(1);
  }
};






module.exports = { connectToDatabase };