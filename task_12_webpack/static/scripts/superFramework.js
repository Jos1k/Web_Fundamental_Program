const AppInstanse = require('./appInstanse');

class SuperFramework{
    static createRoot(appName) {
        return new AppInstanse(appName);
    }
}

module.exports = SuperFramework;