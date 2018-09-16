const path = require('path');
const fs = require('fs');
const copyDir = require('copy-dir');

const COCOS_X_ROOT = process.env['COCOS_X_ROOT'];

if (!COCOS_X_ROOT || !fs.existsSync(COCOS_X_ROOT)) {
  throw new Error('環境変数 COCOS_X_ROOT が未設定');
}
const frameworksDir = path.resolve(__dirname, '../frameworks');
if (!fs.existsSync(frameworksDir)) {
  fs.mkdirSync(frameworksDir);
}
copyDir.sync(
    path.resolve(COCOS_X_ROOT, 'web'),
    path.resolve(frameworksDir, 'cocos2d-html5'),
    (state, filepath, filename) => -1 == ['template', 'tools'].indexOf(filename)
);

// copyDir.sync(COCOS_X_ROOT,
// path.resolve(__dirname, '../frameworks/cocos2d-x'));
