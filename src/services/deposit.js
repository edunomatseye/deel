const { JobsRepository } = require("../repository/jobs");
const { sequelize, Profile } = require("../model");

class DepositService {
  constructor() {
    this.jobRepo = new JobsRepository();
    this.profileRepo = Profile;
  }

  async deposit(clientId, amt) {
    const amount = Number(amt);
    const transaction = await sequelize.transaction();

    try {
      const [{total}, client] = await Promise.all([
        this.jobRepo.getTotalJobsCost(clientId, transaction),
        this.profileRepo.findByPk(clientId),
      ]);

      if (amount <= (total * 0.25)) {
        //Check if the client object exists and has a balance property
          const newBalance = Number(client.balance) + Number(amount);
          await client.update({ balance: newBalance });
          await client.save();

          return client.balance;
      } else {
        throw new Error("Client can't deposit more than 25% of their total jobs to pay");
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = { DepositService };
