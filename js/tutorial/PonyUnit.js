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

    window.exec = function (fn, onFinish) {
        countAssert = 0;
        var failed = false;

        try {
            fn();
        } catch (e) {
            failed = true;
            if (e instanceof Failed) {
                assertionFailed.push(e.message);
            } else{
                throw e;
            }
        } finally {
            if (onFinish) {
                onFinish({
                    count : countAssert,
                    errors: assertionFailed,
                    failed : failed
                });
            }
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