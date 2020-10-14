function makeUsersArray() {
  return [
    {
      id: 1,
      username: "user1",
      name: "user1",
      email: "test1@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      username: "user2",
      name: "user2",
      email: "test2@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      username: "user3",
      name: "user3",
      email: "test3@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      username: "user4",
      name: "user4",
      email: "test4@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

module.exports = {
  makeUsersArray,
};
