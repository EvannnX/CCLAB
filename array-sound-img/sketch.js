let backsound;
let sounds = [];

function preload() {
  backsound = loadSound("sounds/00.mp3");
  for (let i = 1; i <= 8; i++) {
    sounds.push(loadSound("my-sounds/0" + i + ".mp3"));
  }
}

let x = [];
let y = [];

function setup() {
  createCanvas(400, 400);
  //backsound.loop();
}

function draw() {
  background(220);
  for (let i = 0; i < x.length; i++) {
    drawCircle(x[i], y[i]);
  }
}

function drawCircle(x, y) {
  fill(0);
  circle(x, y, 50);
}

function mousePressed() {
  x.push(mouseX);
  y.push(mouseY);
  let index = (x.length - 1) % sounds.length;
  sounds[index].play();
}
