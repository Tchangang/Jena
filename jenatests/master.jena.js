const JenaTest = require("../dist");

(async () => {
  const jenaHandler = JenaTest.getHandler('My handler', 'node');
  // simple test
  await jenaHandler.startTestSuite(['./jenatests/simpleTest2.jena.js'], true);
  await jenaHandler.end();
})();
