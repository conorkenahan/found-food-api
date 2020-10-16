const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
// const { makeRecipesArray } = require("./saved_recipes.fixtures");
// const { makeUsersArray } = require("./users.fixtures");
const helpers = require("./test-helpers");

describe("Auth Endpoints", function () {
  let db;
  let authToken;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`POST /api/auth/login`, () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    const requiredFields = ["username", "password"];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      };
    });

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        username: testUser.username,
        password: testUser.password,
      };
      return supertest(app)
        .post("/api/auth/login")
        .send(userValidCreds)
        .expect(200)
        .then((res) => {
          authToken = res.body.authToken;
        });
    });

    it(`responds 200 and JWT auth token when refreshing authToken`, () => {
      return supertest(app)
        .post("/api/auth/refresh")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .then((res) => {
          authToken = res.body.authToken;
        });
    });
  });
});
