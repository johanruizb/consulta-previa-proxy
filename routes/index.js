require("dotenv").config();

var express = require("express");
var router = express.Router();
const createError = require("http-errors");

const CACHES = require("../utils/cache");

router.get("/countries", async function (req, res, next) {
    try {
        let data = null;
        const cache = CACHES.get("countries.json");

        if (cache) {
            data = cache;
        } else {
            const result = await fetch(
                "https://api.countrystatecity.in/v1/countries",
                {
                    headers: {
                        "X-CSCAPI-KEY": process.env.X_CSCAPI_KEY,
                    },
                }
            );
            data = await result.json();
            CACHES.save("countries.json", data);
        }

        res.header("Cache-Control", "public, max-age=604800");
        res.json(data);
    } catch (error) {
        console.error(error);
        next(createError(500));
    }
});

router.get("/countries/:isoCode/states", async function (req, res, next) {
    try {
        let data = null;

        const cacheKey = `states_${req.params.isoCode}.json`;
        const cache = CACHES.get(cacheKey);

        if (cache) {
            data = cache;
        } else {
            const result = await fetch(
                `https://api.countrystatecity.in/v1/countries/${req.params.isoCode}/states`,
                {
                    headers: {
                        "X-CSCAPI-KEY": process.env.X_CSCAPI_KEY,
                    },
                }
            );
            data = await result.json();
            CACHES.save(cacheKey, data);
        }

        res.header("Cache-Control", "public, max-age=604800");
        res.json(data);
    } catch (error) {
        console.error(error);
        next(createError(500));
    }
});

router.get(
    "/countries/:isoCode/states/:stateCode/cities",
    async function (req, res, next) {
        try {
            let data = null;

            const cacheKey = `cities_${req.params.isoCode}_${req.params.stateCode}.json`;
            const cache = CACHES.get(cacheKey);

            if (cache) {
                data = cache;
            } else {
                const result = await fetch(
                    `https://api.countrystatecity.in/v1/countries/${req.params.isoCode}/states/${req.params.stateCode}/cities`,
                    {
                        headers: {
                            "X-CSCAPI-KEY": process.env.X_CSCAPI_KEY,
                        },
                    }
                );
                data = await result.json();
                CACHES.save(cacheKey, data);
            }
            res.header("Cache-Control", "public, max-age=604800");
            res.json(data);
        } catch (error) {
            console.error(error);
            next(createError(500));
        }
    }
);

module.exports = router;
