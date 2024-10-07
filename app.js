require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();

var indexRouter = require("./routes/index");
const cors = require("cors");
const compression = require("compression");
const ms = require("ms");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

if (app.get("env") == "development") {
    app.use(cors({ origin: "http://localhost:7153", credentials: true }));
}

const EXT = [".woff", ".png", ".woff2", ".css", ".ico", ".jpg", ".js"];

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    express.static(path.join(__dirname, "dist"), {
        setHeaders: function (res, path) {
            const needCache = EXT.some((ext) => path.endsWith(ext));
            // console.log(path, needCache);
            if (needCache)
                res.setHeader("Cache-Control", "public, max-age=" + ms("1d"));
        },
    })
);

app.use("/v1", indexRouter);

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
    // res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
