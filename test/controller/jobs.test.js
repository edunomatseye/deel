const {
  getBestProfession,
  getBestClients,
  getAllUnpaidJob,
  makePaymentForJobDone,
} = require("../../src/controller/jobs"); // Replace with your actual controller file
const { getFullName } = require("../../src/utils/getFullName");

const JobsService = require("../../src/services/jobs");
const { PaymentService } = require("../../src/services/payment");
jest.mock("../../src/services/jobs");
jest.mock("../../src/services/payment");

describe("getBestProfession", () => {
  it("should return the best profession for a given date range", async () => {
    // Mock dependencies and request objects
    const req = {
      query: { start: "2023-01-01", end: "2023-12-31" },
    };
    const res = {
      json: jest.fn(),
      sendStatus: jest.fn().mockReturnThis(),
    };

    // Mock the jobsService to return a result
    JobsService.prototype.findBestProfession.mockResolvedValue("Developer");

    await getBestProfession(req, res);

    // Assert that the result is returned
    expect(res.json).toHaveBeenCalledWith("Developer");
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it("should return a 404 status if no result is found", async () => {
    // Mock dependencies and request objects
    const req = {
      query: { start: "2023-01-01", end: "2023-12-31" },
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    };

    // Mock the jobsService to return no result
    JobsService.prototype.findBestProfession.mockResolvedValue(null);

    await getBestProfession(req, res);

    // Assert a 404 status response
    expect(res.sendStatus).toHaveBeenCalledWith(404);
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("getBestClients", () => {
  it("should return a list of best clients for a given date range and limit", async () => {
    // Mock dependencies and request objects
    const req = {
      query: { start: "2023-01-01", end: "2023-12-31", limit: 10 },
    };
    const res = {
      json: jest.fn().mockReturnThis(),
    };

    // Mock the jobsService to return a list of clients
    const mockedBestPayClient = [
      { firstName: "John", lastName: "Doe" },
      { firstName: "Alice", lastName: "Doe" },
    ];
    JobsService.prototype.findBestPayingClients.mockResolvedValue(
      mockedBestPayClient,
    );

    // Mock the getFullName function
    //getFullName = jest.fn().mockImplementation(({firstName, lastName, ...rest}) => ({...rest, fullName: `${firstName} ${lastName}`}));

    await getBestClients(req, res);

    // Assert that a list of clients is returned with full names
    expect(res.json).toHaveBeenCalledWith(mockedBestPayClient.map(getFullName));
  });
});

describe("getAllUnpaidJob", () => {
  it("should return a list of unpaid jobs for the authenticated user", async () => {
    // Mock dependencies and request objects
    const req = {
      profile: { id: 1 }, // Simulate an authenticated user
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    // Mock the jobsService to return a list of unpaid jobs
    JobsService.prototype.getUnpaidJobs.mockResolvedValue([
      { id: 1 },
      { id: 2 },
    ]),
      await getAllUnpaidJob(req, res);

    // Assert that a list of unpaid jobs is returned
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    expect(res.send).not.toHaveBeenCalled();
  });

  it("should return a 401 status with an error message if there is an error", async () => {
    // Mock dependencies and request objects
    const req = {
      profile: { id: 1 }, // Simulate an authenticated user
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    // Mock the jobsService to throw an error
    JobsService.prototype.getUnpaidJobs.mockRejectedValue(
      new Error("Error message"),
    );

    await getAllUnpaidJob(req, res);

    // Assert a 401 status response with an error message
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Error message" });
    expect(res.send).not.toHaveBeenCalled();
  });
});

describe("makePaymentForJobDone", () => {
  it("should make a payment for a job and return a success message", async () => {
    // Mock dependencies and request objects
    const req = {
      params: { job_id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    // Mock the paymentsService to make a payment successfully
    PaymentService.prototype.pay.mockResolvedValue(null),
      await makePaymentForJobDone(req, res, next);

    // Assert a 200 status response with a success message
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Job Paid successfully" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a 401 status with an error message if there is an error", async () => {
    // Mock dependencies and request objects
    const req = {
      params: { job_id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    // Mock the paymentsService to throw an error
    PaymentService.prototype.pay.mockRejectedValue(new Error("Error message")),
      await makePaymentForJobDone(req, res, next);

    // Assert a 401 status response with an error message
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ status: "Error message" });
    expect(next).toHaveBeenCalledWith(new Error("Error message"));
  });
});
