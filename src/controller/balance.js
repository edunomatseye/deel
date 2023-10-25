const { DepositService } = require("../services/deposit");

const depositService = new DepositService();

async function makeClientDeposit(req, res, next) {
  const { clientId } = req.params;
  const { amount } = req.body;

  try {
    const balance = await depositService.deposit(clientId, amount);

    res.status(200).json({ message: 'Deposit was successfully - balance: ' + balance});
  } catch (err) {
    res.status(401).json({ error: err.message });
    next()
  }
};

module.exports = { makeClientDeposit };