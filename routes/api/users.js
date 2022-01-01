const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../../models/user");
const validateObjectId = require("../../middleware/validateObjectId");

const router = express.Router();

//获得用户信息
router.get("/:id", validateObjectId, async (req, res) => {
  //不要发送密码
  const user = await User.findById(req.params.id).select("-password -__v");
  //没有找到指定用户
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  //发送user信息
  res.send(user);
});

//新建用户
router.post("/", async (req, res) => {
  //验证输入格式
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //验证用户是否已经建立过
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");
  //从req.body中取出各个属性
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  //给密码加密
  await user.setPassword();
  //将新用户信息保存到数据库中
  await user.save();
  //生成token
  const token = user.generateJWT();
  //将token放入header中并发送user信息
  res
    .header("token", token)
    .header("access-control-expose-headers", "token")
    .send(_.pick(user, ["_id", "name", "email", "description"]));
});

module.exports = router;
