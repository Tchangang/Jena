import {TestItem, TestStep} from './Interface/TestHandler';
import shortid = require('shortid');

class Step implements TestStep {
    id: string;
    step: string;
    total: number;
    passed: number;
    failed: number;
    success: number;
    time: number = 0;
    start: number;
    end: number;
    tests: Array<TestItem>;
    computeTime = () => {
        this.end = new Date().getTime();
        this.time = (this.end - this.start) / 1000;
    };
    getXml() {
        return `    <testsuite id="${this.id}" name="${this.step}" tests="${this.total}" failures="${this.failed + this.passed}" time="${this.time}">\n`
            .concat(`${this.tests.map(testItem => testItem.getXml()).join('\n')}\n`)
            .concat('    </testsuite>\n')
    }
    constructor(id: undefined | string,
                step: string) {
        this.id = id  || shortid.generate();
        this.step = step;
        this.total = 0;
        this.passed = 0;
        this.failed = 0;
        this.success = 0;
        this.time = 0;
        this.start = new Date().getTime();
        this.end = 0;
        this.tests = [];
    }
    addStep(step: TestItem) {
        this.total += 1;
        if (step.passed) {
            this.passed += 1;
        } else if (step.success) {
            this.success += 1;
        } else {
            this.failed += 1;
        }
        this.tests.push(step);
    }
}

export default Step;
