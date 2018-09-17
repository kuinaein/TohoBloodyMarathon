import MersenneTwister from 'mersenne-twister';

import {createSingleLayerScene} from '@/util/cocos2d-util';
import {TbmStorage} from '@/core/TbmStorage';
import {TbmCharacter} from '@/core/TbmCharacter';
import {ResultScene} from '@/scene/ResultScene';

import {RESOURCE_MAP} from '@/resource';
import {AppConstants} from '@/core/constants';

/** 敵定義データ */
class EnemyDefinition {
  /**
   * @param {number} row スプライトシート上の行インデックス(一番上は0)
   * @param {number} col スプライトシート上の列インデックス÷3(一番左は0).
   *                     列のみ、1キャラ3マスなのでキャラ単位
   * @param {number} scale 表示倍率
   * @param {boolean} flying 飛べるかどうか
   */
  constructor(row, col, scale, flying) {
    this.row = row;
    this.col = col;
    this.scale = scale;
    this.flying = flying;
  }
}

const ENEMY_DEFINITIONS = [
  new EnemyDefinition(3, 1, AppConstants.BASE_SCALE, false), // こいし
  new EnemyDefinition(3, 3, AppConstants.BASE_SCALE, true), // お空
  new EnemyDefinition(3, 1, AppConstants.BASE_SCALE * 1.5, false), // でかいこいし
];

/**
 * @typedef MainLayerProps
 * @property {number} score
 * @property {number} enemyWait 次の敵が出現するまでの待ち時間
 * @property {boolean} isLive
 * @property {number} floorHeight
 *
 * @property {MersenneTwister} mt
 * @property {cp.Space} space
 * @property {cc.Sprite} bg
 * @property {cc.LabelTTF} scoreLabel
 * @property {cc.LabelTTF} grazeLabel
 * @property {TbmCharacter} playerCharacter
 * @property {TbmCharacter[]} enemies;
 */

