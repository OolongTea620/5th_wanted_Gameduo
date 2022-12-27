const express = require("express");
const router = express.Router();
const bossRaidController = require("../controllers/bossRaidController");
const {
  startBossRaidValidator,
  endBossRaidValidator,
  userIdValidator,
} = require("../middlewares/validator");

const errorHandler = require("../middlewares/errorHandler");

router.post(
  "/enter",
  startBossRaidValidator,
  errorHandler(bossRaidController.raidStart)
);
router.patch(
  "/end",
  endBossRaidValidator,
  errorHandler(bossRaidController.raidEnd)
);
router.post(
  "/topRankerList",
  userIdValidator,
  errorHandler(bossRaidController.getTopRanckerList)
);
router.get("", errorHandler(bossRaidController.getStatus));

module.exports = router;
