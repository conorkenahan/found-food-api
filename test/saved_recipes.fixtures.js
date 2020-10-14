function makeRecipesArray(users) {
  return [
    {
      id: 1,
      recipeid: "12345",
      title: "First test post!",
      image: "https://spoonacular.com/recipeImages/13934-312x231.jpg",
      url: "",
      userid: 1,
    },
    {
      id: 2,
      recipeid: "23456",
      title: "Second test post!",
      image: "https://spoonacular.com/recipeImages/575558-312x231.jpg",
      url: "",
      userid: 1,
    },
    {
      id: 3,
      recipeid: "34567",
      title: "Third test post!",
      image: "https://spoonacular.com/recipeImages/161134-312x231.jpg",
      url: "",
      userid: 2,
    },
    {
      id: 4,
      recipeid: "45678",
      title: "Fourth test post!",
      image: "https://spoonacular.com/recipeImages/1008320-312x231.jpg",
      url: "",
      userid: 3,
    },
  ];
}

module.exports = {
  makeRecipesArray,
};
