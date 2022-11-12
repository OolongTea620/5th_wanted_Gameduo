const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const bossRaidRouter = require("./bossRaidRouter");
router.use("/user", userRouter);
router.use("/bossRaid", bossRaidRouter);

module.exports = router;
