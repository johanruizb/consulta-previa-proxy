require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();

var indexRouter = require("./routes/index");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const io = require("@pm2/io");

io.init({
    transactions: true, // will enable the transaction tracing
    http: true, // will enable metrics about the http server (optional)
});

const geoip = require("fast-geoip");

const restrictToColombia = (req, res, next) => {
    const ip =
        req.headers["cf-connecting-ip"] ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress;
    const geo = geoip.lookup(ip);

    console.log("IP: ", ip);
    console.log("Geo: ", geo);

    if (geo?.country === "CO") {
        next(); // Permite el acceso
    } else {
        res.status(403).send(
            "Acceso denegado: Solo se permite el ingreso desde Colombia."
        );
    }
};

if (app.get("env") == "production")
    // Usa el middleware en tu aplicación
    app.use(restrictToColombia);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 100, // Limit each IP to 180 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});

const origin =
    app.get("env") == "development"
        ? "http://localhost:7153"
        : "https://registro-consulta-previa.onrender.com";

app.use(limiter);
app.use(cors({ origin: origin, credentials: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    express.static(path.join(__dirname, "dist"), {
        setHeaders: (res, path) => {
            if (
                path.endsWith(".js") ||
                path.endsWith(".css") ||
                path.endsWith(".woff") ||
                path.endsWith(".woff2")
            ) {
                res.setHeader("Cache-Control", "public, max-age=31536000");
            }
        },
    })
);

app.use("/v1", indexRouter);

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
    // res.sendFile(path.join(__dirname, "dist", "index.html"));
    res.redirect("/");
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
