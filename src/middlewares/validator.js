const Joi = require("joi");
const { redisCli } = require("../cache");

const startBossRaidValidator = async (req, res, next) => {
  try {
    const body = req.body;

    const schema = Joi.object({
      userId: Joi.number().integer().positive().required(),
      level: Joi.number().integer().positive().required(),
    }).with(("userId", "level"));

    const { value, error } = schema.validate(body);
    if (error) {
      throw error;
    }

    const isValidLevel = await redisCli.hGet("scoreboard", `${body.level}`);
    if (!isValidLevel) {
      return res.status(400).json({ message: "Invalid Value" });
    }

    next();
  } catch (error) {
    if (error.details) {
      return res.status(400).json({ message: "Invalid Value" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};

const endBossRaidValidator = async (req, res, next) => {
  try {
    const body = req.body;
    const schema = Joi.object({
      userId: Joi.number().integer().positive().required(),
      raidRecordId: Joi.number().integer().positive().required(),
    }).with("userId", "raidRecordId");

    const { value, error } = schema.validate(body);
    if (error) {
      throw error;
    }

    next();
  } catch (error) {
    if (error.details) {
      return res.status(400).json({ message: "Invalid Value" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};

const userIdValidator = async (req, res, next) => {
  try {
    const body = req.body;
    const schema = Joi.object({
      userId: Joi.number().integer().positive().required(),
    });

    const { value, error } = schema.validate(body);
    if (error) {
      throw error;
    }

    next();
  } catch (error) {
    if (error.details) {
      return res.status(400).json({ message: "Invalid Value" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  startBossRaidValidator,
  endBossRaidValidator,
  userIdValidator,
};
