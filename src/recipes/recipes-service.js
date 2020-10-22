const RecipesService = {
  getAllRecipes(knex) {
    return knex.select("*").from("saved_recipes");
  },
  getAllRecipesByUser(knex, userid) {
    return knex.select("*").from("saved_recipes").where({ userid });
  },
  getUserId(knex, username) {
    return knex.from("users").select("users.id").where({ username }).first();
  },
  insertRecipe(knex, newRecipe) {
    return knex
      .insert(newRecipe)
      .into("saved_recipes")
      .where(
        newRecipe.recipeid !== "saved_recipes.recipeid" &&
          newRecipe.userid !== "saved_recipes.userid"
      )
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  deleteRecipe(knex, recipeToDelete) {
    return knex("saved_recipes")
      .where("id", recipeToDelete.recipeid)
      .andWhere("userid", recipeToDelete.userid)
      .delete();
  },

  serializeRecipe(recipe) {
    const { user } = recipe;
    return {
      recipeId: recipe.recipeId,
      title: xss(recipe.title),
      image: recipe.image,
      url: recipe.url,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    };
  },
};

module.exports = RecipesService;
