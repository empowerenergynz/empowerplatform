
let fs = require('fs');

module.exports = {
    activateCypressEnvFile() {
        if (fs.existsSync('.env.ci')) {
            fs.renameSync('.env', '.env.backup');
            fs.renameSync('.env.ci', '.env');
        }

        return null;
    },

    activateLocalEnvFile() {
        if (fs.existsSync('.env.backup')) {
            fs.renameSync('.env', '.env.ci');
            fs.renameSync('.env.backup', '.env');
        }

        return null;
    }
};
