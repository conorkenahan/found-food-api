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

function makeCommentsArray(users, articles) {
  return [
    {
      id: 1,
      text: "First test comment!",
      article_id: articles[0].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      text: "Second test comment!",
      article_id: articles[0].id,
      user_id: users[1].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      text: "Third test comment!",
      article_id: articles[0].id,
      user_id: users[2].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      text: "Fourth test comment!",
      article_id: articles[0].id,
      user_id: users[3].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 5,
      text: "Fifth test comment!",
      article_id: articles[articles.length - 1].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 6,
      text: "Sixth test comment!",
      article_id: articles[articles.length - 1].id,
      user_id: users[2].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 7,
      text: "Seventh test comment!",
      article_id: articles[3].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeExpectedArticle(users, article, comments = []) {
  const author = users.find((user) => user.id === article.author_id);

  const number_of_comments = comments.filter(
    (comment) => comment.article_id === article.id
  ).length;

  return {
    id: article.id,
    style: article.style,
    title: article.title,
    content: article.content,
    date_created: article.date_created.toISOString(),
    number_of_comments,
    author: {
      id: author.id,
      username: author.username,
      name: author.name,
      email: author.email,
      date_created: author.date_created.toISOString(),
      date_modified: author.date_modified || null,
    },
  };
}

function makeExpectedArticleComments(users, articleId, comments) {
  const expectedComments = comments.filter(
    (comment) => comment.article_id === articleId
  );

  return expectedComments.map((comment) => {
    const commentUser = users.find((user) => user.id === comment.user_id);
    return {
      id: comment.id,
      text: comment.text,
      date_created: comment.date_created.toISOString(),
      user: {
        id: commentUser.id,
        username: commentUser.username,
        name: commentUser.name,
        email: commentUser.email,
        date_created: commentUser.date_created.toISOString(),
        date_modified: commentUser.date_modified || null,
      },
    };
  });
}

function makeMaliciousArticle(user) {
  const maliciousArticle = {
    id: 911,
    style: "How-to",
    date_created: new Date(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  };
  const expectedArticle = {
    ...makeExpectedArticle([user], maliciousArticle),
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousArticle,
    expectedArticle,
  };
}

function makeArticlesFixtures() {
  const testUsers = makeUsersArray();
  const testArticles = makeRecipesArray(testUsers);
  const testComments = makeCommentsArray(testUsers, testArticles);
  return { testUsers, testArticles, testComments };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        blogful_articles,
        blogful_users,
        blogful_comments
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(
            `ALTER SEQUENCE blogful_articles_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE blogful_users_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE blogful_comments_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`SELECT setval('blogful_articles_id_seq', 0)`),
          trx.raw(`SELECT setval('blogful_users_id_seq', 0)`),
          trx.raw(`SELECT setval('blogful_comments_id_seq', 0)`),
        ])
      )
  );
}

function seedArticlesTables(db, users, articles, comments = []) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await trx.into("blogful_users").insert(users);
    await trx.into("blogful_articles").insert(articles);
    // update the auto sequence to match the forced id values
    await Promise.all([
      trx.raw(`SELECT setval('blogful_users_id_seq', ?)`, [
        users[users.length - 1].id,
      ]),
      trx.raw(`SELECT setval('blogful_articles_id_seq', ?)`, [
        articles[articles.length - 1].id,
      ]),
    ]);
    // only insert comments if there are some, also update the sequence counter
    if (comments.length) {
      await trx.into("blogful_comments").insert(comments);
      await trx.raw(`SELECT setval('blogful_comments_id_seq', ?)`, [
        comments[comments.length - 1].id,
      ]);
    }
  });
}

function seedMaliciousArticle(db, user, article) {
  return db
    .into("blogful_users")
    .insert([user])
    .then(() => db.into("blogful_articles").insert([article]));
}

module.exports = {
  makeUsersArray,
  makeRecipesArray,
  makeExpectedArticle,
  makeExpectedArticleComments,
  makeMaliciousArticle,
  makeCommentsArray,

  makeArticlesFixtures,
  cleanTables,
  seedArticlesTables,
  seedMaliciousArticle,
};
