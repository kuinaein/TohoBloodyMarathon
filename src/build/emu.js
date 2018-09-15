const path = require('path');
const spawnSync = require('child_process').spawnSync;

const cwd = path.resolve(__dirname, '../..');
spawnSync('cordova', ['emulate', 'android', '-d'], {stdio: 'inherit', cwd});
