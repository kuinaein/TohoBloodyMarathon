import {createSingleLayerScene} from '@/util/cocos2d-util';

/** @type {cc.Layer} */
const mainLayerProps = {
  ctor: function() {
    this._super();
    return true;
  },
};
export const MainScene = createSingleLayerScene(mainLayerProps);
