const bcrypt = require("bcryptjs");

function makeUsersArray() {
  return [
    {
      id: 1,
      username: "test-user-1",
      name: "Test user 1",
      email: "test1@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      username: "test-user-2",
      name: "Test user 2",
      email: "test2@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      username: "test-user-3",
      name: "Test user 3",
      email: "test3@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      username: "test-user-4",
      name: "Test user 4",
      email: "test4@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeRecipesArray(users) {
  return [
    {
      id: 1,
      title: "First test post!",
      image: "https://spoonacular.com/recipeImages/13934-312x231.jpg",
      url: "",
      userId: users[0].id,
    },
    {
      id: 2,
      title: "Second test post!",
      image: "https://spoonacular.com/recipeImages/575558-312x231.jpg",
      url: "",
      userId: users[1].id,
    },
    {
      id: 3,
      title: "Third test post!",
      image: "https://spoonacular.com/recipeImages/161134-312x231.jpg",
      url: "",
      userId: users[2].id,
    },
    {
      id: 4,
      title: "Fourth test post!",
      image: "https://spoonacular.com/recipeImages/1008320-312x231.jpg",
      url: "",
      userId: users[3].id,
    },
  ];
}

function makeExpectedRecipe(users, recipe = []) {
  const user = users.find((user) => user.id === recipe.userid);

  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    url: recipe.url,
    date_created: recipe.date_created.toISOString(),
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      date_created: user.date_created.toISOString(),
      date_modified: user.date_modified || null,
    },
  };
}

function makeRecipesFixtures() {
  const testUsers = makeUsersArray();
  const testRecipes = makeRecipesArray(testUsers);
  return { testUsers, testRecipes };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        users,
        saved_recipes
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(
            `ALTER SEQUENCE saved_recipes_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('saved_recipes_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
        ])
      )
  );
}

function seedRecipesTable(db, users, recipes) {
  return db.transaction(async (trx) => {
    await trx.into("users").insert(users);
    await trx.into("saved_recipes").insert(recipes);
    await Promise.all([
      trx.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id]),
      trx.raw(`SELECT setval('saved_recipes_id_seq', ?)`, [
        recipes[recipes.length - 1].id,
      ]),
    ]);
  });
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

module.exports = {
  makeUsersArray,
  makeRecipesArray,
  makeExpectedRecipe,

  makeRecipesFixtures,
  cleanTables,
  seedRecipesTable,
  seedUsers,
};
