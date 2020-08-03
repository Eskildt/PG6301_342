const request = require('supertest');
const { app, clearMessages } = require('../../src/server/app');
const repository = require('../../src/server/cardsRepository');
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
  repository.cardsOwned();
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

/*Card Tests*/

test('Test get all cards', async () => {
  const response = await request(app).get('/api/cards');

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(1);
});

test('Test not found card', async () => {
  const response = await request(app).get('/api/cards/-3');
  expect(response.statusCode).toBe(404);
});

test('Test retrieve each single card', async () => {
  const responseAll = await request(app).get('/api/cards');
  expect(responseAll.statusCode).toBe(200);

  const cards = responseAll.body;
  expect(cards.length).toBe(1);

  for (let i = 0; i < cards.length; i++) {
    const res = await request(app).get('/api/cards/' + cards[i].id);
    const card = res.body;

    expect(card.cardsname).toBe(cards[i].cardsname);
  }
});

test('Delete all cards', async () => {
  let responseAll = await request(app).get('/api/cards');
  expect(responseAll.statusCode).toBe(200);

  const cards = responseAll.body;
  expect(cards.length).toBe(1);

  for (let i = 0; i < cards.length; i++) {
    const res = await request(app).delete('/api/cards/' + cards[i].id);
    expect(res.statusCode).toBe(204);
  }

  responseAll = await request(app).get('/api/cards');
  expect(responseAll.statusCode).toBe(200);
  expect(responseAll.body.length).toBe(0);
});
