function Failed(message) {
    this.name = "Failed";
    this.message = message || "Default Message";
}
Failed.prototype = new Error();
Failed.prototype.constructor = Failed;

/*
 * Du test au vrai goût de poney !
 */
var PonyUnit = (function () {

    var assertionFailed = [], countAssert;

    window.execTestsSteps = function (steps, index) {
        if (steps.length == 0) return;
        var step = steps.shift();
        var test = step.test;
        countAssert = 0;
        var failed = false;

        try {
            if (localStorage.lastRuningTestIdx == undefined || localStorage.lastRuningTestIdx <= index || index == 0){
                var promiseOfTest = test();
                if (promiseOfTest){
                    promiseOfTest.done(function(){ execTestsSteps(steps, 1+index); });
                } else {
                    execTestsSteps(steps, 1+index);
                }
            } else{
                execTestsSteps(steps, 1+index);
            }
        } catch (e) {
            localStorage.lastRuningTestIdx = index;
            failed = true;
            if (e instanceof Failed) {
                assertionFailed.push(e.message);
            } else{
                assertionFailed.push("Error :"+ e.message);
            }
        } finally{
            step.setProperties({
                executed: true,
                passed: !failed,
                errors: assertionFailed
            });
        }
    }

    window.ok = function (testPassed, msg) {
        countAssert++;
        testPassed = !!testPassed;
        if (!testPassed) {
            throw new Failed(msg)
        }
    }

    window.fail = function (msg) {
        ok (false, msg)
    }

    window.equal = function (a , b, msg) {
        ok (a === b, msg);
    }

    return {
        // some public methods ...
    };
})();