const { z } = require("zod");

const hoodNameSchema = z.string()
            .min(3,"Neighborhood name must be at least 3 characters")
            .max(16,"Neighborhood name must be at most 16 characters")
            .regex(/^[a-zA-Z][a-zA-Z0-9_ -]*$/, "Name must start with a letter and only contain letters, numbers, underscores, hyphens, or spaces")


module.exports = { hoodNameSchema };
