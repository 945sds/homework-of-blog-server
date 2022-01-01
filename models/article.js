const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 10,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  like_number: {
    type: Number,
    default: 0,
  },
});

function validateArticle(article) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(30).required(),
    description: Joi.string().required(),
    body: Joi.string().min(1).required(),
    author: Joi.objectId().required(),
  });
  return schema.validate(article);
}

const Article = mongoose.model("Article", articleSchema);

exports.Article = Article;
exports.validate = validateArticle;
