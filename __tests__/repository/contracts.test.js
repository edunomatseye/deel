const { Contract } = require("../../src/model");
const ContractsRepository = require("../../src/repository/contracts");

jest.mock("../../src/model");

describe("ContractsRepository", () => {
  it("should return a list of non-terminated contracts for the specified profile ID", async () => {
    const profileId = 123;
    const contracts = [
      { id: 1, status: "active" },
      { id: 2, status: "pending" },
    ];

    Contract.findAll.mockReturnValue(contracts);

    const repository = new ContractsRepository();
    const result = await repository.listNonTerminatedContracts(profileId);

    expect(result).toEqual(contracts);
  });
});

describe("ContractsRepository", () => {
  it("should return a contract owned by the specified profile ID", async () => {
    const id = 1;
    const profileId = 123;
    const contract = { id, ContractorId: profileId, status: "active" };

    Contract.findOne.mockReturnValue(contract);

    const repository = new ContractsRepository();
    const result = await repository.findContractOwnedBy(id, profileId);

    expect(result).toEqual(contract);
  });

  it("should return null if the contract does not exist or is not owned by the specified profile ID", async () => {
    const id = 1;
    const profileId = 123;

    Contract.findOne.mockReturnValue(null);

    const repository = new ContractsRepository();
    const result = await repository.findContractOwnedBy(id, profileId);

    expect(result).toBeNull();
  });
});
