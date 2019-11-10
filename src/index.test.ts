import JenaTest from './index';

test('Should be function', () => {
    expect(typeof JenaTest).toBe('function');
});

test('Test JenaTester', () => {
   const jenaTest = new JenaTest();
    jenaTest.startTestSuite('First test suite', async () => {
       expect(jenaTest.testSuiteTitle).toBe('First test suite');
       await jenaTest.describe('New function', async () => {
           expect(jenaTest.steps.length).toBe(1);
           expect(jenaTest.steps[0].step).toBe('New function');
           expect(jenaTest.steps[0].tests.length).toBe(0);
           jenaTest.expect('1 should be 1', 1, 'id1').toBe(1);
           expect(jenaTest.steps[0].tests.length).toBe(1);
           expect(jenaTest.steps[0].tests[0].id).toBe('id1');
           expect(jenaTest.steps[0].tests[0].success).toBe(true);
           try {
               jenaTest.expect('1 should " be 2', 1, 'id2').toBe(2);
               expect(1).toBe(2);
           } catch (e) {
               expect(e.message.includes('Test failed: 1 should be 2'));
               expect(jenaTest.steps[0].tests.length).toBe(2);
               expect(jenaTest.steps[0].tests[1].success).toBe(false);
           }
           const xml = jenaTest.steps[0].getXml();
           const expectedXml = `<testsuite id="firstStep" name="New function" tests="2" failures="1" time="0">
                <testcase id="id1" name="1 should be 1" time="0">
               </testcase>
               <testcase id="id2" name="1 should &quot; be 2" time="0">
               <failure>
                   Test failed: 1 should be 2
               expected: 2
               received: 1
               </failure>
               </testcase>
               </testsuite>
           `;
           // expect(xml.replace(/\s/g, '')).toBe(expectedXml.replace(/\s/g, ''));
           expect(xml.includes('&quot;')).toBe(true);
           await new Promise((resolve) => {
              setTimeout(() => {
                  resolve();
              }, 2500);
           });
       }, 'firstStep');
        await jenaTest.describe('Second function in 2', () => {
            expect(jenaTest.steps.length).toBe(2);
            expect(jenaTest.steps[0].time > 2500).toBe(true);
        });
    });
});
