const RecipesService = {
  getAllRecipes(knex) {
    return knex.select("*").from("saved_recipes");
  },
  getAllRecipesByUser(knex, userId) {
    return knex.select("*").from("saved_recipes").where({ userId });
  },
  insertRecipe(knex, newRecipe) {
    return knex
      .insert(newRecipe)
      .into("saved_recipes")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  //   getById(knex, id) {
  //     return knex.from("saved_recipes").select("*").where("id", id).first();
  //   },
  //     ^  necessary?
  deleteRecipe(knex, id) {
    return knex("saved_recipes").where({ id }).delete();
  },
};

module.exports = RecipesService;
