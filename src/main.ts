import './style.css';
import p5 from 'p5';

class Triangle {
  constructor(
    private readonly p: p5,
    private x1: number,
    private y1: number,
    private x2: number,
    private y2: number,
    private x3: number,
    private y3: number,
  ) {}

  draw() {
    this.p.triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
  }

  mutate() {
    this.x1 += -5 + Math.random() * 10;
    this.y1 += -5 + Math.random() * 10;
    this.x2 += -5 + Math.random() * 10;
    this.y2 += -5 + Math.random() * 10;
    this.x3 += -5 + Math.random() * 10;
    this.y3 += -5 + Math.random() * 10;
  }
}

const sketch = (p: p5) => {
  const triangles: Triangle[] = [];

  p.setup = () => {
    p.createCanvas(1280, 720);
    const t = new Triangle(p, 520, 400, 640, 280, 780, 400);
    triangles.push(t);
  };

  p.draw = () => {
    p.background(0);
    p.fill(255);
    for (const t of triangles) {
      t.mutate();
      t.draw();
    }
  };
};

export const myp5 = new p5(sketch, document.body);
