const express = require("express");
const RecipesService = require("./recipes-service");

const recipesRouter = express.Router();
const jsonBodyParser = express.json();

recipesRouter.route("/:username").get((req, res, next) => {
  RecipesService.getUserId(req.app.get("db"), req.params.username).then(
    (id) => {
      userid = id.id;
      RecipesService.getAllRecipesByUser(req.app.get("db"), userid).then(
        (recipes) => {
          // res.json(recipes);
          res.status(201).json(recipes);
        }
      );
    }
  );
});

recipesRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const { recipeid, title, image, url, username } = req.body;
  let newRecipe = { recipeid, title, image, url };
  RecipesService.getUserId(req.app.get("db"), username).then((id) => {
    userid = id.id;
    newRecipe = { ...newRecipe, userid };
    RecipesService.insertRecipe(req.app.get("db"), newRecipe).then((recipe) => {
      res.json(recipe);
      res.status(200);
    });
  });
  for (const [key, value] of Object.entries(newRecipe))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
});

recipesRouter.route("/").delete(jsonBodyParser, (req, res, next) => {
  const { recipeid, username } = req.body;
  let recipeToDelete = { recipeid };
  RecipesService.getUserId(req.app.get("db"), username).then((id) => {
    userid = id.id;
    recipeToDelete = { ...recipeToDelete, userid };
    RecipesService.deleteRecipe(req.app.get("db"), recipeToDelete).then(() => {
      res.status(204).end();
    });
  });
  for (const [key, value] of Object.entries(recipeToDelete))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
});

module.exports = recipesRouter;
