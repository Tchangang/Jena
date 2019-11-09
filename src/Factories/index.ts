import StepItem from '../StepItem';
import {TestItem} from '../Interface/TestHandler';
import Step from '../Step';

class Factory {
    static createStepItem(id: undefined | string,
               test: string,
               passed?: boolean): TestItem {
        return new StepItem(id, test, passed);
    }
    static createStep(id: undefined | string,
               step: string) {
        return new Step(id, step);
    }
}

export default Factory;
