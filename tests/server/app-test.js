const request = require('supertest');
const app = require('../../src/server/app');
const repository = require('../../src/server/recipeRepository');

beforeEach(() => {
  repository.initWithSomeRecipes();
});

test('Test get all recipes', async () => {
  const response = await request(app).get('/api/recipes');

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(5);
});

test('Test not found recipe', async () => {
  const response = await request(app).get('/api/recipes/-3');
  expect(response.statusCode).toBe(404);
});

test('Test retrieve each single recipe', async () => {
  const responseAll = await request(app).get('/api/recipes');
  expect(responseAll.statusCode).toBe(200);

  const recipes = responseAll.body;
  expect(recipes.length).toBe(5);

  for (let i = 0; i < recipes.length; i++) {
    const res = await request(app).get('/api/recipes/' + recipes[i].id);
    const recipe = res.body;

    expect(recipe.meal).toBe(recipes[i].meal);
  }
});

test('Test create recipe', async () => {
  let responseAll = await request(app).get('/api/recipes');
  const n = responseAll.body.length;

  const meal = 'Bar';

  const resPost = await request(app)
    .post('/api/recipes')
    .send({ meal: meal, chef: 'Foo', day: 'Saturday' })
    .set('Content-Type', 'application/json');

  expect(resPost.statusCode).toBe(201);
  const location = resPost.header.location;

  //should had been increased by 1
  responseAll = await request(app).get('/api/recipes');
  expect(responseAll.body.length).toBe(n + 1);

  const resGet = await request(app).get(location);
  expect(resGet.statusCode).toBe(200);
  expect(resGet.body.meal).toBe(meal);
});

test('Delete all recipes', async () => {
  let responseAll = await request(app).get('/api/recipes');
  expect(responseAll.statusCode).toBe(200);

  const recipes = responseAll.body;
  expect(recipes.length).toBe(5);

  for (let i = 0; i < recipes.length; i++) {
    const res = await request(app).delete('/api/recipes/' + recipes[i].id);
    expect(res.statusCode).toBe(204);
  }

  responseAll = await request(app).get('/api/recipes');
  expect(responseAll.statusCode).toBe(200);
  expect(responseAll.body.length).toBe(0);
});

test('Update recipe', async () => {
  const meal = 'foo';

  const resPost = await request(app)
    .post('/api/recipes')
    .send({ meal: meal, chef: 'bar', day: 'Saturday' })
    .set('Content-Type', 'application/json');
  expect(resPost.statusCode).toBe(201);
  const location = resPost.header.location;

  let resGet = await request(app).get(location);
  expect(resGet.statusCode).toBe(200);
  expect(resGet.body.meal).toBe(meal);

  const modified = 'bar';
  const id = location.substring(location.lastIndexOf('/') + 1, location.length);

  const resPut = await request(app)
    .put(location)
    .send({ id: id, meal: modified, chef: 'bar', day: 'Saturday' })
    .set('Content-Type', 'application/json');
  expect(resPut.statusCode).toBe(204);

  resGet = await request(app).get(location);
  expect(resGet.statusCode).toBe(200);
  expect(resGet.body.meal).toBe(modified);
});
