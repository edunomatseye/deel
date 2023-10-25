const JobsService = require("../services/jobs");
const { getFullName } = require('../utils/getFullName');


const jobsService = new JobsService();

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

module.exports = { getBestProfession, getBestClients };
