const ContractsService = require("../../src/services/contracts");

// Mock the ContractsRepository to control its behavior
jest.mock("../../src/repository/contracts");
const ContractsRepository = require("../../src/repository/contracts");

describe("ContractsService", () => {
  // Test case for the getContractList method
  describe("getContractList", () => {
    it("should return a list of non-terminated contracts", async () => {
      // Arrange
      const profileId = 1;
      const expectedContracts = [
        { id: 1, profileId: 1, name: "Contract 1" },
        { id: 2, profileId: 1, name: "Contract 2" },
        { id: 3, profileId: 3, name: "Contract 3" },
      ];
      ContractsRepository.prototype.listNonTerminatedContracts.mockResolvedValue(
        expectedContracts,
      );

      // Act
      const contractsService = new ContractsService();
      const result = await contractsService.getContractList(profileId);

      // Assert
      expect(result).toEqual(expectedContracts);
    });

    it("should handle errors when retrieving contracts", async () => {
      // Arrange
      const profileId = 1;
      const expectedError = new Error("An error occurred");
      ContractsRepository.prototype.listNonTerminatedContracts.mockRejectedValue(
        expectedError,
      );

      // Act
      const contractsService = new ContractsService();

      // Assert and check for rejection
      await expect(contractsService.getContractList(profileId)).rejects.toThrow(
        expectedError,
      );
    });
  });
});
