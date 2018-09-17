import {createSingleLayerScene} from '@/util/cocos2d-util';
import {RESOURCE_MAP} from '@/resource';
import {AboutScene} from '@/scene/AboutScene';
import {CharacterChooseScene} from '@/scene/CharacterChooseScene';

const TAG_ABOUT_BUTTON_LABEL = 33;

/**
 * @typedef TitleLayerProps
 * @property {cc.Point} centerOfAboutButon
 * @property {number} radiusOfAboutButton
 */

/** @type {cc.LayerColor & TitleLayerProps} */
const titleLayerProps = {
  ctor() {
    this._super();
    const size = cc.winSize;

    const staticBg = new cc.Sprite(RESOURCE_MAP.BG_Forest_png);
    staticBg.setScale(cc.winSize.width / 640);
    staticBg.setAnchorPoint(0, 0);
    this.addChild(staticBg);

    const orin = new cc.Sprite(RESOURCE_MAP.Orin_Title_png);
    orin.setAnchorPoint(cc.p(0, 0));
    orin.setPositionX(cc.winSize.width * -0.01);
    orin.setScale(0.3);
    this.addChild(orin);

    const titleLabel = new cc.Sprite(RESOURCE_MAP.Title_Logo_png);
    titleLabel.setScale(1.5);
    titleLabel.x = size.width / 2;
    titleLabel.y = (size.height * 8) / 10;
    this.addChild(titleLabel);

    this.initStartLabel();
    this.initAboutButton();

    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);

    return true;
  },

  initStartLabel() {
    const tapToStartLabel = new cc.LabelTTF(
        '画面をタップしてスタート',
        'sans-serif',
        cc.winSize.height * 0.07
    );
    tapToStartLabel.setFontFillColor(cc.color.BLACK);
    tapToStartLabel.x = cc.winSize.width * 0.5;
    tapToStartLabel.y = cc.winSize.height * 0.3;
    this.addChild(tapToStartLabel);
    const labelSize = tapToStartLabel.getContentSize();
    const layerOverLabel = new cc.LayerColor(
        cc.color(255, 255, 255, 128),
        labelSize.width,
        labelSize.height
    );
    tapToStartLabel.addChild(layerOverLabel, -1);
  },

  initAboutButton() {
    const aboutButton = new cc.DrawNode();
    aboutButton.setAnchorPoint(1, 0);
    this.centerOfAboutButon = cc.p(
        cc.winSize.width * 0.9,
        cc.winSize.height * 0.2
    );
    this.radiusOfAboutButton = cc.winSize.height * 0.15;
    aboutButton.drawDot(
        this.centerOfAboutButon,
        this.radiusOfAboutButton,
        cc.color(255, 255, 255, 224)
    );
    this.addChild(aboutButton);

    const aboutButtonLabel = new cc.LabelTTF(
        '本アプリに\nついて...',
        'sans-serif',
        cc.winSize.height * 0.04
    );
    aboutButtonLabel.setFontFillColor(cc.color.BLACK);
    aboutButtonLabel.setAnchorPoint(0.5, 0);
    aboutButtonLabel.x = cc.winSize.width * 0.9;
    aboutButtonLabel.y = cc.winSize.height * 0.13;
    aboutButtonLabel.setTag(TAG_ABOUT_BUTTON_LABEL);
    this.addChild(aboutButtonLabel);
  },

  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   * @return {boolean}
   */
  onTouchBegan(touch, event) {
    cc.eventManager.removeAllListeners();
    const r2 = Math.pow(this.radiusOfAboutButton, 2);
    if (r2 > cc.pDistanceSQ(touch.getLocation(), this.centerOfAboutButon)) {
      cc.director.runScene(new AboutScene());
    } else {
      cc.director.runScene(new CharacterChooseScene());
    }
    return false;
  },
};

export const TitleScene = createSingleLayerScene(titleLayerProps);
