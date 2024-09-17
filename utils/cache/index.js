const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "src");

const CACHES = {
    get: (key) => {
        try {
            if (key.includes("..")) return null;

            const cache = require(path.join(root, key));

            return cache;
        } catch (e) {
            return null;
        }
    },
};

module.exports = CACHES;
