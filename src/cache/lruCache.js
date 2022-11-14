const LRU = require("lru-cache");

const options = {
  dispose: (value, key) => {
    freeFromMemoryOrWhatever(value);
  },

  // how long to live in ms
  ttl: 1000 * 60 * 5,
};

const cache = new LRU(options);

cache.set("key", "value");
cache.get("key"); // "value"

// non-string keys ARE fully supported
// but note that it must be THE SAME object, not
// just a JSON-equivalent object.
var someObject = { a: 1 };
cache.set(someObject, "a value");
// Object keys are not toString()-ed
cache.set("[object Object]", "a different value");
assert.equal(cache.get(someObject), "a value");
// A similar object with same keys/values won't work,
// because it's a different object identity
assert.equal(cache.get({ a: 1 }), undefined);

cache.clear(); // empty the cache
