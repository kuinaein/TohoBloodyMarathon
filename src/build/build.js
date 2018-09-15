const path = require('path');
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;

const nodePath = process.argv[0];
const webpackPath = path.resolve(__dirname, '../node_modules/.bin/webpack');
spawnSync(nodePath, [webpackPath, '--progress', '--hide-modules'], {
  stdio: 'inherit',
});

fs.copyFileSync(
    path.resolve(__dirname, '../index.html'),
    path.resolve(__dirname, '../../www/index.html')
);
const files = fs.readdirSync(path.resolve(__dirname, '../dist'));
for (const f of files) {
  if (f.match(/\.map$/)) {
    continue;
  }
  fs.copyFileSync(
      path.resolve(__dirname, '../dist', f),
      path.resolve(__dirname, '../../www', f)
  );
}
