interface TestItem {
    id: string,
    test: string,
    time: number,
    message?: string,
    success: boolean,
    passed: boolean,
    getXml: () => string,
    complete: () => void,
}
interface TestStep {
    id: string,
    step: string,
    total: number,
    passed: number,
    failed: number,
    success: number,
    time: number,
    start: number,
    end: number,
    tests: Array<TestItem>,
    computeTime: () => void,
    getXml: () => string,
    addStep: (test: TestItem) => void,
}

export {
    TestItem,
    TestStep,
};
