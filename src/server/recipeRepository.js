const recipes = new Map();

let counter = 0;

function initWithSomeRecipes() {
  recipes.clear();
  counter = 0;

  createNewRecipe('Pizza med Ananas', 'Joakim Tangen', 'Monday');
  createNewRecipe('Grønnsaksuppe', 'Jon Erik Stølen', 'Tirsdag');
  createNewRecipe('Python Spinat', 'Andreas Opdahl', 'Onsdag');
  createNewRecipe('Paella', 'Kristoffer Rotnebo', 'Torsdag');
  createNewRecipe('Taco', 'Brage Wilhelmsen', 'Fredag');
}

function createNewRecipe(meal, chef, day) {
  const id = '' + counter;
  counter++;

  const recipe = {
    id: id,
    meal: meal,
    chef: chef,
    day: day,
  };

  recipes.set(id, recipe);

  return id;
}

function deleteRecipe(id) {
  return recipes.delete(id);
}

function getRecipe(id) {
  return recipes.get(id);
}

function getAllRecipes() {
  return Array.from(recipes.values());
}

function updateRecipe(recipe) {
  if (!recipes.has(recipe.id)) {
    return false;
  }

  recipes.set(recipe.id, recipe);
  return true;
}

function getAllRecipesSince(day) {
  return recipes.values().filter((r) => r.day >= day);
}

module.exports = {
  initWithSomeRecipes,
  getAllRecipes,
  getAllRecipesSince,
  createNewRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
};
