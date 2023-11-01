const ContractsRepository = require("../repository/contracts");
class ContractsService {
  constructor() {
    this.contractsRepository = new ContractsRepository();
  }

  async getContractList(profileId) {
    const contracts = await this.contractsRepository.listNonTerminatedContracts(profileId);
    return contracts.map(contract => contract)
  }

}

module.exports = ContractsService;
