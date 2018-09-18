declare namespace cp {
  export function v(x: number, y: number): Vect;
  export function momentForBox(
    m: number,
    width: number,
    height: number
  ): number;
  export function momentForBox2(m: number, box: PolyShape): number;

  export class Vect {
    public x: number;
    public y: number;
    public constructor(x: number, y: number);
  }

  export class BB {
    public l: number;
    public b: number;
    public r: number;
    public t: number;
    public constructor(l: number, b: number, r: number, t: number);
  }

  export class Arbiter {}

  export class Shape {
    public getBB(): BB;
    public setCollisionType(collision_type: number);
    public setFriction(u: number);
    public setElasticity(e: number);
    public getBody(): Body;
  }

  export class SegmentShape extends Shape {
    public constructor(body: Body, a: Vect, b: Vect, r: number);
  }

  export class PolyShape extends Shape {
    public getVert(i: number): Vect;
  }

  export class BoxShape extends PolyShape {
    public constructor(body: cp.Body, width: number, height: number);
  }
  export class BoxShape2 extends PolyShape {
    public constructor(body: cp.Body, box: BB);
  }

  export class Body {
    public constructor(m: number, i: number);
    public kineticEnergy(): number;
    public eachShape(func: (shape: cp.Shape) => void);
    public getPos(): Vect;
    public setPos(pos: Vect);
    public getVel(): Vect;
    public setVel(velocity: vect);
    public setMoment(moment: number);
    public applyImpulse(j: Vect, r: Vect);
    public velocity_func(gravity: Vect, damping: number, dt: number);
  }

  export class StaticBody extends Body {}

  export class Constraint {}

  export class PinJoint extends Constraint {
    public constructor(a: Body, b: Body, anchr1: Vect, anchr2: Vect);
  }

  export class Space {
    public gravity: Vect;
    public addBody(body: Body): Body;
    public removeBody(body: Body);
    public addShape(shape: Shape): Shape;
    public removeShape(shape: Shape);
    public addStaticShape(shape: shape): Shape;
    public addCollisionHandler(
      a: number,
      b: number,
      begin?: (arb: Arbiter, space: Space) => boolean,
      preSolve?: (arb: Arbiter, space: Space) => void,
      postSolve?: (arb: Arbiter, space: Space) => boolean,
      separate?: (arb: Arbiter, space: Space) => void
    );
    public addConstraint(constraint: Constraint): Constraint;
    public removeConstraint(constraint: Constraint);
    public step(dt: number);
  }
}
