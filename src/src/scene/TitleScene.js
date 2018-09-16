import {createSingleLayerScene} from '@/util/cocos2d-util';
import {MainScene} from '@/scene/MainScene';

/** @type {cc.LayerColor} */
const titleLayerProps = {
  ctor() {
    this._super(cc.color.WHITE);
    const size = cc.winSize;

    const titleLabel = new cc.LabelTTF('東方血吐走', 'serif', 64);
    titleLabel.setFontFillColor(cc.color(199, 60, 46, 255)); // 緋色
    titleLabel.enableShadow(cc.color.GRAY, cc.size(10, -10), 2);
    titleLabel.x = size.width / 2;
    titleLabel.y = (size.height * 8) / 10;
    this.addChild(titleLabel);

    const tapToStartLabel = new cc.LabelTTF(
        '画面をタップしてスタート',
        'sans-serif',
        16
    );
    tapToStartLabel.setFontFillColor(cc.color.BLACK);
    tapToStartLabel.x = size.width / 2;
    tapToStartLabel.y = (size.height * 3) / 10;
    tapToStartLabel.runAction(cc.repeatForever(cc.blink(1.5, 1)));
    this.addChild(tapToStartLabel);

    cc.eventManager.addListener(
        {
          event: cc.EventListener.TOUCH_ONE_BY_ONE,
          swallowTouches: false,
          onTouchBegan() {
            cc.eventManager.removeAllListeners();
            cc.director.runScene(new MainScene());
            return true;
          },
        },
        this
    );

    return true;
  },
};

export const TitleScene = createSingleLayerScene(
    titleLayerProps,
    cc.LayerColor
);
