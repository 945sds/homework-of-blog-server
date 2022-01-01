const express = require("express");
const _ = require("lodash");
const { Article, validate } = require("../../models/article");
const auth = require("../../middleware/auth");
const validateObjectId = require("../../middleware/validateObjectId");

const router = express.Router();

router.get("/", async (req, res) => {
  const articles = await Article.find()
    .populate("author", "name")
    .select("-__v")
    .sort("name");
  res.send(articles);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const article = await Article.findById(req.params.id)
    .populate("author", "name")
    .select("-__v");
  //没有找到指定文章
  if (!article)
    return res.status(404).send("The article with the given ID was not found.");

  res.send(article);
});

router.post("/", auth, async (req, res) => {
  //验证输入格式
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //存储
  const article = new Article(
    _.pick(req.body, ["title", "description", "body", "author"])
  );
  await article.save();
  //发送
  res.send(_.pick(article, ["_id", "title", "description", "body", "author"]));
});

module.exports = router;
