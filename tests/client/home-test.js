const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

const { Home } = require('../../src/client/home');
const { stubFetch, flushPromises, overrideFetch } = require('../mytest-utils');
const { asyncCheckCondition } = require('../mytest-utils');

const rep = require('../../src/server/recipeRepository');
const { app } = require('../../src/server/app');

test('Test failed fetch', async () => {
  /*
        in this case, we stub the fetch, by explicitly stating what to return when the component runs.
        the backend is not run in this test.
     */

  stubFetch(500, {}, null);

  const driver = mount(
    <MemoryRouter initialEntries={['/home']}>
      <Home />
    </MemoryRouter>
  );

  await flushPromises();

  const html = driver.html();

  //here we just check it appears somewhere in the updated HTML
  expect(html).toMatch('Issue');
});

test('Test display 1 recipe using stub', async () => {
  const meal = 'Super Miushroom';

  stubFetch(
    200,
    [{ id: 0, chef: 'Princess Peach', meal: meal, day: 'Sunday' }],
    (url) => url.endsWith('/api/recipes')
  );

  const driver = mount(
    <MemoryRouter initialEntries={['/home']}>
      <Home />
    </MemoryRouter>
  );

  await flushPromises();

  const html = driver.html();

  //here we just check it appears somewhere in the updated HTML
  expect(html).toMatch(meal);
});

test('Test display recipes using SuperTest', async () => {
  /*
        when testing the component here, we actually run the backend as well.
        but "fetch" does not exist in NodeJS when running this test.
        so, we override it by making actual HTTP calls toward the backend.
        To do that, we use the same library to test the HTTP endpoints directly,
        ie, SuperTest.
        Advantages:
        - no need to mock responses, as using real backend
        - testing "more", as here we can find bugs as well in the backend
        Disadvantages:
        - need to run backend as well, which makes tests slower
        - running backends is not always as easy as here, as they might require
          to configure external services like databases
     */

  rep.initWithSomeRecipes();
  overrideFetch(app);

  const driver = mount(
    <MemoryRouter initialEntries={['/home']}>
      <Home />
    </MemoryRouter>
  );

  /*
        unfortunately, flushPromises does not work here, as it has limitations.
        so we need something more sophisticated and robust, like asyncCheckCondition.
        The idea is to define a predicate, and check it at certain regular intervals,
        up to a max amount of time (eg, few seconds).
        When we do an action, we then expect to see the results (by checking
        a predicate) sometime in the future, but not too long.
     */
  //await flushPromises();

  //let's check if table is displayed within a certain amount of time
  const predicate = () => {
    //needed if changed HTML since component was mounted
    driver.update();
    const tableSearch = driver.find('.allBooks');
    const tableIsDisplayed = tableSearch.length >= 1;
    return tableIsDisplayed;
  };

  const displayedTable = await asyncCheckCondition(predicate, 3000, 200);
  expect(displayedTable).toBe(true);

  const recipes = rep.getAllRecipes();
  const html = driver.html();

  for (let i = 0; i < recipes.length; i++) {
    expect(html).toMatch(recipes[i].meal);
  }
});

/* Chat test */
