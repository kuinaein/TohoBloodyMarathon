const path = require('path');
const spawnSync = require('child_process').spawnSync;
const os = require('os');

const cwd = path.resolve(__dirname, '../..');
spawnSync(
    'cordova',
    ['emulate', 'Darwin' === os.type() ? 'ios' : 'android', '-d'],
    {stdio: 'inherit', cwd}
);
