require("dotenv").config();

var express = require("express");
var router = express.Router();
const createError = require("http-errors");

/* GET home page. */
router.get("/countries", async function (req, res, next) {
    try {
        const result = await fetch(
            "https://api.countrystatecity.in/v1/countries",
            {
                headers: {
                    "X-CSCAPI-KEY": process.env["X-CSCAPI-KEY"],
                },
            },
        );

        res.header("Cache-Control", "public, max-age=604800");

        const data = await result.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        next(createError(500));
    }
});

router.get("/countries/:isoCode/states", async function (req, res, next) {
    try {
        const result = await fetch(
            `https://api.countrystatecity.in/v1/countries/${req.params.isoCode}/states`,
            {
                headers: {
                    "X-CSCAPI-KEY": process.env["X-CSCAPI-KEY"],
                },
            },
        );

        res.header("Cache-Control", "public, max-age=604800");

        const data = await result.json();
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
            const result = await fetch(
                `https://api.countrystatecity.in/v1/countries/${req.params.isoCode}/states/${req.params.stateCode}/cities`,
                {
                    headers: {
                        "X-CSCAPI-KEY": process.env["X-CSCAPI-KEY"],
                    },
                },
            );
            res.header("Cache-Control", "public, max-age=604800");
            const data = await result.json();
            res.json(data);
        } catch (error) {
            console.error(error);
            next(createError(500));
        }
    },
);

module.exports = router;
