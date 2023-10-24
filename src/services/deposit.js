const { JobsRepository } = require("../repository/jobs");
const { sequelize, Profile } = require("../model");

class DepositService {
  constructor() {
    this.jobRepo = new JobsRepository();
    this.profileRepo = Profile;
  }

  async deposit(clientId, amount) {
    const transaction = await sequelize.transaction();

    try {
      const [total, client] = await Promise.all([
        this.jobRepo.getTotalJobsCost(clientId),
        this.profileRepo.findByPk(clientId),
      ]);

      if (amount <= total * 0.25) {
        //Check if the client object exists and has a balance property
        if (client && client.balance !== undefined) {
          client.balance += amount;
          await this.profileRepo.update(client, { where: { id: client.id } });
        } else {
          throw new Error("Client not found or balance is undefined");
        }
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
