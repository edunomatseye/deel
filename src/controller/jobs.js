const JobsService = require("../services/jobs");
const PaymentsService = require("../services/payment");
const { getFullName } = require('../utils/getFullName');


const jobsService = new JobsService();
const paymentsService = new PaymentsService();


async function getBestProfession(req, res) {
  const { start, end } = req.query;
  let result = await jobsService.findBestProfession(start, end);

  if (!result) return res.sendStatus(404);

  return res.json(result);
}

async function getBestClients(req, res) {
  const { start, end, limit } = req.query;

  try {
    const clients = await jobsService.findBestPayingClients(start, end, limit);
    res.json(clients.map(getFullName));
  } catch (err) {
    throw err;
  }
}

async function getAllUnpaidJob(req, res) {
    const userId = req.profile.id;

    try {
        const jobs = await jobsService.getUnpaidJobs(req.profile.id);
        res.json(jobs);
    } catch (err) {
        res.send(401).json({ message: err.message });
    }
}

async function makePaymentForJobDone (req, res, next) {
  const { job_id } = req.params;
  try {
    await paymentsService.pay(job_id);

    res.status(200).json({ message: 'Job Paid successfully' });
  } catch (err) {
    res.status(401).json({ status: err.message });
    next(err);
  }
}

module.exports = { getBestProfession, getBestClients, getAllUnpaidJob, makePaymentForJobDone };
