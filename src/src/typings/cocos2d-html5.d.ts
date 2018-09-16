declare namespace cc {
  export const winSize: Size;

  export function p(x: number, y: number): Point;
  export function size(w: number, h: number): Size;
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

  export class Size {
    public width: number;
    public height: number;
    public constructor(width: number, height: number);
  }

  export class Point {
    public x: number;
    public y: number;
    public constructor(x: number, y: number);
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

    public addChild(child: Node, localZOrder?: number, tag?: number | string);
    public runAction(action: Action);
  }

  export class Sprite extends Node {}

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
