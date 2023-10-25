const express = require("express");
const router = express.Router();

const { getBestProfession, getBestClients } = require("./controller/jobs");
const { makeClientDeposit } = require("./controller/balance");

router.get("/admin/best-profession", getBestProfession);
router.get("/admin/best-clients", getBestClients);
router.post("/balances/deposit/:clientId", makeClientDeposit)

module.exports = { appRouter: router };