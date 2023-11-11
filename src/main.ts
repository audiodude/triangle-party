import './style.css';
import p5 from 'p5';

declare interface Point {
  x: number;
  y: number;
}

declare interface TriPoints {
  left: Point;
  top: Point;
  right: Point;
}

function rotatePoint(n: Point, rotation: number): Point {
  return {
    x: n.x * Math.cos(rotation) - n.y * Math.sin(rotation),
    y: n.x * Math.sin(rotation) + n.y * Math.cos(rotation),
  };
}

function rotateAround(n: Point, origin: Point, rotation: number): Point {
  const point = rotatePoint({ x: n.x - origin.x, y: n.y - origin.y }, rotation);
  return {
    x: point.x + origin.x,
    y: point.y + origin.y,
  };
}

class Triangle {
  private subtriangles: Triangle[] = [];
  private counter = 0;

  constructor(
    private readonly p: p5,
    private readonly color: p5.Color,
    public left: Point,
    public top: Point,
    public right: Point,
    private modifier = 1,
    private depth = 0,
  ) {}

  draw() {
    this.counter++;
    this.p.fill(this.color);
    this.p.triangle(
      this.left.x,
      this.left.y,
      this.top.x,
      this.top.y,
      this.right.x,
      this.right.y,
    );

    for (const sub of this.subtriangles) {
      sub.draw();
    }
  }

  subPoints(modifier: number): TriPoints {
    const right = this.top;
    const top = this.left;
    let left = this.right;
    const distX = (right.x - left.x) / 2;
    const distY = (right.y - right.y) / 2;
    return {
      left: { x: left.x + distX * modifier, y: left.y + distY * modifier },
      right,
      top,
    };
  }

  iterRotate() {
    if (this.counter > 49) {
      return;
    }

    const around = this.modifier == 1 ? this.left : this.right;
    this.left = rotateAround(this.left, around, 2 * Math.PI - Math.PI / 100);
    this.top = rotateAround(
      this.top,
      around,
      2 * Math.PI - (Math.PI / 100) * -this.modifier,
    );
    this.right = rotateAround(
      this.right,
      around,
      2 * Math.PI - (Math.PI / 100) * -this.modifier,
    );
  }

  mutate() {
    if (this.counter == 60 && this.depth < 2) {
      let subPts = this.subPoints(1);
      const sub1 = new Triangle(
        this.p,
        this.p.color(Math.random() * 256),
        subPts.left,
        subPts.top,
        subPts.right,
        1,
        this.depth + 1,
      );

      subPts = this.subPoints(-1);
      const sub2 = new Triangle(
        this.p,
        this.p.color(30, 150, 30),
        subPts.left,
        subPts.top,
        subPts.right,
        -1,
        this.depth + 1,
      );
      console.log(sub1);
      this.subtriangles.push(sub1);
      this.subtriangles.push(sub2);
    }
    for (const sub of this.subtriangles) {
      sub.mutate();
      sub.iterRotate();
    }
  }
}

const sketch = (p: p5) => {
  const triangles: Triangle[] = [];

  p.setup = () => {
    p.createCanvas(1280, 720);
    p.frameRate(30);
    p.strokeWeight(0);

    const t = new Triangle(
      p,
      p.color(30, 100, 150),
      { x: 520, y: 400 },
      { x: 640, y: 198 },
      { x: 760, y: 400 },
    );
    triangles.push(t);
  };

  p.draw = () => {
    p.background(0);
    for (const t of triangles) {
      t.draw();
      t.mutate();
    }
  };
};

export const myp5 = new p5(sketch, document.body);
