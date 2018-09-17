import {createSingleLayerScene} from '@/util/cocos2d-util';
import {RESOURCE_MAP} from '@/resource';

/** @type {cc.Layer} */
const aboutLayerProps = {
  ctor() {
    this._super(cc.color.WHITE);

    const satori = new cc.Sprite(RESOURCE_MAP.Satori_About_jpg);
    satori.setScale(0.4);
    satori.setOpacity(48);
    satori.setAnchorPoint(cc.p(1, 0));
    satori.x = cc.winSize.width * 0.8;
    this.addChild(satori);

    const titleLabel = new cc.LabelTTF(
        '東方血吐走について',
        'serif',
        cc.winSize.height * 0.12
    );
    titleLabel.setAnchorPoint(cc.p(0.5, 1));
    titleLabel.setFontFillColor(cc.color.BLACK);
    titleLabel.x = cc.winSize.width / 2;
    titleLabel.y = cc.winSize.height * 0.95;
    this.addChild(titleLabel);

    this.initCreditTitle();

    const notes2 = new cc.LabelTTF(
        `なお、本作品は水鶏の個人制作であり、
上記の方々とは、素材の提供を除き一切関係がありません。`,
        'sans-serif',
        cc.winSize.height * 0.04
    );
    notes2.setFontFillColor(cc.color.BLACK);
    notes2.setAnchorPoint(cc.p(0, 0));
    notes2.setPosition(cc.p(cc.winSize.width * 0.1, cc.winSize.height * 0.05));
    this.addChild(notes2);

    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);
  },

  initCreditTitle() {
    const notes = new cc.LabelTTF(
        `- 本作品に登場するキャラクターや世界観等の著作権は、
   上海アリス幻樂団様が保有しています。
- その他、下記の方々の素材を利用させていただきました。
  ※下記は利用に当たりクレジット表記が必須とされているもののみ
   - spellyon様    配布元サイト「点睛集積」
   - エルル様    配布元サイト「えるるのだいあり」
     他多数
`,
        'sans-serif',
        cc.winSize.height * 0.04
    );
    notes.setFontFillColor(cc.color.BLACK);
    notes.setAnchorPoint(cc.p(0, 1));
    notes.setPosition(cc.p(cc.winSize.width * 0.1, cc.winSize.height * 0.75));
    this.addChild(notes);
  },

  /**
   * @param {cc.Touch} touch
   * @param {cc.EventTouch} event
   * @return {boolean}
   */
  onTouchBegan(touch, event) {
    cc.eventManager.removeAllListeners();
    cc.director.runScene(new tbm.TitleScene());
    return false;
  },
};

export const AboutScene = createSingleLayerScene(
    aboutLayerProps,
    cc.LayerColor
);
