const errorConstructor = require("./errorConstructor");

const findKeyError = (obj) => {
  if (typeof obj === "object") {
    if (
      (Array.isArray(obj) && obj.length === 0) ||
      Object.keys(obj).length === 0
    ) {
      throw new errorConstructor("key_error", 400);
    }
    for (let i in obj) {
      if (!obj[i]) {
        throw new errorConstructor("key_error", 400);
      }
    }
  } else {
    if (!obj) {
      throw new errorConstructor("key_error", 400);
    }
  }
};
module.exports = {
  findKeyError,
};
