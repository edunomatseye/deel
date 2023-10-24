const { DepositService } = require("../../src/services/deposit"); // Import the DepositService class
const { JobsRepository } = require("../../src/repository/jobs");

describe("DepositService", () => {
  let depositService;

  beforeEach(() => {
    // Mock the JobsRepository and sequelize
    const jobRepo = new JobsRepository();
    jobRepo.getTotalJobsCost = jest.fn();
    const profileRepo = { findByPk: jest.fn(), update: jest.fn() };

    depositService = new DepositService();
    depositService.jobRepo = jobRepo; // Set the jobRepo property
    depositService.profileRepo = profileRepo; // Set the profileRepo property
  });

  afterEach(() => {
    // Clear mocks and restore them
    jest.clearAllMocks();
  });

  it("should deposit if the amount is less than 25% of total jobs cost", async () => {
    const clientId = 1;
    const amount = 99;
    const totalJobsCost = 400; // Mocked total jobs cost

    depositService.jobRepo.getTotalJobsCost.mockResolvedValue(totalJobsCost);
    depositService.profileRepo.findByPk.mockResolvedValue({ id: clientId, balance: 0 });

    await depositService.deposit(clientId, amount);

    // Check if the balance is updated correctly
    expect(depositService.profileRepo.update).toHaveBeenCalledWith(
      { id: clientId, balance: 99 },
      { where: { id: clientId } }
    );
  });

  it("should throw an error if the amount is not less than 25% of total jobs cost", async () => {
    const clientId = 1;
    const amount = 100;
    const totalJobsCost = 200; // Mocked total jobs cost

    depositService.jobRepo.getTotalJobsCost.mockResolvedValue(totalJobsCost);

    await expect(depositService.deposit(clientId, amount)).rejects.toThrow(
      "Client can't deposit more than 25% of their total jobs to pay"
    );

    // Ensure that the transaction is rolled back in case of an error
    expect(depositService.profileRepo.update).not.toHaveBeenCalled();
    expect(depositService.profileRepo.update).not.toHaveBeenCalledWith({ balance: expect.any(Number) });
  });
});
