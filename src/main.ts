import './style.css';
import * as p5 from 'p5';

const sketch = (p: p5) => {
  let x = 100;
  let y = 100;

  p.setup = () => {
    p.createCanvas(200, 200);
  };

  p.draw = () => {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);
  };
};

export const myp5 = new p5(sketch, document.body);
