const express = require("express");
const _ = require("lodash");
const { Article, validate } = require("../../models/article");
const auth = require("../../middleware/auth");
const validateObjectId = require("../../middleware/validateObjectId");
const { User } = require("../../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  const articles = await Article.find()
    .populate("author", "name")
    .select("-__v")
    .sort("like_number");
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
  const articleData = { ...req.body, author: req.user._id };
  //验证输入格式
  const { error } = validate(articleData);
  if (error) return res.status(400).send(error.details[0].message);
  //存储
  const article = new Article(
    _.pick(articleData, ["title", "description", "body", "author"])
  );
  await article.save();
  //更新用户信息
  let { published_articles } = await User.findById(req.user._id);
  if (published_articles.includes(article._id))
    return res.status("400").send("The article has been liked.");
  published_articles.push(article._id);
  await User.findByIdAndUpdate(req.user._id, {
    published_articles: published_articles,
  });
  //发送
  res.send(
    _.pick(article, [
      "_id",
      "title",
      "description",
      "body",
      "author",
      "like_number",
    ])
  );
});

router.post("/:id/like", [validateObjectId, auth], async (req, res) => {
  let { liked_articles } = await User.findById(req.user._id);
  if (liked_articles.includes(req.params.id))
    return res.status("400").send("The article has been liked.");
  liked_articles.push(req.params.id);
  await User.findByIdAndUpdate(req.user._id, {
    liked_articles: liked_articles,
  });
  let { like_number } = await Article.findById(req.params.id);
  like_number++;
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    {
      like_number: like_number,
    },
    {
      new: true,
    }
  )
    .populate("author", "name")
    .select("-__v");
  res.send(article);
});

router.delete("/:id/unlike", [validateObjectId, auth], async (req, res) => {
  let { liked_articles } = await User.findById(req.user._id);
  if (!liked_articles.includes(req.params.id))
    return res.status("400").send("The article has been unlike.");
  const index = liked_articles.indexOf(req.params.id);
  liked_articles.splice(index, 1);
  await User.findByIdAndUpdate(req.user._id, {
    liked_articles: liked_articles,
  });
  let { like_number } = await Article.findById(req.params.id);
  like_number--;
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    {
      like_number: like_number,
    },
    {
      new: true,
    }
  )
    .populate("author", "name")
    .select("-__v");
  res.send(article);
});

module.exports = router;
