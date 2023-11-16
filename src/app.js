const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const { errorHandler } = require("./middleware/errorHandler");
const { appRouter } = require("./router");

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(getProfile);
app.use("/", appRouter);

app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(errorHandler);

module.exports = app;
