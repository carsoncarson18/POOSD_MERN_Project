const request = require("supertest");

jest.mock("../models/Neighborhood", () => ({
  exists: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  updateOne: jest.fn(),
}));

jest.mock("../models/User", () => ({
  findByIdAndUpdate: jest.fn(),
  updateOne: jest.fn(),
}));

jest.mock("../models/Ingredient", () => ({
  find: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const Neighborhood = require("../models/Neighborhood");
const User = require("../models/User");
const Ingredient = require("../models/Ingredient");
const jwt = require("jsonwebtoken");
const { createTestApp } = require("./helpers/createTestApp");

describe("neighborhood endpoints", () => {
  const app = createTestApp(["neighborhood"]);
  const authHeader = { Authorization: "Bearer valid-token" };

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";

    jest.clearAllMocks();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { _id: "user-123" });
    });
  });

  test("POST /api/joinHood validates ZIP code format", async () => {
    const response = await request(app)
      .post("/api/joinHood")
      .set(authHeader)
      .send({ zipCode: "12" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid ZIP code format");
  });

  test("POST /api/joinHood returns new when the ZIP code does not exist", async () => {
    Neighborhood.exists.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/joinHood")
      .set(authHeader)
      .send({ zipCode: "32801" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "new",
      message: "new ZIP code",
    });
  });

  test("POST /api/joinHood adds the user to an existing neighborhood", async () => {
    Neighborhood.exists.mockResolvedValue("hood-1");

    const response = await request(app)
      .post("/api/joinHood")
      .set(authHeader)
      .send({ zipCode: "32801" });

    expect(response.status).toBe(200);
    expect(Neighborhood.findByIdAndUpdate).toHaveBeenCalledWith("hood-1", {
      $addToSet: { members: "user-123" },
    });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith("user-123", {
      $addToSet: { neighborhoods: "hood-1" },
    });
    expect(response.body.status).toBe("joined");
  });

  test("POST /api/createHood rejects invalid neighborhood names", async () => {
    const response = await request(app)
      .post("/api/createHood")
      .set(authHeader)
      .send({
        name: "1",
        zipCode: "32801",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  test("POST /api/createHood creates a neighborhood", async () => {
    Neighborhood.create.mockResolvedValue({
      _id: "hood-1",
      name: "Downtown",
      zipCode: "32801",
      members: ["user-123"],
      createdBy: "user-123",
    });

    const response = await request(app)
      .post("/api/createHood")
      .set(authHeader)
      .send({
        name: "Downtown",
        zipCode: "32801",
      });

    expect(response.status).toBe(200);
    expect(Neighborhood.create).toHaveBeenCalledWith({
      name: "Downtown",
      zipCode: "32801",
      members: ["user-123"],
      createdBy: "user-123",
    });
    expect(response.body.name).toBe("Downtown");
  });

  test("GET /api/getAllHoodIngredients requires a neighborhood id", async () => {
    const response = await request(app)
      .get("/api/getAllHoodIngredients")
      .set(authHeader)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Need a neighborhood id");
  });

  test("GET /api/getAllHoodIngredients returns neighborhood ingredients", async () => {
    Ingredient.find.mockResolvedValue([
      { _id: "ingredient-1", name: "Milk" },
    ]);

    const response = await request(app)
      .get("/api/getAllHoodIngredients")
      .set(authHeader)
      .send({ _id: "hood-1" });

    expect(response.status).toBe(200);
    expect(Ingredient.find).toHaveBeenCalledWith({ neighborhood: "hood-1" });
    expect(response.body.ingredients).toHaveLength(1);
  });

  test("GET /api/getAllUserHoods returns the user's neighborhoods", async () => {
    Neighborhood.find.mockResolvedValue([
      { _id: "hood-1", name: "Downtown" },
      { _id: "hood-2", name: "Lakeview" },
    ]);

    const response = await request(app)
      .get("/api/getAllUserHoods")
      .set(authHeader);

    expect(response.status).toBe(200);
    expect(Neighborhood.find).toHaveBeenCalledWith({ members: "user-123" });
    expect(response.body.neighborhoods).toHaveLength(2);
  });

  test("DELETE /api/deleteUserHood removes the user from the neighborhood", async () => {
    Neighborhood.updateOne.mockResolvedValue({ acknowledged: true });
    User.updateOne.mockResolvedValue({ acknowledged: true });

    const response = await request(app)
      .delete("/api/deleteUserHood")
      .set(authHeader)
      .send({ _id: "hood-1" });

    expect(response.status).toBe(200);
    expect(Neighborhood.updateOne).toHaveBeenCalledWith(
      { _id: "hood-1" },
      { $pull: { members: "user-123" } },
    );
    expect(User.updateOne).toHaveBeenCalledWith(
      { _id: "user-123" },
      { $pull: { neighborhoods: "hood-1" } },
    );
    expect(response.body.message).toBe("Successfully deleted Neighborhood");
  });
});
