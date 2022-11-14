const LRU = require("lru-cache");
const options = {
  max: 50,
  maxSize: 5000,
  sizeCalculation: (value, key) => {
    return 1;
  },

  dispose: (value, key) => {
    freeFromMemoryOrWhatever(value);
  },

  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,

  fetchMethod: async (key, staleValue, { options, signal }) => {},
};

const sortingScore = () => {};
const bossRaidCache = new LRU(options);

module.exports = { bossRaidCache };
