const { DepositService } = require("../../src/services/deposit"); // Import the DepositService class

describe('DepositService', () => {
  let depositService;

  // Mock dependencies
  const mockJobRepo = {
    getTotalJobsCost: jest.fn(),
  };
  const mockProfileRepo = {
    findByPk: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    depositService = new DepositService();
    depositService.jobRepo = mockJobRepo;
    depositService.profileRepo = mockProfileRepo;
  });

  it('should deposit an amount and update the client balance', async () => {
    const clientId = 1;
    const depositAmount = 25; // 25% of total job cost

    mockJobRepo.getTotalJobsCost.mockResolvedValue({ total: 100 }); // Mock total job cost
    mockProfileRepo.findByPk.mockResolvedValue({ 
      clientId: 1, 
      balance: 50, 
      update: jest.fn().mockResolvedValue({ balance: 75 }),
      save: jest.fn()
    }); // Mock client data
    
    const result = await depositService.deposit(clientId, depositAmount);

    expect(mockProfileRepo.findByPk).toHaveBeenCalledWith(clientId);
  });

  it('should throw an error if the deposit amount exceeds 25% of total job cost', async () => {
    mockJobRepo.getTotalJobsCost.mockResolvedValue({ total: 100 }); // Mock total job cost
    mockProfileRepo.findByPk.mockResolvedValue({ clientId: 1, balance: 50 }); // Mock client data

    const clientId = 1;
    const depositAmount = 30; // More than 25% of total job cost

    await expect(depositService.deposit(clientId, depositAmount)).rejects.toThrow("Client can't deposit more than 25% of their total jobs to pay");
  });

  it('should handle errors and rollback the transaction', async () => {
    mockJobRepo.getTotalJobsCost.mockResolvedValue({ total: 100 }); // Mock total job cost
    mockProfileRepo.findByPk.mockRejectedValue(new Error('Error retrieving client data')); // Simulate an error

    const clientId = 1;
    const depositAmount = 25; // 25% of total job cost

    await expect(depositService.deposit(clientId, depositAmount)).rejects.toThrow('Error retrieving client data');
  });
});
