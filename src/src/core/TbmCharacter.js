import {AppConstants} from '@/core/constants';
import {RESOURCE_MAP} from '@/resource';

/** キャラクタ */
export class TbmCharacter {
  /**
   * @param {number} row
   * @param {number} col
   * @param {number} scale
   * @param {number} flightLevel
   */
  constructor(row, col, scale, flightLevel) {
    this.flightLevel = flightLevel;

    const resourece = RESOURCE_MAP.ChireidenCharacters_png;
    const baseRect = cc.rect(
        AppConstants.CHARACTER_WIDTH * col * 3,
        AppConstants.CHARACTER_HEIGHT * row,
        AppConstants.CHARACTER_WIDTH,
        AppConstants.CHARACTER_HEIGHT
    );

    const spriteFrame = new cc.SpriteFrame(resourece, baseRect);
    const sprite = new cc.PhysicsSprite(spriteFrame);
    sprite.setScale(scale);
    sprite.setAnchorPoint(cc.p(0.5, 0));
    const bodyWidth = AppConstants.CHARACTER_WIDTH * 0.5 * scale;
    const bodyHeight = AppConstants.CHARACTER_HEIGHT * 0.8 * scale;
    const bodyOffsetY = AppConstants.CHARACTER_HEIGHT * 0.1 * scale;
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
