declare const gl: WebGLRenderingContext;

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

  export function fadeTo(duration: number, opacity: number): FadeTo;
  export function blink(duration: number, blinks: number): Blink;
  export function sequence(
    tempArray: FiniteTimeAction[] | FiniteTimeAction
  ): Sequence;
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

  export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;
    public constructor(r: number, g: number, b: number, a: number);
  }

  export class FontDefinition {}

  export class Class {
    public extend(props): typeof Class;
  }

  export class SpriteFrame extends Class {}
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

  export class EventListener extends Class {
    public readonly ACCELERATION;
    public readonly CUSTOM;
    public readonly FOCUS;
    public readonly KEYBOARD;
    public readonly MOUSE;
    public readonly TOUCH_ALL_AT_ONCE;
    public readonly TOUCH_ONE_BY_ONE;
    public readonly UNKNOWN;
  }

  export class Action extends Class {}

  export class FiniteTimeAction extends Action {}

  export class ActionInterval extends FiniteTimeAction {}

  export class FadeTo extends ActionInterval {}

  export class Blink extends ActionInterval {}

  export class Sequence extends ActionInterval {}

  export class RepeatForever extends ActionInterval {}

  export class Node extends Class {
    public x: number;
    public y: number;

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
    public setScale(scale: number, scaleY?: number);
    public setScaleX(newScaleX: number);
    public setScaleY(newScaleY: number);

    public addChild(child: Node, localZOrder?: number, tag?: number | string);
    public scheduleUpdate();
    public runAction(action: Action);
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

    public getTexture(): Texture2D;
    public setTextureRect(
      rect: Rect,
      rotated?: boolean,
      untrimmedSize?: Size,
      needConvert?: boolean
    );
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
  }

  export class Layer extends Node {}
  export class LayerColor extends Layer {}

  export class Scene extends Node {
    public create(): Scene;
  }

  class EventManager {
    public addListener(
      listener: EventListener | object,
      nodeOrPriority: Node | number
    ): EventListener;

    public removeAllListeners();
  }
  export const eventManager: EventManager;

  class Director {
    public runScene(scene: Scene);
  }
  export const director: Director;
}
