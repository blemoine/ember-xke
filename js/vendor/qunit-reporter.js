(function() {

    'use strict';

    var currentRun, currentModule, currentTest, assertCount;

    QUnit.begin(function() {
        currentRun = {
            modules: [],
            total: 0,
            passed: 0,
            failed: 0,
            start: new Date(),
            time: 0
        };
    });

    QUnit.moduleStart(function(data) {
        currentModule = {
            name: data.name,
            tests: [],
            total: 0,
            passed: 0,
            failed: 0,
            start: new Date(),
            time: 0,
            stdout: [],
            stderr: []
        };

        currentRun.modules.push(currentModule);
    });

    QUnit.testStart(function(data) {
        // Setup default module if no module was specified
        if (!currentModule) {
            currentModule = {
                name: data.module || 'default',
                tests: [],
                total: 0,
                passed: 0,
                failed: 0,
                start: new Date(),
                time: 0,
                stdout: [],
                stderr: []
            };

            currentRun.modules.push(currentModule);
        }

        // Reset the assertion count
        assertCount = 0;

        currentTest = {
            name: data.name,
            failedAssertions: [],
            total: 0,
            passed: 0,
            failed: 0,
            start: new Date(),
            time: 0
        };

        currentModule.tests.push(currentTest);
    });

    QUnit.log(function(data) {
        assertCount++;

        // Ignore passing assertions
        if (!data.result) {
            currentTest.failedAssertions.push(data);

            // Add log message of failure to make it easier to find in Jenkins CI
            currentModule.stdout.push('[' + currentModule.name + ', ' + currentTest.name + ', ' + assertCount + '] ' + data.message);
        }
    });

    QUnit.testDone(function(data) {
        currentTest.time = (new Date()).getTime() - currentTest.start.getTime();  // ms
        currentTest.total = data.total;
        currentTest.passed = data.passed;
        currentTest.failed = data.failed;

        currentTest = null;
    });

    QUnit.moduleDone(function(data) {
        currentModule.time = (new Date()).getTime() - currentModule.start.getTime();  // ms
        currentModule.total = data.total;
        currentModule.passed = data.passed;
        currentModule.failed = data.failed;

        currentModule = null;
    });

    QUnit.done(function(data) {
        currentRun.time = data.runtime || ((new Date()).getTime() - currentRun.start.getTime());  // ms
        currentRun.total = data.total;
        currentRun.passed = data.passed;
        currentRun.failed = data.failed;

        if (QUnit.onReportReady) QUnit.onReportReady(data, currentRun)
    });
})();