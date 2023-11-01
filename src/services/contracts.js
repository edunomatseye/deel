const ContractsRepository = require("../repository/contracts");
class ContractsService {
  constructor() {
    this.contractsRepository = new ContractsRepository();
  }

  async getContractList(profileId) {
    return this.contractsRepository.listNonTerminatedContracts(profileId);
  }

}

module.exports = ContractsService;
