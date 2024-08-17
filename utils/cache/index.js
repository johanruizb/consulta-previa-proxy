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
    save: (key, data) => {
        if (key.includes("..")) return null;

        try {
            const cache_path = path.join(root, key);
            fs.writeFileSync(cache_path, JSON.stringify(data));
        } catch (e) {
            console.log(e);
        }
    },
    delete: (key) => {
        if (key.includes("..")) return null;

        try {
            const cache_path = path.join(root, key);
            fs.unlinkSync(cache_path);
        } catch (e) {
            console.log(e);
        }
    },
};

module.exports = CACHES;
