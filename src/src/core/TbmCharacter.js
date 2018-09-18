import {AppConstants} from '@/core/constants';

// eslint-disable-next-line no-unused-vars
import {CharacterDef} from '@/core/caharacter-def';

/** キャラクタ */
export class TbmCharacter {
  /**
   * @param {CharacterDef} def
   * @param {number} flightLevel 飛行高度
   * @param {boolean} isEnemy
   */
  constructor(def, flightLevel, isEnemy) {
    this.def = def;
    this.flightLevel = flightLevel;

    const baseRect = cc.rect(
        AppConstants.CHARACTER_WIDTH * this.def.col * 3,
        AppConstants.CHARACTER_HEIGHT * (this.def.row * 4 + (isEnemy ? 3 : 1)),
        AppConstants.CHARACTER_WIDTH,
        AppConstants.CHARACTER_HEIGHT
    );

    const spriteFrame = new cc.SpriteFrame(this.def.imageFilename, baseRect);
    const sprite = new cc.PhysicsSprite(spriteFrame);
    sprite.setScale(this.def.scale);
    sprite.setAnchorPoint(cc.p(0.5, 0));
    const bodyWidth = AppConstants.CHARACTER_WIDTH * 0.5 * this.def.scale;
    const bodyHeight = AppConstants.CHARACTER_HEIGHT * 0.8 * this.def.scale;
    const bodyOffsetY = AppConstants.CHARACTER_HEIGHT * 0.1 * this.def.scale;
    const body = new cp.Body(1, cp.momentForBox(1, bodyWidth, bodyHeight));
    body.setPos(cp.v((cc.winSize.width * 1) / 10, 0));
    this.shape = new cp.BoxShape2(
        body,
        new cp.BB(
            -(bodyWidth / 2),
            bodyOffsetY,
            bodyWidth / 2,
            bodyOffsetY + bodyHeight
        )
    );
    this.shape.setElasticity(1);
    this.shape.setFriction(1);
    sprite.setBody(body);

    this.sprite = sprite;
    this._initAnimation();
  }

  /** アニメーション処理の初期設定 */
  _initAnimation() {
    const baseSpriteFrame = this.getSprite().getSpriteFrame();
    const baseRect = baseSpriteFrame.getRect();
    const animeFrames = [];
    for (let i = 0; i < 3; ++i) {
      const frame = baseSpriteFrame.clone();
      frame.setRect(
          cc.rect(
              baseRect.x + i * AppConstants.CHARACTER_WIDTH,
              baseRect.y,
              baseRect.width,
              baseRect.height
          )
      );
      animeFrames.push(frame);
    }
    const anime = new cc.Animation(animeFrames, 0.1);
    anime.setRestoreOriginalFrame(true);
    this.sprite.runAction(cc.repeatForever(new cc.Animate(anime)));
  }

  /** @return {CharacterDef} */
  getDef() {
    return this.def;
  }

  /** @return {number} */
  getFlightLevel() {
    return this.flightLevel;
  }

  /** @return {cc.PhysicsSprite} */
  getSprite() {
    return this.sprite;
  }

  /** @return {cp.Shape} */
  getShape() {
    return this.shape;
  }
}
