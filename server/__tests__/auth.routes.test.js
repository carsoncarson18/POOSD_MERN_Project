const request = require("supertest");

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("../emails/email.service", () => ({
  sendVerificationEmail: jest.fn(),
}));

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../emails/email.service");
const { createTestApp } = require("./helpers/createTestApp");

describe("auth endpoints", () => {
  const app = createTestApp(["auth"]);

  const signupPayload = {
    firstName: "george",
    username: "george",
    email: "george@example.com",
    password: "Password!1",
  };

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.APP_URL = "http://localhost:3000";

    jest.clearAllMocks();

    bcrypt.hash.mockResolvedValue("hashed-password");
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("signed-token");
    jwt.verify.mockReturnValue({
      firstName: "george",
      username: "george",
      password: "hashed-password",
      email: "george@example.com",
    });
    sendVerificationEmail.mockReturnValue(true);
  });

  test("POST /api/signup returns validation errors for bad input", async () => {
    const response = await request(app).post("/api/signup").send({
      username: "ab",
      email: "not-an-email",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors.firstName).toBeDefined();
  });

  test("POST /api/signup rejects duplicate usernames", async () => {
    User.findOne
      .mockResolvedValueOnce({ _id: "user-1" })
      .mockResolvedValueOnce(null);

    const response = await request(app).post("/api/signup").send(signupPayload);

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/Username already taken/i);
    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });

  test("POST /api/signup sends an activation email for valid signups", async () => {
    User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const response = await request(app).post("/api/signup").send(signupPayload);

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Register success/i);
    expect(bcrypt.hash).toHaveBeenCalledWith(signupPayload.password, 10);
    expect(jwt.sign).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalledWith(
      signupPayload.email,
      "http://localhost:3000/api/activate/signed-token",
      "Verify your email adress",
      "Confirm Email",
    );
  });

  test("GET /api/activate/:token creates the user when the token is valid", async () => {
    const createdUser = {
      _id: "user-1",
      firstName: "george",
      username: "george",
      email: "george@example.com",
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(createdUser);

    const response = await request(app).get("/api/activate/test-token");

    expect(response.status).toBe(200);
    expect(jwt.verify).toHaveBeenCalledWith("test-token", "test-secret");
    expect(User.create).toHaveBeenCalledWith({
      firstName: "george",
      username: "george",
      password: "hashed-password",
      email: "george@example.com",
    });
    expect(response.body.message).toMatch(/successfully activated/i);
    expect(response.body.user).toEqual(createdUser);
  });

  test("GET /api/activate/:token blocks duplicate activations", async () => {
    User.findOne.mockResolvedValue({ _id: "user-1" });

    const response = await request(app).get("/api/activate/test-token");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Account already activated!");
    expect(User.create).not.toHaveBeenCalled();
  });

  test("POST /api/login returns a token for valid credentials", async () => {
    User.findOne.mockResolvedValue({
      _id: "user-1",
      password: "stored-hash",
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("session-token");

    const response = await request(app).post("/api/login").send({
      username: "george",
      password: "Password!1",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("session-token");
    expect(response.body.user).toEqual({
      success: true,
      data: {
        username: "george",
        password: "Password!1",
      },
    });
  });

  test("POST /api/login rejects invalid credentials", async () => {
    User.findOne.mockResolvedValue({
      _id: "user-1",
      password: "stored-hash",
    });
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app).post("/api/login").send({
      username: "george",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid login");
  });
});
