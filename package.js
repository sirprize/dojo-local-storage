var profile = (function () {

    var miniExcludes = {
            "dojo-local-storage/package": 1//,
            //"dojo-local-storage/package.json": 1
        },
        amdExcludes = {},
        isTestRe = /\/test\//
    ;

    return {
        resourceTags: {
            test: function (filename, mid) {
                return isTestRe.test(filename);
            },

            miniExclude: function (filename, mid) {
                return isTestRe.test(filename) || mid in miniExcludes;
            },

            amd: function (filename, mid) {
                return /\.js$/.test(filename) && !(mid in amdExcludes);
            },

            copyOnly: function (filename, mid) {
                return false;
            }
        }
    };
})();