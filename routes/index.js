const router = require("express").Router();

router.use("/users", require("./api/users"));
router.use("/auth", require("./api/auth"));
router.use("/articles", require("./api/articles"));

module.exports = router;
