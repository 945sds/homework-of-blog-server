const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = new express();

//连接数据库
mongoose
  .connect("mongodb://localhost/blog")
  .then("Server is connecting to MongoDB...");

//支持跨域
app.use(cors());
//解析response里的json
app.use(express.json());
//api路由
app.use("/api", require("./routes/index"));

//监听
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}...`);
});
