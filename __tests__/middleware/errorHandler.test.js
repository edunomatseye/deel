const { errorHandler } = require("../../src/middleware/errorHandler");

describe("Error Handler", () => {
  it("should handle error and set status to 500", () => {
    const err = new Error("Something went wrong");
    const req = {};
    const res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should handle error with custom status code", () => {
    const err = new Error("Something went wrong");
    err.statusCode = 400;
    const req = {};
    const res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    errorHandler(err, req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should not send headers if they are already sent", () => {
    const err = new Error("Something went wrong");
    const req = {};
    const res = {
      headersSent: true,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should send error message and stack trace in development mode", () => {
    process.env.NODE_ENV = "development";
    const err = new Error("Something went wrong");
    const req = {};
    const res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    errorHandler(err, req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: "Something went wrong",
      stack: err.stack,
    });
  });

  it("should send error message without stack trace in production mode", () => {
    process.env.NODE_ENV = "production";
    const err = new Error("Something went wrong");
    const req = {};
    const res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    errorHandler(err, req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: "Something went wrong",
      stack: {},
    });
  });
});
