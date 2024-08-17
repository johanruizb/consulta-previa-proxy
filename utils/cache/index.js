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

        const cache_path = path.join(root, key);
        fs.writeFileSync(cache_path, JSON.stringify(data));
    },
    delete: (key) => {
        if (key.includes("..")) return null;

        const cache_path = path.join(root, key);
        fs.unlinkSync(cache_path);
    },
};

module.exports = CACHES;
