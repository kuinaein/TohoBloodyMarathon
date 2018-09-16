import {TbmStorage} from '@/core/TbmStorage';

/** @type {cc.Layer} */
const resultLayerProps = {
  ctor(score) {
    this._super();
    const highScore = parseInt(TbmStorage.get(TbmStorage.KEY_HIGH_SCORE));
    if (score > highScore) {
      TbmStorage.set(TbmStorage.KEY_HIGH_SCORE, '' + score);
    }
    return true;
  },
};

/** @type {cc.Scene} */
const resultSceneProps = {
  ctor(score) {
    this._super();
    this.score = score;
  },
  onEnter() {
    this._super();
    const LayerClass = cc.Layer.extend(resultLayerProps);
    const layer = new LayerClass(this.score);
    this.addChild(layer);
  },
};

export const ResultScene = cc.Scene.extend(resultSceneProps);
