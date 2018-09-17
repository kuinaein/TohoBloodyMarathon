declare namespace cc {
  export const ALIGN_CENTER;
  export const ALIGN_TOP;
  export const ALIGN_TOP_RIGHT;
  export const ALIGN_RIGHT;
  export const ALIGN_BOTTOM_RIGHT;
  export const ALIGN_BOTTOM;
  export const ALIGN_BOTTOM_LEFT;
  export const ALIGN_LEFT;
  export const ALIGN_TOP_LEFT;

  export const winSize: Size;

  export function p(x: number, y: number): Point;
  export function size(w: number, h: number): Size;
  export function rect(x: number, y: number, w: number, h: number): Rect;
  export const color: {
  (r: number | string | Color, g?: number, b?: number, a?: number): Color;
  readonly WHITE: Color;
  readonly YELLOW: Color;
  readonly BLUE: Color;
  readonly GREEN: Color;
  readonly RED: Color;
  readonly MAGENTA: Color;
  readonly BLACK: Color;
  readonly ORANGE: Color;
  readonly GRAY: Color;
  };

  export function pDistance(point1: Point, point2: Point): number;
  export function pDistanceSQ(point1: Point, point2: Point): number;
  export function rectContainsPoint(rect: Rect, point: Point): boolean;
  export function rectContainsRect(rect: Rect, point: Rect): boolean;

  export function follow(followedNode: Node, rect: Rect): Follow | null;
  export function callFunc(
    selector: () => void,
    selectorTarget?: object | null,
    data?: any | null
  );

  export function fadeTo(duration: number, opacity: number): FadeTo;
  export function tintTo(
    duration: number,
    red: number,
    green: number,
    blue: number
  ): TintTo;
  export function blink(duration: number, blinks: number): Blink;
  export function sequence(
    tempArray: FiniteTimeAction[] | FiniteTimeAction
  ): Sequence;
  export function repeat(action: FiniteTimeAction, times: number): Repeat;
  export function repeatForever(action: FiniteTimeAction): RepeatForever;

  export class Point {
    public x: number;
    public y: number;
    public constructor(x: number, y: number);
  }

  export class Size {
    public width: number;
    public height: number;
    public constructor(width: number, height: number);
  }

  export class Rect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public constructor(x: number, y: number, width: number, height: number);
  }

  export class Touch {
    public getLocation(): Point;
  }

  export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;
    public constructor(r: number, g: number, b: number, a: number);
  }

  export class FontDefinition {}

  export class Class {
    public static extend(props): typeof Class;
    public _super(...args): any;
  }

  export class SpriteFrame extends Class {
    public constructor(
      filename: string | Texture2D,
      rect: Rect,
      rotated?: boolean,
      offset?: Point,
      originalSize?: Size
    );
    public getRect(): Rect;
    public setRect(rect: Rect);
    public getRectInPixels(): Rect;
    public clone(): SpriteFrame;
    public copy(): SpriteFrame;
  }

  export class Texture2D extends Class {
    public setTexParameters(
      texParams: {
      minFilter;
      magFilter;
      wrapS;
      wrapT;
      },
      magFilter?,
      wrapS?,
      wrapT?
    );
  }

  export class Event extends Class {}
  export class EventTouch extends Event {}

  export class EventListener extends Class {
    public static readonly ACCELERATION;
    public static readonly CUSTOM;
    public static readonly FOCUS;
    public static readonly KEYBOARD;
    public static readonly MOUSE;
    public static readonly TOUCH_ALL_AT_ONCE;
    public static readonly TOUCH_ONE_BY_ONE;
    public static readonly UNKNOWN;
  }

  export class _EventListenerTouchOneByOne extends EventListener {
    public swallowTouches: boolean;
    public onTouchBegan(touch: Touch, event: EventTouch);
    public onTouchMoved(touch: Touch, event: EventTouch);
    public onTouchEnded(touch: Touch, event: EventTouch);
    public onTouchCancelled(touch: Touch, event: EventTouch);
  }

  export class Action extends Class {
    public setTag(tag: number);
  }

  export class Follow extends Action {}
  export class FiniteTimeAction extends Action {}

  export class ActionInstant extends FiniteTimeAction {}
  export class CallFunc extends ActionInstant {}

  export class ActionInterval extends FiniteTimeAction {}
  export class FadeTo extends ActionInterval {}
  export class TintTo extends ActionInterval {}
  export class Blink extends ActionInterval {}

  export class Animate extends ActionInterval {
    public constructor(animation: Animation);
  }

  export class Sequence extends ActionInterval {}
  export class Repeat extends ActionInterval {}
  export class RepeatForever extends ActionInterval {}

  export class Animation extends Class {
    public constructor(frames: SpriteFrame[], delay: number, loops?: number);
    public setRestoreOriginalFrame(restOrigFrame: boolean);
  }

  export class Node extends Class {
    public x: number;
    public y: number;

    public getParent(): Node;
    public getChildren(): Node[];
    public getTag(): number;
    public setTag(tag: number);

    public setAnchorPoint(point: Point | number, y?: number);
    public getContentSize(): Size;
    public setContentSize(size: Size | number, height?: number);
    public getPosition(): Point;
    public getPositionX(): number;
    public getPositionY(): number;
    public setPosition(newPosOrxValue: Point | number, yValue: number);
    public setPositionX(x: number);
    public setPositionY(y: number);
    public getBoundingBox(): Rect;
    public getBoundingBoxToWorld(): Rect;
    public getScale(): number;
    public setScale(scale: number, scaleY?: number);
    public getScaleX(): number;
    public setScaleX(newScaleX: number);
    public getScaleY(): number;
    public setScaleY(newScaleY: number);
    public setColor(color: Color);

    public setVisible(visible: boolean);
    public setOpacity(opacity: number);
    public addChild(child: Node, localZOrder?: number, tag?: number | string);
    public removeChild(child: Node, cleanup?: boolean);
    public scheduleUpdate();

    public getActionManager(): ActionManager;
    public getActionByTag(tag: number);
    public runAction(action: Action);
    public stopAction(action: Action);
    public stopActionByTag(tag: number);
  }

  export class ParallaxNode extends Node {
    public addChild(child: Node, z: number, ratio: Point, offset: Point);
  }

  export class Sprite extends Node {
    public constructor(
      fileName: string | SpriteFrame | HTMLImageElement | cc.Texture2D,
      rect?: Rect,
      rotated?: boolean
    );

    public getSpriteFrame(): SpriteFrame;
    public getTexture(): Texture2D;
    public setTextureRect(
      rect: Rect,
      rotated?: boolean,
      untrimmedSize?: Size,
      needConvert?: boolean
    );
  }

  export class PhysicsSprite extends Sprite {
    public constructor(fileName: string | Texture2D | SpriteFrame, rect: rect);
    public setBody(body: cp.Body);
    public getBody(): cp.Body;
  }

  export class LabelTTF extends Sprite {
    public constructor(
      text: string,
      fontName?: string | FontDefinition,
      fontSize?: number,
      dimensions?: Size,
      hAlignment?: number,
      vAlignment?: number
    );

    public setString(text: string);
    public setFontFillColor(fillColor: Color);
    public enableShadow(shadowColor: Color, offset: Size, blurRadius: number);
  }

  export class DrawNode extends Node {
    public drawPoly(
      verts: Point[],
      fillColor?: Color,
      lineWidth?: number,
      lineColor?: Color
    );

    public drawRect(
      origin: Point,
      destination: Point,
      fillColor: Colir,
      lineWidth: Number,
      lineColor: Color
    );

    public drawDot(pos: Point, radius: number, color: Color);

    public drawCircle(
      center: Point,
      radius: number,
      angle: number,
      segments: number,
      drawLineToCenter: boolean,
      lineWidth: number,
      color: Color
    );
  }

  export class Layer extends Node {}
  export class LayerColor extends Layer {
    public constructor(color?: Color, width?: number, height?: number);
  }

  export class Scene extends Node {
    public create(): Scene;
  }

  export class TransitionScene extends Scene {}

  export class TransitionFade extends TransitionScene {
    public constructor(t: number, scene: Scene, color: Color);
  }

  export class ActionManager {
    public addAction(action: Action, target: Node, paused: boolean);
  }

  export class PhysicsDebugNode extends DrawNode {
    public constructor(space: cp.Space);
  }

  class EventManager {
    public addListener(
      listener: EventListener & {event?: any},
      nodeOrPriority: Node | number
    ): EventListener;

    public removeAllListeners();
  }
  export const eventManager: EventManager;

  class Director {
    public runScene(scene: Scene);
    public pushScene(scene: Scene);
    public popScene();
    public setDisplayStats(displayStats: boolean);
  }
  export const director: Director;

  class SpriteFrameCache {
    public addSpriteFrames(
      url: string,
      texture?: HTMLImageElement | Texture2D | string
    );
    public getSpriteFrame(name: string): SpriteFrame;
  }
  export const spriteFrameCache: SpriteFrameCache;

  class AudioEngine {
    public playEffect(url: string, loop?: boolean): number | null;
    public playMusic(url: string, loop?: boolean): number | null;
    public stopMusic(releaseData?: boolean);
  }
  export const audioEngine: AudioEngine;
}
