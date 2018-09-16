import {createSingleLayerScene} from '@/util/cocos2d-util';
import {RESOURCE_MAP} from '@/resource';

/**
 * @typedef MainLayerProps
 * @property {cp.Space} space
 * @property {cc.Sprite} bg
 */

/** @type {cc.Layer & MainLayerProps} */
const mainLayerProps = {
  ctor() {
    this._super(cc.color.WHITE);
    this.scheduleUpdate();

    // 物理エンジンの設定
    const space = new cp.Space();
    space.gravity = cp.v(0, -98);
    this.space = space;

    this.bg = new cc.Node();
    this.bg = new cc.Sprite(RESOURCE_MAP.BG_Country_png);
    this.bg.setAnchorPoint(0, 0);
    this.addChild(this.bg);

    return true;
  },
  update(dt) {
    this._super(dt);
    this.space.step(dt);

    // 背景画像のスクロール;
    this.bg.setPositionX(this.bg.getPositionX() - 5);
    const bgBox = this.bg.getBoundingBoxToWorld();
    if (cc.winSize.width > bgBox.x + bgBox.width) {
      this.bg.setPositionX(bgBox.x + bgBox.width / 3);
    }

    return true;
  },
};

export const MainScene = createSingleLayerScene(mainLayerProps, cc.LayerColor);
