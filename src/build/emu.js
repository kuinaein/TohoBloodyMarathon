const path = require('path');
const spawnSync = require('child_process').spawnSync;
const os = require('os');

const platform = 'Darwin' === os.type() ? 'ios' : 'android';
const cwd = path.resolve(__dirname, '../..');
spawnSync('cordova', ['prepare', platform, '-d'], {stdio: 'inherit', cwd});
spawnSync('cordova', ['emulate', platform, '-d'], {stdio: 'inherit', cwd});
