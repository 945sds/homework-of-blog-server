const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/default.json");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    config.jwtPrivateKey
  );
  return token;
};

userSchema.methods.setPassword = async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required().label("Username"),
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().min(8).max(30).required().label("Password"),
  });
  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validate = validateUser;
