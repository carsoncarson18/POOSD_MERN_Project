const { z } = require('zod');


// Unit options for quantity
const validUnits = z
  .enum([
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
  ])
  .optional();

// Category options
const categorySchema = z.enum([
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
]);

// Create ingredient reqs
const createIngredientSchema = z.object({
  // Required fields
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  // Ensure expiry date is in the future
  expiresAt: z
      .date()
      .refine(
        (date) => {
          if (date === undefined) return true; // optional field
          return date > new Date();
        },
        { message: "Expiration date must be in the future" },
      ),

  neighborhood: z.string(), // just make sure its there, json passes it as a string

  // Ensure positive quantity and valid units
  quantity: z.object({
    value: z.number().positive("Quantity must be positive"),
    unit: validUnits.describe(
      "Please enter a valid unit of measurement, or ' '",
    ),
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
  .partial()


// Export all schemas
module.exports =  {
  createIngredientSchema,
  createIngredientClientSchema,
  updateIngredientSchema,
  validUnits,
  categorySchema,
};
