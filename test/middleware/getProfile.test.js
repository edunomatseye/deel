const request = require("supertest");
const app = require("../../src/app");
const { Profile } = app.get("models");

describe("Middleware getProfile", () => {
  let server;

  beforeAll(() => {
    server = app.listen();
  });

  afterAll((done) => {
    server.close(done);
  });

  it("should return 404 if profile is not set in the header", async () => {
    jest.spyOn(Profile, "findOne").mockResolvedValue(null);
    const response = await request(server).get("/");

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: `Profile not found!` });
  });

  it("should return 404 if profile is not in the database", async () => {
    jest.spyOn(Profile, "findOne").mockResolvedValue(null);
    const response = await request(server).get("/").set("profile_id", "1");

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: `Profile not found!` });
  });
});
