const { z } = require("zod");

// Unit options for quantity
const validUnitsOptions = [
  "g",
  "kg",
  "ml",
  "L",
  "cup",
  "tbsp",
  "tsp",
  "piece",
  "lb",
  "count",
  "oz",
  " ",
];
const validUnits = z
  .string()
  .refine((val) => val === undefined || validUnitsOptions.includes(val), {
    message: `Invalid unit: must be within [${validUnitsOptions.join(", ")}]`,
  });

// Category options
const validCategory = [
  "vegetables",
  "fruits",
  "dairy",
  "meat",
  "seafood",
  "grains",
  "herbs",
  "spices",
  "baked goods",
  "canned goods",
  "frozen",
  "sauces",
  "spreads",
  "snacks",
  "other",
];

const categorySchema = z.string().refine((val) => validCategory.includes(val), {
  message: `Invalid category: must be within [${validCategory.join(", ")}]`,
});

// Create ingredient reqs
const createIngredientSchema = z.object({
  // Required fields
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  // Ensure expiry date is in the future
  expiresAt: z.date().refine(
    (date) => {
      if (date === undefined) return true; // optional field
      return date > new Date();
    },
    { message: "Expiration date must be in the future" },
  ),

  neighborhood: z.string("Neighborhood ID must be passed"),

  // Ensure positive quantity and valid units
  quantity: z
    .object({
      value: z.coerce.number().positive("Quantity must be positive"),
      unit: validUnits,
    })
    .refine((val) => val !== undefined, {
      message:
        "Quantity is required. Please provide an object with 'value' and 'unit' fields",
    }),

  // Description has a 400 char limit
  description: z
    .string()
    .max(400, "Description must be less than 100 characters")
    .trim()
    .default(""),

  // Ingredient category should match one of the predefined ones
  category: categorySchema,

  // Optional: image url
  imageUrl: z
    .url("Must be a valid URL")
    .or(z.literal(null))
    .optional()
    .default(null),
});

// For creation (client passes through json)
const createIngredientClientSchema = createIngredientSchema.pick({
  name: true,
  quantity: true,
  description: true,
  expiresAt: true,
  category: true,
  neighborhood: true,
  imageUrl: true,
});

// Update ingredient; ensure expiry is in the future
const updateIngredientSchema = createIngredientSchema
  .omit({
    neighborhood: true,
  })
  .partial();

// Export all schemas
module.exports = {
  createIngredientSchema,
  createIngredientClientSchema,
  updateIngredientSchema,
  validUnits,
  categorySchema,
};
