const { JobsRepository } = require("../repository/jobs");

class JobsService {
  constructor() {
    this.jobsRepository = new JobsRepository();
  }

  async findBestPayingClients(start, end, limit) {
    return this.jobsRepository.findBestPayingClients(start, end, limit);
  }

  async findBestProfession(start, end) {
    return this.jobsRepository.findBestProfession(start, end);
  }

  async getUnpaidJobs(profileId) {
    return this.jobsRepository.getUnpaidJobs(profileId);
  }
}

module.exports = JobsService;
