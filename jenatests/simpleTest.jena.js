const TestManager = require('../dist');

(async () => {
  let testManager = new TestManager();
  await testManager.startTestSuite('Checking browser details', async () => {
    const describe = testManager.describe.bind(testManager);
    const expect = testManager.expect.bind(testManager);
    await describe('Should make a simple assertion', () => {
      expect('1 should be 1', 1).toBe(1);
    });
    await describe('Should throw an error', () => {
      expect('1 should be equal 2', 1).toBe(2);
    });
    await describle('Should make a simple assertion', () => {
      expect('This assertion should never be evaluted', 1).toBe(5);
    });
  });
})();
