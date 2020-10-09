const express = require("express");
const RecipesService = require("./recipes-service");

const recipesRouter = express.Router();
const jsonBodyParser = express.json();

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

recipesRouter.route("/:userid").get().delete();

recipesRouter.route("/user/:userid").get(jsonBodyParser, (req, res, next) => {
  RecipesService.getAllRecipesByUser(req.app.get("db"), req.params.userid)
    .then((recipes) => {
      res.json(recipes);
      console.log(recipes);
    })
    .catch(next);
});

recipesRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const { recipeid, title, image, url, userid } = req.body;
  const newRecipe = { recipeid, title, image, url, userid };

  for (const [key, value] of Object.entries(newRecipe))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  RecipesService.insertRecipe(req.app.get("db"), newRecipe).then((recipe) => {
    res.json(recipe);
    // res
    //   .status(201)
    //   .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
    //   .json(RecipesService.serializeRecipe(recipe));
  });
});

module.exports = recipesRouter;
