import childProcess, {ChildProcess} from 'child_process';
import os from 'os';
import * as fs from "fs";
import colors from 'colors';

class TestHandler {
    path: any;
    xml: Array<string>;
    title: string;
    promises: Array<Promise<any>>;
    constructor(title: string, path: any) {
        this.path = path;
        this.xml = [];
        this.title = title;
        this.promises = [];
    }
    closeProcess(process: ChildProcess) {
        if (os.platform() === 'win32') {
            childProcess.exec('taskkill /pid ' + process.pid + ' /T /F')
        } else {
            process.kill();
        }
    }
    async saveJUnitReport() {
        const finalXml = '<?xml version="1.0" encoding="UTF-8"?>\n'
            .concat(`<testsuites id="" name="${this.title}">\n`)
            .concat(`${this.xml.join('')}</testsuites>`);
        if (process.env.JENA_RESULT_PATH) {
            await new Promise((resolve, reject) => {
                fs.writeFile(process.env.JENA_RESULT_PATH!, finalXml, (err) => {
                    if (err) {
                        console.log(colors.red('Unable to save test result in '.concat(process.env.JENA_RESULT_PATH!)));
                        reject(err);
                    }
                    resolve();
                });
            });
        }
    }
    async end() {
        await Promise.all(this.promises);
        await this.saveJUnitReport();
    }
    async startTestSuite(args: Array<any> = [], sync: boolean = false) {
        let localProcess: ChildProcess;
        const testSuitePromise = new Promise((resolve, reject) => {
            try {
                localProcess = childProcess.spawn(this.path, args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
                localProcess!.on('message', async (data) => {
                    if (data.type === 'TEST_COMPLETE' || data.error) {
                        this.closeProcess(localProcess);
                        this.xml.push(data.xml);
                        if (data.error) {
                            await this.saveJUnitReport();
                            reject(new Error(data.error));
                        }
                        return resolve();
                    }
                });
            } catch (e) {
                if (localProcess!) {
                    this.closeProcess(localProcess!);
                }
                reject(e);
            }
        });
        this.promises.push(testSuitePromise);
        if (sync) {
            await testSuitePromise;
        }
        return;
    }
}

export default TestHandler;
