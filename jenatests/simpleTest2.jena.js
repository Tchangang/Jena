const TestManager = require('../dist');

(async () => {
  let testManager = new TestManager();
  await testManager.startTestSuite('Checking browser details', async () => {
    const describe = testManager.describe.bind(testManager);
    const expect = testManager.expect.bind(testManager);
    await describe('Should make a simple assertion 3', () => {
      expect('1 should be 1', 1).toBe(1);
    });
  });
})();
