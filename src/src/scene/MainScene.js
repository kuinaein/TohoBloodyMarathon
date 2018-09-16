import {createSingleLayerScene} from '@/util/cocos2d-util';
import {RESOURCE_MAP} from '@/resource';

/**
 * @typedef MainLayerProps
 * @property {number} CH_WIDTH
 * @property {number} CH_HEIGHT
 * @property {cp.Space} space
 * @property {cc.Sprite} bg
 * @property {cc.PhysicsSprite} pcSprite
 */

/** @type {cc.Layer & MainLayerProps} */
const mainLayerProps = {
  CH_WIDTH: 24,
  CH_HEIGHT: 32,

  ctor() {
    this._super(cc.color.WHITE);
    this.scheduleUpdate();

    const bg = new cc.Sprite(RESOURCE_MAP.BG_Country_png);
    bg.setAnchorPoint(0, 0);
    this.addChild(bg);
    this.bg = bg;

    this.initPhysics();
    this.initPlayerCharacter();

    const self = this;
    /** @type {cc._EventListenerTouchOneByOne} */
    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan() {
        // 多段ジャンプ禁止
        return 10 > self.pcSprite.getBody().kineticEnergy();
      },
      onTouchEnded() {
        self.pcSprite.getBody().applyImpulse(cp.v(0, 300), cp.v(0, 0));
      },
    };
    cc.eventManager.addListener(touchListener, this);

    return true;
  },

  /** 物理エンジン周りの初期化 */
  initPhysics() {
    const space = new cp.Space();
    space.gravity = cp.v(0, -1000);
    if ('production' !== process.env.NODE_ENV) {
      const phDebugNode = new cc.PhysicsDebugNode(space);
      phDebugNode.setVisible(true);
      this.addChild(phDebugNode, 100);
    }

    const floorHeight = (cc.winSize.height * 15) / 100;
    const floor = new cp.SegmentShape(
        new cp.StaticBody(),
        cp.v(0, floorHeight),
        cp.v(cc.winSize.width, floorHeight),
        0
    );
    space.addStaticShape(floor);

    this.space = space;
  },

  initPlayerCharacter() {
    const resourece = RESOURCE_MAP.ChireidenCharacters_png;
    const baseRect = cc.rect(
        this.CH_WIDTH * 6,
        this.CH_HEIGHT * 1,
        this.CH_WIDTH,
        this.CH_HEIGHT
    );
    const spriteFrame = new cc.SpriteFrame(resourece, baseRect);

    const pcSprite = new cc.PhysicsSprite(spriteFrame);
    const body = new cp.Body(
        1,
        cp.momentForBox(1, this.CH_WIDTH, this.CH_HEIGHT)
    );
    body.setPos(
        cp.v((cc.winSize.width * 1) / 10, (cc.winSize.height * 2) / 10)
    );
    this.space.addBody(body);
    const shape = new cp.BoxShape(
        body,
        this.CH_WIDTH * 0.5,
        this.CH_HEIGHT * 0.8
    );
    this.space.addShape(shape);
    pcSprite.setBody(body);

    const animeFrames = [];
    for (let i = 0; i < 3; ++i) {
      const frame = new cc.SpriteFrame(
          resourece,
          cc.rect(
              baseRect.x + i * this.CH_WIDTH,
              baseRect.y,
              baseRect.width,
              baseRect.height
          )
      );
      animeFrames.push(frame);
    }
    const anime = new cc.Animation(animeFrames, 0.1);
    anime.setRestoreOriginalFrame(true);
    pcSprite.runAction(cc.repeatForever(new cc.Animate(anime)));

    this.addChild(pcSprite);
    this.pcSprite = pcSprite;
  },

  update(dt) {
    this._super(dt);
    this.space.step(dt);

    // 背景画像のスクロール;
    this.bg.setPositionX(this.bg.getPositionX() - 4);
    const bgBox = this.bg.getBoundingBoxToWorld();
    if (cc.winSize.width > bgBox.x + bgBox.width) {
      this.bg.setPositionX(bgBox.x + bgBox.width / 3);
    }

    return true;
  },
};

export const MainScene = createSingleLayerScene(mainLayerProps, cc.LayerColor);
