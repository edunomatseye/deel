

const ContractsRepository = require("../repository/contracts");

class ContractsService {
  constructor() {
    this.contractsRepository = new ContractsRepository();
  }

  async getContractList(profileId) {
    const contracts = await this.contractsRepository.listNonTerminatedContracts(profileId);
    return contracts.map(contract => contract)
  }

//   async findBestProfession(start, end) {
//     return this.jobsRepository.findBestProfession(start, end);
//   }
}

module.exports = ContractsService;
