import MersenneTwister from 'mersenne-twister';

import {TbmStorage} from '@/core/TbmStorage';
import {TbmCharacter} from '@/core/TbmCharacter';
import {ResultScene} from '@/scene/ResultScene';

import {RESOURCE_MAP} from '@/resource';
import {AppConstants} from '@/core/constants';
import {CHARACTER_SET_MAP} from '@/core/caharacter-def';

const GRAVITY = cc.winSize.height * 3;
const JUMP_FORCE = cc.winSize.height * 1.5;

/**
 * @typedef MainLayerProps
 * @property {string} chosenChatacterName;
 * @property {number} score
 * @property {number} enemyWait 次の敵が出現するまでの待ち時間
 * @property {boolean} isLive
 * @property {number} floorHeight
 *
 * @property {MersenneTwister} mt
 * @property {cp.Space} space
 * @property {cc.Sprite} bg
 * @property {boolean} areJointedFloorAndCharacter
 * @property {cc.PinJoint} jointFloorAndCharacter
 * @property {cc.LabelTTF} scoreLabel
 * @property {cc.LabelTTF} grazeLabel
 * @property {TbmCharacter} playerCharacter
 * @property {TbmCharacter[]} enemies;
 */

/** @type {cc.Layer & MainLayerProps} */
const mainLayerProps = {
  ctor(chosenChatacterName) {
    this._super();

    this.chosenChatacterName = chosenChatacterName;

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
    bg.setScale(AppConstants.BASE_SCALE);
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
    cc.audioEngine.playMusic(RESOURCE_MAP.BGM_Main_mp3, true);
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
    this.addChild(highScoreLabel);

    this.scoreLabel = scoreLabel;
  },

  /** 物理エンジン周りの初期化 */
  initPhysics() {
    const space = new cp.Space();
    space.gravity = cp.v(0, -GRAVITY);
    if ('production' !== process.env.NODE_ENV) {
      const phDebugNode = new cc.PhysicsDebugNode(space);
      phDebugNode.setVisible(true);
      this.addChild(phDebugNode, 100);
    }

    const floorHeight = (cc.winSize.height * 15) / 100;
    const floor = new cp.BoxShape2(
        new cp.StaticBody(),
        new cp.BB(0, 0, cc.winSize.width, floorHeight)
    );
    floor.setFriction(1);
    // 床の弾性係数をゼロにしないとジャンプの反動を食らう
    floor.setElasticity(0);
    space.addStaticShape(floor);
    this.floorHeight = floorHeight;
    this.floorShape = floor;

    space.addCollisionHandler(
        AppConstants.COLLISION_TYPE_PLAYER,
        AppConstants.COLLISION_TYPE_ENEMY,
        this.onCollision.bind(this)
    );

    this.space = space;
  },

  initPlayerCharacter() {
    const pc = new TbmCharacter(
        CHARACTER_SET_MAP[this.chosenChatacterName].playerCharacterDef,
        0,
        false
    );
    const pcShape = pc.getShape();
    pcShape.setCollisionType(AppConstants.COLLISION_TYPE_PLAYER);
    this.addCharacter(pc);

    const pcBody = pcShape.getBody();
    pcBody.setMoment(Number.POSITIVE_INFINITY); // 回転無効
    const joint = new cp.PinJoint(
        pcBody,
        this.floorShape.getBody(),
        cp.v(0, 0),
        cp.v(pcBody.getPos().x, this.floorHeight)
    );
    this.space.addConstraint(joint);
    this.jointFloorAndCharacter = joint;
    this.areJointedFloorAndCharacter = true;

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
    this.updatePlayerCharacter();
    this.space.step(dt);

    // 背景画像のスクロール. 1万点ごとに10%加速
    this.bg.setPositionX(
        this.bg.getPositionX() - 2 - 0.2 * Math.floor(this.score / 10000)
    );
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

  updatePlayerCharacter() {
    if (!this.isLive) {
      // 衝突ハンドラ内では変更ができないので
      if (this.areJointedFloorAndCharacter) {
        this.areJointedFloorAndCharacter = false;
        this.space.removeConstraint(this.jointFloorAndCharacter);
        const pcShape = this.playerCharacter.getShape();
        // getMass()はない...
        const pcShapeBox = pcShape.getBB();
        // 回転を有効にする
        pcShape
            .getBody()
            .setMoment(
                cp.momentForBox(
                    1,
                    pcShapeBox.r - pcShapeBox.l,
                    pcShapeBox.t - pcShapeBox.b
                )
            );
      }
    } else {
      const pcBody = this.playerCharacter.getSprite().getBody();
      // マシンに十分な性能がないと
      // (多分Space.step()に渡したdtの大きさによる)
      // 弾性係数を0にしてもたまに床にバウンドするので、
      // ある程度まで落下したら自機を床と接続してしまう
      if (
        !this.areJointedFloorAndCharacter &&
        0 > pcBody.getVel().y &&
        this.floorHeight + AppConstants.CHARACTER_HEIGHT / 4 > pcBody.getPos().y
      ) {
        this.space.addConstraint(this.jointFloorAndCharacter);
        this.areJointedFloorAndCharacter = true;
      }
    }
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
    const enemyDefs = CHARACTER_SET_MAP[this.chosenChatacterName].enemyDefs;
    const enemyDef = enemyDefs[this.mt.random_int() % enemyDefs.length];
    let flightLevel = 0;
    if (enemyDef.flying) {
      flightLevel =
        (AppConstants.CHARACTER_HEIGHT *
          AppConstants.BASE_SCALE *
          (this.mt.random_int() % 3)) /
        2;
    }
    const enemy = new TbmCharacter(enemyDef, flightLevel, true);

    enemy.getShape().setCollisionType(AppConstants.COLLISION_TYPE_ENEMY);
    const body = enemy.getSprite().getBody();
    body.velocity_func = () => {}; // 重力を無効化
    body.setPos(cp.v(cc.winSize.width, body.getPos().y));
    // 1万点(約10秒)ごとに初期速度の10%加速
    const velocity = 150 + 15 * Math.floor(this.score / 10000);
    body.setVel(cp.v(-velocity, 0));
    this.addCharacter(enemy);
    this.enemies.push(enemy);
  },

  isAbleToJump() {
    // 床にバウンドする不具合を根絶するまで身長の半分までは許容
    return (
      this.floorHeight +
        this.playerCharacter.getSprite().getContentSize().height / 2 >
      this.playerCharacter.getSprite().getPositionY()
    );
  },

  onTouchBegan() {
    return this.isAbleToJump();
  },

  onTouchEnded() {
    if (!this.isAbleToJump()) {
      return;
    }
    this.space.removeConstraint(this.jointFloorAndCharacter);
    this.areJointedFloorAndCharacter = false;
    this.playerCharacter
        .getSprite()
        .getBody()
        .setVel(cp.v(0, JUMP_FORCE));
    // .applyImpulse(cp.v(0, JUMP_FORCE), cp.v(0, 0));
    // applyImpulse()だと連打すると1タップ毎に加速がついてしまう
    cc.audioEngine.playEffect(RESOURCE_MAP.SE_Jump);
  },

  onCollision() {
    if (this.isLive) {
      this.isLive = false;
      cc.eventManager.removeAllListeners();

      const next = new ResultScene(this.score, this.chosenChatacterName);
      // TransitionFadeがときどきこけるので自前で処理
      // const trans = new cc.TransitionFade(1, next, cc.color.RED);

      const action = cc.sequence([
        cc.tintTo(1, 255, 0, 0),
        cc.callFunc(() => {
          cc.director.runScene(next);
        }),
      ]);
      this.bg.runAction(action);

      cc.audioEngine.stopMusic();
    }
    cc.audioEngine.playEffect(RESOURCE_MAP.SE_Shock_mp3);
    return true;
  },
};

/** @type {cc.Scene} */
const mainSceneProps = {
  ctor(chosenCharacterName) {
    this._super();
    this.chosenCharacterName = chosenCharacterName;
  },
  onEnter() {
    this._super();
    const LayerClass = cc.Layer.extend(mainLayerProps);
    const layer = new LayerClass(this.chosenCharacterName);
    this.addChild(layer);
  },
};

export const MainScene = cc.Scene.extend(mainSceneProps);
