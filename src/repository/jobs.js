const { Contract, Job, Profile, sequelize } = require("../model");
const { Op } = require("sequelize");

class JobsRepository {
  createBaseQuery(start, end) {
    return {
      where: {
        paid: 1,
        createdAt: { [Op.gte]: start },
        paymentDate: { [Op.lte]: end },
      },
      include: [
        {
          model: Contract,
          attributes: [],
          include: [
            {
              model: Profile,
              as: "Client",
              attributes: [],
            },
          ],
        },
      ],
    };
  }

  async findBestPayingClients(start, end, limit = 2) {
    const query = this.createBaseQuery(start, end);
    query.group = ["Contract.Client.id"];
    query.attributes = [
      [sequelize.col("Contract.Client.id"), "id"],
      [sequelize.col("Contract.Client.firstName"), "firstName"],
      [sequelize.col("Contract.Client.lastName"), "lastName"],
      [sequelize.fn("SUM", sequelize.col("price")), "paid"],
    ];
    query.order = [[sequelize.col("paid"), "DESC"]];
    query.limit = limit;
    query.raw = true;

    return Job.findAll(query);
  }

  async findBestProfession(start, end) {
    const query = this.createBaseQuery(start, end);
    query.group = ["Contract.Contractor.profession"];
    query.attributes = [
      [sequelize.col("Contract.Contractor.profession"), "profession"],
      [sequelize.fn("SUM", sequelize.col("price")), "total"],
    ];
    query.order = [[sequelize.col("total"), "DESC"]];
    query.raw = true;

    return Job.findOne(query);
  }

  async getTotalJobsCost(clientId, transaction) {
    const query = {
      where: {
        paid: { [Op.is]: null },
      },
      include: [
        {
          model: Contract,
          required: true,
          attributes: [],
          where: {
            ClientId: clientId,
          },
          include: [
            {
              model: Profile,
              as: "Client",
              required: true,
              attributes: [],
            },
          ],
        },
      ],
      attributes: [[sequelize.fn("SUM", sequelize.col("price")), "total"]],
      raw: true,
    };

    return Job.findOne(query, { lock: true, transaction });
  }

  async getUnpaidJobs(profileId) {
    const query = {
      where: {
        [Op.or]: [
          { "$Contract.ContractorId$": profileId },
          { "$Contract.ClientId$": profileId },
        ],
        "$Contract.status$": { [Op.not]: "terminated" },
      },
      include: [
        {
          model: Contract,
          required: true,
        },
      ],
    };

    return Job.findAll(query);
  }

  async getJob(id, transaction) {
    const query = {
      where: {
        id,
      },
      include: [
        {
          model: Contract,
          required: true,
          attributes: ["ContractorId", "ClientId"],
          include: [
            {
              model: Profile,
              as: "Client",
              required: true,
            },
            {
              model: Profile,
              as: "Contractor",
              required: true,
            },
          ],
        },
      ],
    };

    return Job.findOne(query, { lock: true, transaction });
  }
}

module.exports = { JobsRepository };
