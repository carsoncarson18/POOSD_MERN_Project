const request = require("supertest");

jest.mock("../models/User", () => ({
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
}));

jest.mock("../models/Ingredient", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
  find: jest.fn(),
  deleteOne: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("../config/cloudinary", () => ({
  cloudinary: {},
  upload: {
    single: jest.fn(() => (req, res, next) => next()),
  },
}));

const User = require("../models/User");
const Ingredient = require("../models/Ingredient");
const jwt = require("jsonwebtoken");
const { createTestApp } = require("./helpers/createTestApp");

describe("ingredient endpoints", () => {
  const app = createTestApp(["ingredient"]);
  const authHeader = { Authorization: "Bearer valid-token" };
  const validIngredient = {
    name: "Apples",
    quantity: {
      value: 2,
      unit: "piece",
    },
    description: "Fresh apples",
    expiresAt: "2099-12-31T00:00:00.000Z",
    category: "fruits",
    neighborhood: "hood-1",
    imageUrl: null,
  };

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";

    jest.clearAllMocks();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { _id: "user-123" });
    });
  });

  test("POST /api/createIngredient requires authentication", async () => {
    const response = await request(app)
      .post("/api/createIngredient")
      .send(validIngredient);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token missing");
  });

  test("POST /api/createIngredient creates an ingredient for the authenticated user", async () => {
    Ingredient.create.mockResolvedValue({
      _id: "ingredient-1",
      ...validIngredient,
      postedBy: "user-123",
    });
    User.findByIdAndUpdate.mockResolvedValue({ _id: "user-123" });

    const response = await request(app)
      .post("/api/createIngredient")
      .set(authHeader)
      .send(validIngredient);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully created ingredient!");
    expect(Ingredient.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Apples",
        postedBy: "user-123",
      }),
    );
    expect(Ingredient.create.mock.calls[0][0].expiresAt).toBeInstanceOf(Date);
  });

  test("POST /api/editIngredient rejects requests without an ingredient id", async () => {
    const response = await request(app)
      .post("/api/editIngredient")
      .set(authHeader)
      .send({ description: "Updated description" });

    expect(response.status).toBe(400);
    expect(response.text).toContain("Need an ingredient id to update it");
  });

  test("POST /api/editIngredient updates owned ingredients", async () => {
    Ingredient.findOne.mockResolvedValue({
      _id: "ingredient-1",
      postedBy: "user-123",
    });
    Ingredient.updateOne.mockResolvedValue({
      acknowledged: true,
      modifiedCount: 1,
    });

    const response = await request(app)
      .post("/api/editIngredient")
      .set(authHeader)
      .send({
        _id: "ingredient-1",
        description: "Updated description",
      });

    expect(response.status).toBe(200);
    expect(Ingredient.findOne).toHaveBeenCalledWith({
      _id: "ingredient-1",
      postedBy: "user-123",
    });
    expect(response.body.message).toBe("Successfully edited ingredient!");
  });

  test("GET /api/getMyIngredients returns the authenticated user's ingredients", async () => {
    const select = jest.fn().mockResolvedValue({
      ingredients: ["ingredient-1", "ingredient-2"],
    });

    User.findById.mockReturnValue({ select });
    Ingredient.find.mockResolvedValue([
      { _id: "ingredient-1", name: "Apples" },
      { _id: "ingredient-2", name: "Rice" },
    ]);

    const response = await request(app)
      .get("/api/getMyIngredients")
      .set(authHeader);

    expect(response.status).toBe(200);
    expect(select).toHaveBeenCalledWith("ingredients");
    expect(response.body.count).toBe(2);
    expect(response.body.data).toHaveLength(2);
  });

  test("DELETE /api/deleteIngredient rejects invalid tokens", async () => {
    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(new Error("bad token"));
    });

    const response = await request(app)
      .delete("/api/deleteIngredient")
      .set(authHeader)
      .send({ _id: "ingredient-1" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  test("DELETE /api/deleteIngredient deletes an owned ingredient", async () => {
    const foundIngredient = {
      _id: "ingredient-1",
      postedBy: "user-123",
    };

    Ingredient.findOne.mockResolvedValue(foundIngredient);
    Ingredient.deleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

    const response = await request(app)
      .delete("/api/deleteIngredient")
      .set(authHeader)
      .send({ _id: "ingredient-1" });

    expect(response.status).toBe(200);
    expect(Ingredient.deleteOne).toHaveBeenCalledWith({
      findIngredient: foundIngredient,
    });
    expect(response.body.message).toBe("Successfully deleted ingredient!");
  });
});