/** @type {cc.Layer & MainLayerProps} */
const mainLayerProps = {
  CHARACTER_WIDTH: 24,
  CHARACTER_HEIGHT: 32,

  ctor() {
    this._super();

    this.isLive = true;
    this.enemyWait = 0;
    this.enemies = [];
    this.mt = new MersenneTwister();

    const staticBg = new cc.Sprite(RESOURCE_MAP.BG_Forest_png);
    staticBg.setScale(cc.winSize.width / 640);
    staticBg.setAnchorPoint(0, 0);
    this.addChild(staticBg);

    const bg = new cc.Sprite(RESOURCE_MAP.BG_Country_Platform_png);
    bg.setAnchorPoint(0, 0);
    bg.setScale(1.5);
    this.addChild(bg);
    this.bg = bg;

    this.initLabels();
    this.initPhysics();
    this.initPlayerCharacter();

    /** @type {cc._EventListenerTouchOneByOne} */
    const touchListener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: this.onTouchBegan.bind(this),
      onTouchEnded: this.onTouchEnded.bind(this),
    };
    cc.eventManager.addListener(touchListener, this);

    this.scheduleUpdate();
    return true;
  },

  initLabels() {
    this.score = 0;

    const scoreLabel = new cc.LabelTTF(
        '',
        'sans-serif',
        cc.winSize.height * 0.06
    );
    scoreLabel.setAnchorPoint(cc.p(1, 1));
    scoreLabel.setPosition(cc.winSize.width * 0.98, cc.winSize.height * 0.98);
    // scoreLabel.setFontFillColor(cc.color.BLACK);
    this.addChild(scoreLabel);

    const highScore = TbmStorage.get(TbmStorage.KEY_HIGH_SCORE) || 0;
    const highScoreLabel = new cc.LabelTTF(
        `ハイスコア： ${highScore} 粟`,
        'sans-serif',
        cc.winSize.height * 0.06
    );
    highScoreLabel.setAnchorPoint(cc.p(1, 1));
    highScoreLabel.setPosition(
        scoreLabel.x,
        scoreLabel.y - cc.winSize.height * 0.08
    );
    // highScoreLabel.setFontFillColor(cc.color.BLACK);
    this.addChild(highScoreLabel);

    this.scoreLabel = scoreLabel;
  },

  /** 物理エンジン周りの初期化 */
  initPhysics() {
    const space = new cp.Space();
    space.gravity = cp.v(0, -1200);
    if ('production' !== process.env.NODE_ENV) {
      const phDebugNode = new cc.PhysicsDebugNode(space);
      phDebugNode.setVisible(true);
      this.addChild(phDebugNode, 100);
    }

    const floorHeight = (cc.winSize.height * 13) / 100;
    const floor = new cp.SegmentShape(
        new cp.StaticBody(),
        cp.v(0, floorHeight),
        cp.v(cc.winSize.width, floorHeight),
        0
    );
    space.addStaticShape(floor);
    this.floorHeight = floorHeight;

    space.addCollisionHandler(
        AppConstants.COLLISION_TYPE_PLAYER,
        AppConstants.COLLISION_TYPE_ENEMY,
        this.onCollision.bind(this)
    );

    this.space = space;
  },

  initPlayerCharacter() {
    const pc = new TbmCharacter(1, 2, AppConstants.BASE_SCALE, 0);
    pc.getShape().setCollisionType(AppConstants.COLLISION_TYPE_PLAYER);
    this.addCharacter(pc);
    this.playerCharacter = pc;
  },

  /** @param {TbmCharacter} tbmCharacter */
  addCharacter(tbmCharacter) {
    const sprite = tbmCharacter.getSprite();
    const body = sprite.getBody();
    /** @type {cp.PolyShape} */
    const shape = tbmCharacter.getShape();
    const yPos =
      this.floorHeight - shape.getVert(0).y + tbmCharacter.getFlightLevel();
    body.setPos(cp.v(body.getPos().x, yPos));
    this.addChild(sprite);
    this.space.addBody(body);
    this.space.addShape(shape);
  },

  update(dt) {
    this._super(dt);
    this.space.step(dt);

    // たまに画面の上下に突き抜ける問題の回避用
    const pcBody = this.playerCharacter.getSprite().getBody();
    const pcPos = pcBody.getPos();
    if (cc.winSize.height < pcPos.y) {
      pcBody.setPos(cp.v(pcPos.x, cc.winSize.y));
    } else if (this.floorHeight - AppConstants.CHARACTER_HEIGHT > pcPos.y) {
      const pcOffsetY = this.playerCharacter.getShape().getVert(0).y;
      pcBody.setPos(cp.v(pcPos.x, this.floorHeight - pcOffsetY));
    }

    // 背景画像のスクロール;
    this.bg.setPositionX(this.bg.getPositionX() - 1);
    const bgBox = this.bg.getBoundingBoxToWorld();
    if (cc.winSize.width > bgBox.x + bgBox.width) {
      this.bg.setPositionX(bgBox.x + bgBox.width / 3);
    }

    this.updateEnemies(dt);
    if (this.isLive) {
      this.score += Math.floor(dt * 1000);
      this.scoreLabel.setString(`${this.score} 粟`);
    }

    return true;
  },

  updateEnemies(dt) {
    const pcSprite = this.playerCharacter.getSprite();
    const pcPos = pcSprite.getPosition();
    let grazed = false;
    for (let i = 0; i < this.enemies.length; ++i) {
      const en = this.enemies[i];
      const sprite = en.getSprite();

      // グレイズ判定
      if (
        AppConstants.GRAZE_DISTANCE_SQ * sprite.getScale() >
        cc.pDistanceSQ(pcPos, sprite.getPosition())
      ) {
        this.score += Math.floor(dt * 1000);
        grazed = true;
      }

      const eBox = sprite.getBoundingBox();
      if (0 > eBox.x + eBox.width) {
        //  画面外に行った敵を削除
        this.space.removeBody(sprite.getBody());
        this.space.removeShape(en.getShape());
        this.removeChild(sprite);
        this.enemies.splice(i, 1);
        --i;
      }
    }
    if (grazed) {
      const action = cc.repeat(
          cc.sequence([
            cc.tintTo(0.1, 255, 255, 0),
            cc.tintTo(0.1, 255, 255, 255),
          ]),
          2
      );
      pcSprite.runAction(action);
    }

    if (
      0 == this.enemies.length ||
      cc.winSize.width * 0.6 >
        this.enemies[this.enemies.length - 1].getSprite().getPositionX()
    ) {
      this.enemyWait -= dt;
      if (0 >= this.enemyWait) {
        this.generateEnemy();
        this.enemyWait = this.mt.random();
      }
    }
  },

  generateEnemy() {
    const enemyDef =
      ENEMY_DEFINITIONS[this.mt.random_int() % ENEMY_DEFINITIONS.length];
    let flightLevel = 0;
    if (enemyDef.flying) {
      flightLevel =
        (AppConstants.CHARACTER_HEIGHT *
          AppConstants.BASE_SCALE *
          (this.mt.random_int() % 3)) /
        2;
    }
    const enemy = new TbmCharacter(
        enemyDef.row,
        enemyDef.col,
        enemyDef.scale,
        flightLevel
    );

    enemy.getShape().setCollisionType(AppConstants.COLLISION_TYPE_ENEMY);
    const body = enemy.getSprite().getBody();
    body.velocity_func = () => {}; // 重力を無効化
    body.setPos(cp.v(cc.winSize.width, body.getPos().y));
    // 10秒ごとに初期速度の20%荷重
    const velocity = 150 + 30 * Math.floor(this.score / 10000);
    body.applyImpulse(cp.v(-velocity, 0), cp.v(0, 0));
    this.addCharacter(enemy);
    this.enemies.push(enemy);
  },

  onTouchBegan() {
    // 多段ジャンプ禁止
    return (
      this.floorHeight + AppConstants.CHARACTER_HEIGHT >
      this.playerCharacter.getSprite().getPositionY()
    );
  },

  onTouchEnded() {
    this.playerCharacter
        .getSprite()
        .getBody()
        .applyImpulse(cp.v(0, 500), cp.v(0, 0));
  },

  onCollision() {
    this.isLive = false;
    cc.eventManager.removeAllListeners();

    const next = new ResultScene(this.score);
    // TransitionFadeがときどきこけるので自前で処理
    // const trans = new cc.TransitionFade(1, next, cc.color.RED);

    const action = cc.sequence([
      cc.tintTo(1, 255, 0, 0),
      cc.callFunc(() => {
        cc.director.runScene(next);
      }),
    ]);
    this.bg.runAction(action);
    return true;
  },
};

export const MainScene = createSingleLayerScene(mainLayerProps);
