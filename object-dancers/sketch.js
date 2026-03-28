/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new EvanDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class EvanDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.bounceY = 0;
    this.armAngle = 0;
    this.eyeColor = 0;
    this.logo = loadImage('48309331.png');
    this.legAngle = 0;
    this.headAngle = 0;
  }
  update() {
    this.bounceY = sin(frameCount * 0.08) * 6;
    this.legAngle = sin(frameCount * 0.1) * 0.3;
    this.armAngle = sin(frameCount * 0.1) * 1.0 - radians(90);
    this.x = this.x + sin(frameCount * 0.05) * 2;

    let totalMillis = millis();
    let secondsTime = totalMillis / 1000;
    let cycleTime = 10;
    let currentTime = secondsTime % cycleTime;

    if (currentTime < 3) {
      this.headAngle = (currentTime / 3) * TWO_PI;
    } else if (currentTime < 5) {
      this.headAngle = 0;
    } else if (currentTime < 8) {
      let spinTime = currentTime - 5;
      this.headAngle = (1 - (spinTime / 3)) * TWO_PI;
    } else {
      this.headAngle = 0;
    }

    if (frameCount % 60 < 30) {
      this.eyeColor = color(30);
    } else {
      this.eyeColor = color(220, 40, 40);
    }
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️

    translate(0, this.bounceY);
    scale(1.5);

    strokeWeight(2);
    stroke(80);

    push();
    translate(-28, -42);
    rotate(-this.armAngle);
    fill(100, 180, 255);
    rect(-6, 0, 12, 36, 4);
    pop();

    push();
    translate(28, -42);
    rotate(this.armAngle);
    fill(100, 180, 255);
    rect(-6, 0, 12, 36, 4);
    pop();

    fill(70, 140, 210);
    push();
    translate(-14, 8);
    rotate(-this.legAngle);
    rect(-8, 0, 16, 30, 4);
    pop();

    push();
    translate(14, 8);
    rotate(this.legAngle);
    rect(-8, 0, 16, 30, 4);
    pop();

    fill(100, 180, 255);
    rect(-30, -50, 60, 60, 6);

    image(this.logo, -21, -41, 42, 42);

    push();
    translate(0, -68);
    rotate(this.headAngle);

    fill(180, 220, 255);
    rect(-22, -22, 44, 44, 6);

    fill(this.eyeColor);
    noStroke();
    rect(-14, -12, 10, 8, 2);
    rect(4, -12, 10, 8, 2);

    fill(30);
    rect(-10, 6, 20, 5, 2);

    stroke(180, 220, 255);
    strokeWeight(2);
    line(0, -22, 0, -37);
    fill(255, 220, 80);
    noStroke();
    circle(0, -40, 8);
    pop();

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    // this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/