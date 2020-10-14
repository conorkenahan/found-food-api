const knex = require("knex");
const app = require("../src/app");
const { makeRecipesArray } = require("./saved_recipes.fixtures");
const { makeUsersArray } = require("./users.fixtures");

describe("Recipes Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE saved_recipes, users RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE saved_recipes, users RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/recipes/:username`, () => {
    context("Given there are recipes in the database", () => {
      const testUsers = makeUsersArray();
      const testRecipes = makeRecipesArray();
      beforeEach("insert recipes", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("saved_recipes").insert(testRecipes);
          });
      });
      it(`responds with 200 and user's recipe list`, () => {
        const username = "user1";
        return supertest(app)
          .get(`/api/recipes/${username}`)
          .expect(200, [
            {
              id: 1,
              recipeid: 12345,
              title: "First test post!",
              image: "https://spoonacular.com/recipeImages/13934-312x231.jpg",
              url: "",
              userid: 1,
            },
            {
              id: 2,
              recipeid: 23456,
              title: "Second test post!",
              image: "https://spoonacular.com/recipeImages/575558-312x231.jpg",
              url: "",
              userid: 1,
            },
          ]);
      });
    });
  });

  describe(`POST /api/recipes/`, () => {
    context(`Given there are users in the database`, () => {
      const testUsers = makeUsersArray();
      beforeEach("insert recipes", () => {
        return db.into("users").insert(testUsers);
      });
      it(`responds with 200 and added recipe`, () => {
        const newRecipe = {
          image: "https://spoonacular.com/recipeImages/13934-312x231.jpg",
          recipeid: 420,
          title: "Test recipe!",
          url: "recipe.com",
          username: "user1",
        };
        return supertest(app)
          .post(`/api/recipes/`)
          .send(newRecipe)
          .expect(200, {
            id: 1,
            image: "https://spoonacular.com/recipeImages/13934-312x231.jpg",
            recipeid: 420,
            title: "Test recipe!",
            url: "recipe.com",
            userid: 1,
          });
      });
    });
  });

  describe(`DELETE /api/recipes/`, () => {
    const recipeToDelete = {
      recipeid: 12345,
      username: "user1",
    };
    context("Given there are recipes in the database", () => {
      const testUsers = makeUsersArray();
      const testRecipes = makeRecipesArray();
      beforeEach("insert recipes", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("saved_recipes").insert(testRecipes);
          });
      });
      it("responds with 204 and removes the recipe", () => {
        return supertest(app)
          .delete(`/api/recipes/`)
          .send(recipeToDelete)
          .expect(204);
      });
    });
  });
});
