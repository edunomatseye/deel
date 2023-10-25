const { Contract } = require("../model");
const { Op } = require("sequelize");

class ContractsRepository {
  async listNonTerminatedContracts(profileId) {
    const query = {
      where: {
        status: { [Op.not]: "terminated" },
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      },
    };

    return Contract.findAll(query);
  }

  async findContractOwnedBy(id, profileId) {
    const query = {
      where: {
        id,
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      },
    };

    return Contract.findOne(query);
  }
}

module.exports = ContractsRepository;
