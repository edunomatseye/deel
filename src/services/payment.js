const { JobsRepository } = require("../repository/jobs");
const { sequelize } = require("../model");

class PaymentService {
  constructor() {
    this.jobRepo = new JobsRepository();
  }

  async pay(jobId) {
    const transaction = await sequelize.transaction();

    try {
      const job = await this.jobRepo.getJob(jobId, transaction);

      if (job.paid) {
        throw new Error("Job already paid");
      }

      if (job.Contract.Client.balance < job.price) {
        throw new Error("The Client balance is not enough");
      }

      job.Contract.Client.balance -= job.price;
      job.Contract.Contractor.balance += job.price;
      job.paid = 1;
      job.paymentDay = new Date();

      await Promise.all([
        job.Contract.Client.save(),
        job.Contract.Contractor.save(),
        job.save(),
      ]);

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = { PaymentService };
