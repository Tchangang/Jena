import {TestItem} from './Interface/TestHandler';
import shortid = require('shortid');

class StepItem implements TestItem{
    id: string;
    time = 0;
    success: boolean = false;
    test: string;
    passed: boolean = false;
    start: number;
    message: undefined | string;
    complete() {
        this.time = new Date().getTime() - this.start;
    }
    private getFailure(): string {
        if (this.passed || !this.success) {
            return `            <failure>${this.message}</failure>\n`;
        }
        return '';
    }
    getXml() {
        return `        <testcase id="${this.id}" name="${this.test}" time="${this.time}">\n`
            .concat(`${this.getFailure()}`)
            .concat('        </testcase>')
    }
    constructor(id: undefined | string,
                test: string,
                passed?: boolean) {
        this.id = id || shortid.generate();
        this.test = test;
        this.passed = Boolean(passed);
        this.start = new Date().getTime();
    }
}

export default StepItem;
