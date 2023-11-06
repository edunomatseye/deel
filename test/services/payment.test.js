const { PaymentService } = require("../../src/services/payment");
const { JobsRepository } = require("../../src/repository/jobs");

describe("PaymentService", () => {
  let paymentService;

  beforeEach(() => {
    // Mock the JobsRepository and sequelize
    const jobRepo = new JobsRepository();
    jobRepo.getJob = jest.fn();
    const transaction = { commit: jest.fn(), rollback: jest.fn() };

    paymentService = new PaymentService();
    paymentService.jobRepo = jobRepo; // Set the jobRepo property
    paymentService.transaction = transaction; // Set the transaction property
  });

  it("should successfully pay for a job", async () => {
    const jobId = 1;
    const job = {
      id: jobId,
      paid: 0,
      price: 100,
      Contract: {
        Client: {
          id: 1,
          balance: 150,
          save: jest.fn(),
        },
        Contractor: {
          id: 2,
          balance: 50,
          save: jest.fn(),
        },
      },
      save: jest.fn(),
    };

    paymentService.jobRepo.getJob.mockResolvedValue(job);
    const transaction = { commit: jest.fn(), rollback: jest.fn() };

    await expect(paymentService.pay(jobId)).resolves.not.toThrow();

    expect(job.Contract.Client.balance).toBe(50);
    expect(job.Contract.Contractor.balance).toBe(150);
    expect(job.paid).toBe(1);
    expect(job.paymentDay instanceof Date).toBe(true);
    expect(job.save).toHaveBeenCalledTimes(1);
    expect(job.Contract.Client.save).toHaveBeenCalledTimes(1);
    expect(job.Contract.Contractor.save).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the job is already paid", async () => {
    const jobId = 1;
    const job = {
      id: jobId,
      paid: 1,
    };

    paymentService.jobRepo.getJob.mockResolvedValue(job);

    await expect(paymentService.pay(jobId)).rejects.toThrow("Job already paid");
  });

  it("should throw an error if the client balance is not enough", async () => {
    const jobId = 1;
    const job = {
      id: jobId,
      paid: 0,
      price: 100,
      Contract: {
        Client: {
          id: 1,
          balance: 50, // Client balance is not enough for the payment
        },
        Contractor: {
          id: 2,
          balance: 50,
        },
      },
    };

    paymentService.jobRepo.getJob.mockResolvedValue(job);

    await expect(paymentService.pay(jobId)).rejects.toThrow(
      "The Client balance is not enough",
    );
  });
});
