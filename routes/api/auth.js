const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../../models/user");
const Joi = require("joi");

const router = express.Router();

//登录
router.post("/", async (req, res) => {
  //验证输入格式
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //验证用户是否存在
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");
  //验证密码是否正确
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");
  //发送token
  const token = user.generateJWT();
  res.send(token);
});

function Validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().min(8).max(30).required().label("Password"),
  });
  return schema.validate(req);
}

module.exports = router;
