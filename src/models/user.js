const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minLength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('password cannot contain "password"');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("age must be a positive number");
      }
    },
  },
  tokens:[
    {
       token:{
        type:String,
        required:true
       } 
    }
  ]
});

userSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})

userSchema.methods.toJSON =function(){
   const user =this
   const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
   return userObject
}

userSchema.methods.generateToken = async function(){
   const user = this
    const token = jwt.sign({id:user._id.toString()}, 'thisisjustsomerandomtext')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Delete user tasks when user is deleted
// userSchema.pre("remove", async function (next) {
//   const user = this;
//   await Task.deleteMany({ owner: user._id });
//   next();
// });


const User = mongoose.model("User", userSchema);



module.exports = User;
