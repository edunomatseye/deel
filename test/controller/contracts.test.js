const {
    getContractsById,
    getContractList,
  } = require('../../src/controller/contracts');
const ContractsService = require("../../src/services/contracts");
jest.mock('../../src/services/contracts')
  
  describe('getContractsById', () => {
    it('should return a contract by ID if it exists and is accessible', async () => {
      // Mock the required dependencies and request objects
      const Contract = {
        findOne: jest.fn().mockResolvedValue({ id: 1, ClientId: 2, ContractorId: 3 }),
      };
      const req = {
        app: { get: jest.fn().mockReturnValue({ Contract }) },
        params: { id: 1 },
        profile: { id: 2 }, // Simulate a user profile
      };
      const res = {
        status: jest.fn(),
        json: jest.fn().mockReturnValue({ end: jest.fn()}),
        sendStatus: jest.fn(),
      };
  
      await getContractsById(req, res);
  
      // Assert that the contract is returned
      expect(res.json).toHaveBeenCalledWith({ id: 1, ClientId: 2, ContractorId: 3 });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.sendStatus).not.toHaveBeenCalled();
    });
  
    it('should return a 404 error if the contract is not found', async () => {
      // Mock the required dependencies and request objects
      const Contract = {
        findOne: jest.fn().mockResolvedValue(null), // Simulate contract not found
      };
      const req = {
        app: { get: jest.fn().mockReturnValue({ Contract }) },
        params: { id: 1 },
        profile: { id: 2 }, // Simulate a user profile
      };
      const res = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
        json: jest.fn().mockReturnValue({ end: jest.fn() }),
        sendStatus: jest.fn(),
      };
  
      await getContractsById(req, res);
  
      // Assert a 404 error response
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({ error: 'contract not found' });
      expect(res.sendStatus).not.toHaveBeenCalled();
    });
  
    it('should return a 403 status if the contract is inaccessible', async () => {
      // Mock the required dependencies and request objects
      const Contract = {
        findOne: jest.fn().mockResolvedValue({ id: 1, ClientId: 4, ContractorId: 5 }),
      };
      const req = {
        app: { get: jest.fn().mockReturnValue({ Contract }) },
        params: { id: 1 },
        profile: { id: 2 }, // Simulate a different user profile
      };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };
  
      await getContractsById(req, res);
  
      // Assert a 403 status response
      expect(res.sendStatus).toHaveBeenCalledWith(403);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  
  describe('getContractList', () => {
    it('should return a list of contracts', async () => {
      // Mock the contractsService to return a list of contracts
      const profileId = 2; // Simulate a user profile
      const mockContractList = [{ id: 1 }, { id: 2 }]

      ContractsService.prototype.getContractList.mockResolvedValue(mockContractList)

      const req = {
        profile: { id: profileId },
      };
      const res = {
        json: jest.fn(),
      };
  
      await getContractList(req, res);
  
      // Assert that a list of contracts is returned
      expect(res.json).toHaveBeenCalledWith(mockContractList);
    });
  });
  