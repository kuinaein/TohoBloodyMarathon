declare namespace cp {
  export function v(x: number, y: number): Vect;
  export function momentForBox(
    m: number,
    width: number,
    height: number
  ): number;

  export class Vect {
    public x: number;
    public y: number;
    public constructor(x: number, y: number);
  }

  export class Shape {}

  export class SegmentShape {
    public constructor(body: Body, a: Vect, b: Vect, r: number);
  }

  export class PolyShape extends Shape {}

  export class BoxShape extends PolyShape {
    public constructor(body: cp.Body, width: number, height: number);
  }

  export class Body {
    public constructor(m: number, i: number);
    public kineticEnergy(): number;
    public setPos(pos: Vect);
    public applyImpulse(j: Vect, r: Vect);
  }

  export class StaticBody extends Body {}

  export class Space {
    public gravity: Vect;
    public addBody(body: Body): Body;
    public addShape(shape: Shape): Shape;
    public addStaticShape(shape: shape): Shape;
    public step(dt: number);
  }
}
