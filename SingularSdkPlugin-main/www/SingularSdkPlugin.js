var exec = require('cordova/exec');

var SingularSdkPlugin = {
    TRACKING_PERMISSION_NOT_DETERMINED: 0,
    TRACKING_PERMISSION_RESTRICTED: 1,
    TRACKING_PERMISSION_DENIED: 2,
    TRACKING_PERMISSION_AUTHORIZED: 3,
    initSingular: function(phrase, callback) {
        exec(callback, null, 'SingularSdkPlugin', 'initSingular', [phrase]);
    },
    requestPermission: function(callback) {
        return new Promise(function(callback) {
            exec(callback, null, 'SingularSdkPlugin', "requestPermission", []);
        });
    }
};

module.exports = SingularSdkPlugin;