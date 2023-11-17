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

const COLORS = [
  [127, 198, 164],
  [51, 30, 54],
  [232, 174, 183],
  [130, 115, 92],
  [124, 198, 254],
];

function randColor(p: p5) {
  const arr = COLORS;
  const c = arr[Math.floor(Math.random() * arr.length)];
  const ans = p.color(c[0], c[1], c[2]);
  return ans;
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

  // completeDiamond(): TriPoints {
  //   return { top: { x: 0, y: 0 }, left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };
  // }

  subPoints(modifier: number): TriPoints {
    let right, left, top;
    if (modifier == -1) {
      right = this.top;
      top = this.left;
      left = { x: this.top.x - (this.top.x - this.left.x) * 2, y: this.top.y };
    } else {
      left = this.top;
      top = this.right;
      right = {
        x: this.top.x + (this.right.x - this.top.x) * 2,
        y: this.top.y,
      };
    }
    return {
      left,
      right,
      top,
    };
  }

  iterRotate() {
    if (this.counter >= 120) {
      return;
    }

    // const around = this.modifier == 1 ? this.left : this.right;
    const around = this.top;
    this.left = rotateAround(
      this.left,
      around,
      2 * Math.PI - (Math.PI / 60) * -this.modifier,
    );
    // this.top = rotateAround(
    //   this.top,
    //   around,
    //   2 * Math.PI - (Math.PI / 60) * this.modifier,
    // );
    this.right = rotateAround(
      this.right,
      around,
      2 * Math.PI - (Math.PI / 60) * -this.modifier,
    );
  }

  mutate() {
    if (this.counter == 60 && this.depth < 3) {
      let subPts = this.subPoints(1);
      const sub1 = new Triangle(
        this.p,
        randColor(this.p),
        subPts.left,
        subPts.top,
        subPts.right,
        1,
        this.depth + 1,
      );

      subPts = this.subPoints(-1);
      const sub2 = new Triangle(
        this.p,
        randColor(this.p),
        subPts.left,
        subPts.top,
        subPts.right,
        -1,
        this.depth + 1,
      );
      this.subtriangles.push(sub1);
      this.subtriangles.push(sub2);
    }
    // if (this.counter == 60 && this.depth == 0) {
    //   const d = this.completeDiamond();
    //   const sub1 = new Triangle(
    //     this.p,
    //     randColor(this.p),
    //     d.left,
    //     d.top,
    //     d.right,
    //     1,
    //     this.depth + 1,
    //   );
    //   this.subtriangles.push(sub1);
    // }
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
      randColor(p),
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
