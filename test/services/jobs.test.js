const JobsService = require("../../src/services/jobs");

// Mock the ContractsRepository to control its behavior
jest.mock('../../src/repository/jobs');
const {JobsRepository} = require('../../src/repository/jobs');

describe('JobsService', () => {
  let jobsService;

  beforeEach(() => {
    jobsService = new JobsService();
  });

  // Test cases for findBestPayingClients method
  describe('findBestPayingClients', () => {
    it('should return the best paying clients', async () => {
      // Arrange
      const start = new Date('2023-01-01');
      const end = new Date('2023-12-31');
      const limit = 10;
      const expectedClients = [{ clientId: 1, totalPaid: 1000 }];

      JobsRepository.prototype.findBestPayingClients.mockResolvedValue(expectedClients);

      // Act
      const result = await jobsService.findBestPayingClients(start, end, limit);

      // Assert
      expect(result).toEqual(expectedClients);
    });
  });

  // Test cases for findBestProfession method
  describe('findBestProfession', () => {
    it('should return the best profession', async () => {
      // Arrange
      const start = new Date('2023-01-01');
      const end = new Date('2023-12-31');
      const expectedProfession = 'Software Engineer';

      JobsRepository.prototype.findBestProfession.mockResolvedValue(expectedProfession);

      // Act
      const result = await jobsService.findBestProfession(start, end);

      // Assert
      expect(result).toBe(expectedProfession);
    });
  });

  // Test cases for getUnpaidJobs method
  describe('getUnpaidJobs', () => {
    it('should return a list of unpaid jobs for a profile', async () => {
      // Arrange
      const profileId = 1;
      const unpaidJobs = [{ jobId: 1, amount: 100 }, { jobId: 2, amount: 200 }];

      JobsRepository.prototype.getUnpaidJobs.mockResolvedValue(unpaidJobs);

      // Act
      const result = await jobsService.getUnpaidJobs(profileId);

      // Assert
      expect(result).toEqual(unpaidJobs);
    });
  });
});
