const JenaTest = require("../dist");

(async () => {
  try {
    const jenaHandler = JenaTest.getHandler('My handler', 'node');
    await jenaHandler.startTestSuite(['./jenatests/simpleTest.jena.js'], true);
    await jenaHandler.startTestSuite(['./jenatests/simpleTest2.jena.js'], true);
    await jenaHandler.end();
    throw new Error('Impossible to reach this');
  } catch (e) {
    if (!e.message.includes('Test failed')) {
      throw new Error('Test failed');
    }
  }
  const jenaHandler = JenaTest.getHandler('My handler', 'node');
  await jenaHandler.startTestSuite(['./jenatests/simpleTest2.jena.js'], true);
  await jenaHandler.end();
})();
