import {createSingleLayerScene} from '@/util/cocos2d-util';
import {RESOURCE_MAP} from '@/resource';
import {CHARACTER_SET_MAP} from '@/core/caharacter-def';
import {MainScene} from '@/scene/MainScene';

/**
 * @typedef CharacterChooseLayerProps
 * @property {Array<cc.Sprite & {_tbmCharacterName: string}>} characterTiles
 */

/** @type {cc.Layer & CharacterChooseLayerProps} */
const characterChooseLayerProps = {
  ctor() {
    this._super();

    const staticBg = new cc.Sprite(RESOURCE_MAP.BG_Forest_png);
    staticBg.setScale(cc.winSize.width / 640);
    staticBg.setAnchorPoint(0, 0);
    this.addChild(staticBg);

    const characterDefs = [
      {anchor: cc.p(1, 0), def: CHARACTER_SET_MAP['お燐']}, // 左上
      {anchor: cc.p(0, 0), def: CHARACTER_SET_MAP['穣子']}, // 右上
      {anchor: cc.p(1, 1), def: CHARACTER_SET_MAP['こころ']}, // 左下
      {anchor: cc.p(0, 1), def: CHARACTER_SET_MAP['霊夢']}, // 右下
    ];
    this.characterTiles = [];
    for (const d of characterDefs) {
      const sprite = new cc.Sprite(d.def.playerCharacterSdImage);
      const spriteSize = sprite.getContentSize();
      sprite.setScale((cc.winSize.height * 0.45) / spriteSize.height);
      sprite.setAnchorPoint(d.anchor);
      sprite.x = cc.winSize.width / 2 + (d.anchor.x ? -5 : 5);
      sprite.y = cc.winSize.height / 2 + (d.anchor.y ? -5 : 5);
      sprite._tbmCharacterName = d.def.name;
      this.addChild(sprite);
      this.characterTiles.push(sprite);
    }

    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);

    return true;
  },

  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   * @return {boolean}
   */
  onTouchBegan(touch, event) {
    for (const sprite of this.characterTiles) {
      const box = sprite.getBoundingBoxToWorld();
      if (!cc.rectContainsPoint(box, touch.getLocation())) {
        continue;
      }
      cc.eventManager.removeAllListeners();
      const frame = new cc.DrawNode();
      frame.drawRect(
          cc.p(box.x, box.y),
          cc.p(box.x + box.width, box.y + box.height),
          cc.color(0, 0, 0, 0),
          cc.winSize.height * 0.08,
          cc.color(0, 255, 0, 192)
      );
      frame.runAction(
          cc.sequence([
            cc.blink(1, 2),
            cc.callFunc(() => {
              cc.director.runScene(new MainScene(sprite._tbmCharacterName));
            }),
          ])
      );
      this.addChild(frame);
      cc.audioEngine.playEffect(RESOURCE_MAP.SE_GameStart_mp3);
      break;
    }
    return false;
  },
};

export const CharacterChooseScene = createSingleLayerScene(
    characterChooseLayerProps
);
