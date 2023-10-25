const express = require("express");
const router = express.Router();

const { getContractsById, getContractList } = require("./controller/contracts");
const { getBestProfession, getBestClients, getAllUnpaidJob, makePaymentForJobDone } = require("./controller/jobs");
const { makeClientDeposit } = require("./controller/balance");

router.get("/admin/best-profession", getBestProfession);
router.get("/admin/best-clients", getBestClients);
router.post("/balances/deposit/:clientId", makeClientDeposit);
router.get("/jobs/unpaid", getAllUnpaidJob);
router.post("/jobs/:job_id/pay", makePaymentForJobDone);
router.get("/contracts/:id", getContractsById);
router.get("/contracts", getContractList);

module.exports = { appRouter: router };