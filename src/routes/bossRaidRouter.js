const express = require("express");
const router = express.Router();
const bossRaidController = require("../controllers/bossRaidController");

const errorHandler = require("../middlewares/errorHandler");

router.post("/enter", errorHandler(bossRaidController.raidStart));
router.patch("/end", errorHandler(bossRaidController.raidEnd));
router.get(
  "/topRankerList",
  errorHandler(bossRaidController.getTopRanckerList)
);
router.get("", errorHandler(bossRaidController.getStatus));

module.exports = router;
