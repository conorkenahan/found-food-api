# Found Food (Server)

This is the backend code for Found Food, a recipe searching app that allows user to search recipes based off of food they already have in their kitchen.

- [Link to live app](https://found-food.vercel.app/)
- [Link to repo](https://github.com/conorkenahan/found-food)

## API Documentation

### Recipes Endpoints

### ▸ `GET /api/recipes/:username`

Returns an array of recipes of a specific user.

#### Sample Query

`/api/recipes/testuser`

#### Example Response

```
[
    {
        "id": 14,
        "recipeid": 620313,
        "title": "Cheddar Apple Bacon Grilled Cheese",
        "image": "https://spoonacular.com/recipeImages/620313-312x231.jpg",
        "url": "http://www.emilybites.com/2014/11/cheddar-apple-bacon-grilled-cheese.html",
        "userid": 4
    },
    {
        "id": 15,
        "recipeid": 599414,
        "title": "Cheddar, Bacon and Apple Grilled Cheese Sandwich",
        "image": "https://spoonacular.com/recipeImages/599414-312x231.jpg",
        "url": "http://leitesculinaria.com/87793/recipes-cheddar-bacon-grilled-cheese-sandwich.html",
        "userid": 4
    },
]
```

- `id - integer` - uuid of a recipe
- `recipeid - integer` - unique recipe ID
- `title - string` - title of recipe
- `image - string` - image URL of recipe
- `url - string` - web URL of recipe
- `userid - integer` - userid of saved recipe

### ▸ `POST /api/recipes`

In order to post, or save, a recipe, the request body must have a recipeid, title, image, url and username.

#### Example Request

```
{
    "recipeid": 12345,
    "title": "Cheddar Bacon Grilled Cheese Sandwich",
    "image": 'https://spoonacular.com/recipeImages/599414-312x231.jpg',
    "url": 'http://leitesculinaria.com/87793/recipes-cheddar-bacon-grilled-cheese-sandwich.html',
    "username": 'testuser',
}
```

### ▸ `DELETE /api/recipes/`

This endpoint allows a user to remove a saved recipe from their list. In order to do so, the request must contain a recipeid and a userid.

#### Example Request

```
{
    "recipeid": 12345,
    "userid": '2',
}
```

### Users Endpoints

### ▸ `POST /api/users`

In order to create a new user, a POST request is made to the above endpoint. The request must contain a username and password.

#### Example Request

```
{
    "username": "testuser",
    "password": Testing123!
}
```

### Auth Endpoints

### ▸ `POST /api/auth/login`

#### Example Request

```
// req.body
{
  username: String,
  password: String
}

// res.body
{
  authToken: String
}
```

### ▸ `POST /api/auth/refresh`

#### Example Request

```
// req.header
Authorization: Bearer ${token}

// res.body
{
  authToken: ${token}
}
```

## Technology Stack

### Backend

- Express for handling API requests
- Node for interacting with the file system
- Knex.js for interfacing with the PostgreSQL database
- Postgrator for database migration
- Mocha, Chai, Supertest for endpoints testing
- JSON Web Token, bcryptjs for user authentication / authorization
