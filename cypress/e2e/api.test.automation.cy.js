import { faker } from '@faker-js/faker';

let user;

describe('API Test Automation', () => {
  it('TC1: Verify GET Users request', () => {
    cy.request({
      url: 'https://jsonplaceholder.typicode.com/users',
      method: 'GET'
    }).then((results) => {
      assert.equal(results.status, 200, 'Assert Status Code');
      assert.equal(results.statusText, 'OK', 'Assert Status Text');
      assert.equal(results.body.length, 10, 'Assert Users');

      user = results.body.filter((user) => user.id == 8).pop(); // get user id
    });
  });

  it('TC2: Verify GET User request by Id', () => {
    cy.request({
      url: `https://jsonplaceholder.typicode.com/users/${user.id}`,
      method: 'GET'
    }).then((results) => {
      assert.equal(results.status, 200, 'Assert Status Code');
      assert.equal(results.statusText, 'OK', 'Assert Status Text');
      assert.equal(results.body.name, user.name, 'Assert User Id');
    });
  });

  it('TC3: Verify POST Users request', () => {
    delete user.id;

    user = {
      ...user,
      ...{
        name: faker.name.fullName(),
        phone: faker.phone.number('614########'),
        username: faker.internet.userName(),
        website: faker.internet.url(),
        email: faker.internet.email()
      }
    };

    cy.request({
      url: `https://jsonplaceholder.typicode.com/users`,
      method: 'POST',
      body: user
    }).then((results) => {
      let _result = results.body;
      delete _result.id;

      assert.equal(results.status, 201, 'Assert Status Code');
      assert.deepEqual(_result, user, 'Assert Payload');
    });
  });
});
