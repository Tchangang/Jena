[![CircleCI](https://circleci.com/gh/Tchangang/Jena.svg?style=svg)](https://circleci.com/gh/Tchangang/Jena)

#Introduction
Jena helps to write tests that need a "runner" system such as electron, puppeteer, anything else where you can't use mocha or jest.

It was build at first for writing test for electron that need to interact with Electron.BrowserWindow, Electron.App, Electron.Screen, etc...
Because you need to start an electron process with <code>electron path_to_your_script</code>, you can not use classic tests tools as jest, mocha, because you are not in a node process

#How to use
## Get a test handler
With Jena, you need two file to launch your test.
1) The first is your file that should interact with a lib: Ex: the file that will be launched by electron.
2) The second is your master file that will drive the first file.

To get a handler, the syntax is: 
```javascript
    const electron = require('electron');
    const JenaTester = require('jena');
    const testHandler = JenaTester.getHandler('Testing new application', electron);
```

## Execute your test suite
To execute your test suite, you need to launch your file with <b>testHandler.startTestSuite</b>.
```javascript
    const electron = require('electron');
    const JenaTester = require('jena');
    const testHandler = JenaTester.getHandler('Testing new application', electron);
    (async () => {
        await testHandler.startTestSuite(['./tests/login_process.jena.js'], true);
        await testHandler.end();
    })(); 
```

### Example: write tests that interact with electron
```javascript
    main.jena.js

    const electron = require('electron');
    const JenaTester = require('jena');
    (async () => {
        const jenaHandler = JenaTester.getHandler('Testing new application', electron);
        await jenaHandler.startTestSuite(['./tests/login_process.jena.js'], true);
      
        await jenaHandler.end(); // <= remember to call done when complete to exit test
    })(); 
  
    --------------------------------------------------------

    ./tests/login_process.jena.js

    const electron = require('electron');
    const JenaTester = require('jena');
    
    (async () => {
        let jenaTester = new JenaTester();
        await jenaTester.startTestSuite('Checking if login page is ok', async () => {
            const describe = jenaTester.describe.bind(jenaTester);
            const expect = jenaTester.expect.bind(jenaTester);
            let mainWindow = null;
            // Be sure that electron is ready before begining
            await jenaTester.before(async () => {
                return new Promise((resolve) => {
                    const {app} = electron;
                    app.on('ready', async () => {
                        // here electron is ready
                        mainWindow = new electron.BrowserWindow();
                        mainWindow.loadUrl('https://myloginpage.com');
                        electron.app.on('window-all-closed', () => {
                            electron.app.quit();
                        });
                        resolve();
                    });
                });
            });
            // Now we are sure that electron is ready
            await describe('Can not login if email and password is not filled', async () => {
                // click login button
                await mainWindow.webContents.executeJavascript('document.querySelector("#login").click()');
                // Check for error in page
                const pageHasError = await mainWindow.webContents.executeJavascript('document.querySelector("#error").innerHTML');
                expect('Page should have an error', pageHasError).toBe('Please fill email and password');
            });
            
            ...run any other tests

        });
    })()
```

## Syntax
### starting test suite
```javascript function jenaHandler.startTestSuite(args: Array<string>, isSync: boolean)``` take two parameters: 
- args: script arguments (if you launch electron, args should be an array with script path)
- isSync: When isSync === true, your tests suite will run each after others. When isSync === false, all your tests will be run. It can be usefull when your tests are independant (remember time is money).

####Exemple of using isSync === false
```javascript
    const electron = require('electron');
    const JenaTester = require('jena');
    (async () => {
          const jenaHandler = JenaTester.getHandler('Testing new application', electron);
          // Test suite start
          await jenaHandler.startTestSuite(['./tests/login_process.jena.js'], false);
          await jenaHandler.startTestSuite(['./tests/reset_password.jena.js'], false);
          await jenaHandler.startTestSuite(['./tests/verify_password.jena.js'], false);
          // Test suite end
          await jenaHandler.end();
    })();
```
In the example above, all test './tests/login_process.jena.js', './tests/reset_password.jena.js', './tests/verify_password.jena.js' will be run in parallel.

### describe syntax
```javascript function JenaTester.describe(testSuiteDescription, callbackFunc)``` take two parameters:
- testSuiteDescription: Test suite description 😂
- callbackFunc: callback to execute tests with "expect".

### "expect" syntax
This function looks like jest.expect.
```javascript function JenaTester.expect(expectationDescription, valueToCompare).toBe(expectedValue)``` take 2 parameters:
- expectationDescription: 
- valueToCompare
This function send an object { toBe: (expectedValue) => true } with toBe function that compare valueToCompare with expectedValue.
if values are same, test suite will continue until end. If not test will failed.

##Circleci integration
With this lib, you can start any process you want and execute your test. This lib was built to work great with circle ci.
After test, a test report will generate (xml file) that will be use by circle ci (see screen below).

![Alt text](https://github.com/Tchangang/screenshot_repo/blob/master/Capture%20d%E2%80%99e%CC%81cran%202019-11-09%20a%CC%80%2013.14.50.png?raw=true)

![Alt text](https://github.com/Tchangang/screenshot_repo/blob/master/Capture%20d%E2%80%99e%CC%81cran%202019-11-09%20a%CC%80%2013.14.35.png?raw=true) 

<b>Attention: </b>
Your need to configure process.env.JENA_RESULT_PATH in your config.yml and set "store_test_results" (and if you want "store_artifacts").
Read the circleci doc for more informations: https://circleci.com/docs/2.0/configuration-reference
```javascript
    ./circleci/config.yml

    steps:
          - checkout
          - run: yarn
          - run:
              command: yarn test-e2e
              environment:
                  JENA_RESULT_PATH: test-results/jena/results.xml
          - store_test_results:
              path: ~/project/test-results
          - store_artifacts:
              path: ~/project/test-results
```
