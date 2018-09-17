import '@/resource';
import {TitleScene} from '@/scene/TitleScene';
import {MainScene} from '@/scene/MainScene';
import {ResultScene} from '@/scene/ResultScene';

/** @param {*} err */
function knDefaultErrorHandler(err) {
  if (err.message) {
    alert(err.message);
  } else {
    alert(err);
  }
}
window.addEventListener('error', knDefaultErrorHandler);
window.addEventListener('unhandledrejection', knDefaultErrorHandler);

window.tbm = window.tbm || {};
Object.assign(window.tbm, {
  TitleScene,
  MainScene,
  ResultScene,
});
