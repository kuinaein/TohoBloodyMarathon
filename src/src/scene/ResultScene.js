import {TbmStorage} from '@/core/TbmStorage';
import {RESOURCE_MAP} from '@/resource';

/** @type {cc.Layer} */
const resultLayerProps = {
  ctor(score) {
    this._super();
    let oldHighScore = parseInt(TbmStorage.get(TbmStorage.KEY_HIGH_SCORE) || 0);
    if (isNaN(oldHighScore)) {
      oldHighScore = 0;
    }
    if (score > oldHighScore) {
      TbmStorage.set(TbmStorage.KEY_HIGH_SCORE, '' + score);
    }

    const staticBg = new cc.Sprite(RESOURCE_MAP.BG_Forest_png);
    staticBg.setScale(cc.winSize.width / 640);
    staticBg.setAnchorPoint(0, 0);
    this.addChild(staticBg);

    const bgFrame = new cc.Sprite(RESOURCE_MAP.Result_Frame_png);
    bgFrame.setScale(0.6);
    bgFrame.x = cc.winSize.width / 2;
    bgFrame.y = cc.winSize.height / 2;
    this.addChild(bgFrame);

    const titleLabel = new cc.LabelTTF(
        '走行記録',
        'serif',
        cc.winSize.height * 0.1
    );
    titleLabel.setFontFillColor(cc.color.BLACK);
    titleLabel.x = cc.winSize.width / 2;
    titleLabel.y = cc.winSize.height * 0.75;
    this.addChild(titleLabel);

    this.initScoreLabels(oldHighScore, score);

    if (score > oldHighScore) {
      const recordUpdatedLabel = new cc.LabelTTF(
          '記録更新！',
          'sans-serif',
          cc.winSize.height * 0.07
      );
      recordUpdatedLabel.setFontFillColor(cc.color(199, 60, 46, 255));
      recordUpdatedLabel.x = cc.winSize.width / 2;
      recordUpdatedLabel.y = cc.winSize.height * 0.3;
      recordUpdatedLabel.runAction(cc.repeatForever(cc.blink(1.5, 1)));
      this.addChild(recordUpdatedLabel);
    }

    cc.eventManager.addListener(
        {
          event: cc.EventListener.TOUCH_ONE_BY_ONE,
          swallowTouches: false,
          onTouchBegan() {
            cc.eventManager.removeAllListeners();
            cc.director.runScene(new tbm.TitleScene());
            return true;
          },
        },
        this
    );

    return true;
  },

  initScoreLabels(oldHighScore, score) {
    const oldHighScoreLabel = new cc.LabelTTF(
        'ハイスコア',
        'sans-serif',
        cc.winSize.height * 0.05
    );
    oldHighScoreLabel.setFontFillColor(cc.color.BLACK);
    oldHighScoreLabel.setAnchorPoint(cc.p(0, 1));
    oldHighScoreLabel.x = cc.winSize.width * 0.25;
    oldHighScoreLabel.y = cc.winSize.height * 0.6;
    this.addChild(oldHighScoreLabel);

    const oldHighScorePointLabel = new cc.LabelTTF(
        `${oldHighScore} 粟`,
        'sans-serif',
        cc.winSize.height * 0.05
    );
    oldHighScorePointLabel.setFontFillColor(cc.color.BLACK);
    oldHighScorePointLabel.setAnchorPoint(cc.p(0, 0));
    oldHighScorePointLabel.x = cc.winSize.width * 0.3;
    oldHighScorePointLabel.y = 0;
    oldHighScoreLabel.addChild(oldHighScorePointLabel);

    const resultScoreLabel = new cc.LabelTTF(
        '今回の記録',
        'sans-serif',
        cc.winSize.height * 0.05
    );
    resultScoreLabel.setFontFillColor(cc.color.BLACK);
    resultScoreLabel.setAnchorPoint(cc.p(0, 1));
    resultScoreLabel.x = 0;
    resultScoreLabel.y = -cc.winSize.height * 0.05;
    oldHighScoreLabel.addChild(resultScoreLabel);

    const resultScorePointLabel = new cc.LabelTTF(
        `${score} 粟`,
        'sans-serif',
        cc.winSize.height * 0.05
    );
    resultScorePointLabel.setFontFillColor(cc.color.BLACK);
    resultScorePointLabel.setAnchorPoint(cc.p(0, 0));
    resultScorePointLabel.x = cc.winSize.width * 0.3;
    resultScorePointLabel.y = 0;
    resultScoreLabel.addChild(resultScorePointLabel);
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
