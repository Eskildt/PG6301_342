const request = require('supertest');
const { app, clearMessages } = require('../../src/server/app');
const repository = require('../../src/server/recipeRepository');
const WS = require('ws');

const { asyncCheckCondition } = require('../mytest-utils');
const { checkConnectedWS } = require('../mytest-utils-ws');

let server;
let port;

beforeAll((done) => {
  server = app.listen(0, () => {
    port = server.address().port;
    done();
  });
});

afterAll((done) => {
  server && server.close(done);
});

beforeEach(() => {
  repository.initWithSomeRecipes();
  clearMessages;
});

beforeEach(clearMessages);

/*Websocket Tests */

test('Test get none', async () => {
  const response = await request(app).get('/api/messages');

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(0);
});

test('Test create and get one', async () => {
  const resPost = await request(app)
    .post('/api/messages')
    .send({ text: 'some text', author: 'bar' })
    .set('Content-Type', 'application/json');
  expect(resPost.statusCode).toBe(201);

  const resGet = await request(app).get('/api/messages');
  expect(resGet.statusCode).toBe(200);
  expect(resGet.body.length).toBe(1);
});

test('Test notify 1 user with WS', async () => {
  //no msg
  const resGet = await request(app).get('/api/messages');
  expect(resGet.statusCode).toBe(200);
  expect(resGet.body.length).toBe(0);

  const ws = new WS('ws://localhost:' + port);
  const connected = await checkConnectedWS(ws, 2000);
  expect(connected).toBe(true);

  const received = [];
  ws.on('message', (data) => {
    received.push(data);
  });

  const resPost = await request(app)
    .post('/api/messages')
    .send({ text: 'some text', author: 'bar' })
    .set('Content-Type', 'application/json');
  expect(resPost.statusCode).toBe(201);

  const ok = await asyncCheckCondition(() => received.length > 0, 2000, 100);
  expect(ok).toBe(true);

  ws.close();
});

test('Test notify 2 users with WS', async () => {
  //initially no message
  let resGet = await request(app).get('/api/messages');
  expect(resGet.statusCode).toBe(200);
  expect(resGet.body.length).toBe(0);

  //register 2 different clients using WS
  const first = new WS('ws://localhost:' + port);
  let connected = await checkConnectedWS(first, 2000);
  expect(connected).toBe(true);

  const second = new WS('ws://localhost:' + port);
  connected = await checkConnectedWS(second, 2000);
  expect(connected).toBe(true);

  //both clients will add to the same array buffer
  const received = [];
  first.on('message', (data) => {
    received.push(data);
  });
  second.on('message', (data) => {
    received.push(data);
  });

  //create 1 single message
  const resPost = await request(app)
    .post('/api/messages')
    .send({ text: 'some text', author: 'bar' })
    .set('Content-Type', 'application/json');
  expect(resPost.statusCode).toBe(201);

  //that single message must be broadcasted to both WS clients
  const ok = await asyncCheckCondition(() => received.length === 2, 2000, 100);
  expect(ok).toBe(true);

  //however, only 1 single message is on the server
  resGet = await request(app).get('/api/messages');
  expect(resGet.statusCode).toBe(200);
  expect(resGet.body.length).toBe(1);

  first.close();
  second.close();
});

/*Recipe Tests*/

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
