const express = require("express");

const routeLoaders = {
  auth: () => require("../../routes/auth.routes"),
  ingredient: () => require("../../routes/ingredient.routes"),
  neighborhood: () => require("../../routes/neighborhood.routes"),
};

const createTestApp = (routeNames = Object.keys(routeLoaders)) => {
  const app = express();

  app.use(express.json());

  routeNames.forEach((routeName) => {
    app.use("/api", routeLoaders[routeName]());
  });

  return app;
};

module.exports = { createTestApp };
