import {Callback} from './Interface/Jena';
import {TestStep} from './Interface/TestHandler';
import escapeForXml from './helpers/escapeForXml';
import colors from 'colors';
import Factory from './Factories';
import TestHandler from './TestHandler';

class JenaTest {
    steps: Array<TestStep> = [];
    testSuiteTitle = 'New test suite';
    failing: boolean = false;

    constructor() {

    }
    static getHandler(title: string, args: any): TestHandler {
        return new TestHandler(title, args);
    }
    async before(callback: Callback) {
        await callback();
    }

    async after(callback: Callback) {
        await callback();
    }

    escapeForXml(str?: string) {
        return escapeForXml(str);
    }
    end(withError?: string) {
        this.completeLastStep();
        const xmlReportStr = this.generateXml();
        if (withError) {
            console.log(colors.red(`
                ${this.steps[this.steps.length - 1].step} failed
                    ${withError}
            `));
            if (process && typeof process.send === 'function') {
                process.send({ error: withError, xml: xmlReportStr });
            }
            return;
        }
        if (process && typeof process.send === 'function') {
            process.send({ type: 'TEST_COMPLETE', xml: xmlReportStr });
        }
    }
    completeLastStep() {
        if (this.steps.length > 0) {
            this.steps[this.steps.length - 1].computeTime();
        }
    }
    async describe(stepDescription: string, callback: Callback, id?: string) {
        console.log(`  ${stepDescription}`);
        this.completeLastStep();
        this.steps.push(Factory.createStep(id, stepDescription));
        await callback();
    }
    generateXml(): string {
        return `${this.steps.map((step: TestStep) =>  step.getXml())}\n`;
    }
    expect(testDescription: string, value: any, id?: string) {
        const stepItem = Factory.createStepItem(id, testDescription, false);
        return {
            toBe: (toCmp: any) => {
                stepItem.complete();
                if (this.failing) {
                    stepItem.passed = true;
                    stepItem.message = this.escapeForXml('Test not evaluated because previous was failing');
                    this.steps[this.steps.length - 1].addStep(stepItem);
                    return;
                }
                if (value !== toCmp) {
                    const error = (`
                        Test failed: ${testDescription}
                        expected: ${toCmp}
                        received: ${value}
                    `);
                    stepItem.success = false;
                    stepItem.message = this.escapeForXml(error);
                    console.log(`        ${this.steps[this.steps.length - 1].tests.length + 1}- ${testDescription} ${colors.red('\n'.concat(error))}`);
                    this.steps[this.steps.length - 1].addStep(stepItem);
                    this.failing = true;
                    throw new Error(error);
                }
                console.log(`        ${this.steps[this.steps.length - 1].tests.length + 1}- ${testDescription} ${colors.green('success')}`);
                stepItem.success = true;
                stepItem.message = 'Success';
                this.steps[this.steps.length - 1].addStep(stepItem);
            }
        }
    }
    async startTestSuite(testSuiteTitle: string, callback: Callback) {
        this.testSuiteTitle = testSuiteTitle;
        try {
            await callback();
            this.end();
        } catch (e) {
            this.end(e.stack);
        }
    }
}

export = JenaTest;
