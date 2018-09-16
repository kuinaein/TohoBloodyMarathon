declare namespace cp {
  export function v(x: number, y: number): Vect;

  export class Vect {
    public x: number;
    public y: number;
    public constructor(x: number, y: number);
  }

  export class Space {
    public gravity: Vect;
    public step(dt: number);
  }
}
