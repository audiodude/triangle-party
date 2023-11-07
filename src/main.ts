import './style.css';
import p5 from 'p5';

class Triangle {
  private subtriangles: Triangle[] = [];

  constructor(
    private readonly p: p5,
    private readonly color: p5.Color,
    private x1: number,
    private y1: number,
    private x2: number,
    private y2: number,
    private x3: number,
    private y3: number,
  ) {}

  draw() {
    this.p.fill(this.color);
    this.p.triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
  }

  mutate() {
    this.color.setBlue(Math.random() * 255);
  }
}

const sketch = (p: p5) => {
  const triangles: Triangle[] = [];

  p.setup = () => {
    p.createCanvas(1280, 720);
    const t = new Triangle(
      p,
      p.color(30, 40, 150),
      520,
      400,
      640,
      280,
      780,
      400,
    );
    triangles.push(t);
    const t2 = new Triangle(
      p,
      p.color(30, 100, 150),
      320,
      200,
      440,
      80,
      580,
      200,
    );
    triangles.push(t2);
  };

  p.draw = () => {
    p.background(0);
    for (const t of triangles) {
      t.mutate();
      t.draw();
    }
  };
};

export const myp5 = new p5(sketch, document.body);
