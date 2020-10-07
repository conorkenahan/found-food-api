const express = require("express");
const RecipesService = require("./recipes-service");

const recipesRouter = express.Router();

recipesRouter
  .route("/")
  .get((req, res, next) => {
    RecipesService.getAllRecipes(req.app.get("db"))
      .then((recipes) => {
        res.json(recipes);
        console.log(recipes);
      })
      .catch(next);
  })
  .post();

recipesRouter.route("/:id").get().delete();

recipesRouter.route("/user/:id").get();

module.exports = recipesRouter;
