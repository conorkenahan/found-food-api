const knex = require("knex");
const app = require("./app");
const { API_URL } = require("./config");

const PORT = process.env.PORT || 3000;

const api = knex({
  client: "pg",
  connection: API_URL,
});

app.set("api", api);

app.get("/api/*", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };
