const app = require('../../src/app');

describe('\'checkdbs\' service', () => {
  it('registered the service', () => {
    const service = app.service('checkdbs');
    expect(service).toBeTruthy();
  });
});
