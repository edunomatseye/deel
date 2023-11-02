const { makeClientDeposit } = require('../../src/controller/balance');
const { DepositService } = require('../../src/services/deposit');
jest.mock('../../src/services/deposit');

describe('makeClientDeposit', () => {
  let req, res, next;
  let depositService;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should make a client deposit and return success response', async () => {
    // Arrange
    req.params.clientId = 1;
    req.body.amount = 100;
    DepositService.prototype.deposit.mockResolvedValue(200);

    // Act
    await makeClientDeposit(req, res, next);

    // Assert
    expect(DepositService.prototype.deposit).toHaveBeenCalledWith(1, 100);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Deposit was successfully - balance: 200' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle deposit service error and return an error response', async () => {
    // Arrange
    req.params.clientId = 1;
    req.body.amount = 100;
    DepositService.prototype.deposit.mockRejectedValue(new Error('Deposit failed'));

    // Act
    await makeClientDeposit(req, res, next);

    // Assert
    expect(DepositService.prototype.deposit).toHaveBeenCalledWith(1, 100);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Deposit failed' });
    expect(next).toHaveBeenCalled();
  });
});
