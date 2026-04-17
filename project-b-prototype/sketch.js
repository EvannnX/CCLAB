class BinaryFace {
  constructor() {
    this.gridStep = 10;
    this.glitchIntensity = 0;
    this.glitchTimer = 0;
    this.rowOffsets = [];
  }

  update() {
    this.glitchTimer += 1;
    if (this.glitchTimer > random(30, 120)) {
      this.glitchIntensity = random(0.3, 1.0);
      this.glitchTimer = 0;

      // shift some rows sideways
      this.rowOffsets = [];
      let numRows = floor(cam.height / this.gridStep);
      for (let r = 0; r < numRows; r++) {
        if (random() < 0.15 * this.glitchIntensity) {
          this.rowOffsets.push(random(-30, 30));
        } else {
          this.rowOffsets.push(0);
        }
      }
    }

    // glitch fades out
    this.glitchIntensity = lerp(this.glitchIntensity, 0, 0.03);
  }

  display() {
    if (!cam) return;
    if (cam.width === 0) return;

    cam.loadPixels();
    if (cam.pixels.length === 0) return;

    let s = this.gridStep;

    textFont("monospace");
    textSize(s + 2);
    textAlign(CENTER, CENTER);
    noStroke();

    // scale cam to fill screen
    let scaleFactor = min(width / cam.width, height / cam.height) * 0.85;
    let offsetX = (width - cam.width * scaleFactor) / 2;
    let offsetY = (height - cam.height * scaleFactor) / 2;

    push();
    // mirror
    scale(-1, 1);
    translate(-width, 0);

    // go through webcam pixels
    for (let x = 0; x < cam.width; x += s) {
      for (let y = 0; y < cam.height; y += s) {
        let i = (x + y * cam.width) * 4;
        let r = cam.pixels[i + 0];
        let g = cam.pixels[i + 1];
        let b = cam.pixels[i + 2];
        let br = (r + g + b) / 3;

        // skip dark pixels
        if (br < 30) {
          // nothing
        } else {
          let alpha = map(br, 30, 255, 20, 240);
          let char = "0";
          if (br > 128) {
            if (random() > 0.3) {
              char = "1";
            }
          } else {
            if (random() > 0.7) {
              char = "1";
            }
          }

          // scramble during glitch
          if (random() < this.glitchIntensity * 0.3) {
            if (floor(random(2)) === 0) {
              char = "0";
            } else {
              char = "1";
            }
            alpha = random(50, 255);
          }

          // row shift
          let row = floor(y / s);
          let glitchShift = 0;
          if (row < this.rowOffsets.length) {
            glitchShift = this.rowOffsets[row] * this.glitchIntensity;
          }

          fill(0, 255, 65, alpha);
          let drawX = offsetX + x * scaleFactor + glitchShift;
          let drawY = offsetY + y * scaleFactor;
          text(char, drawX, drawY);
        }
      }
    }

    pop();
  }

  // big glitch when you click
  triggerDestabilize() {
    this.glitchIntensity = 1.0;
    this.rowOffsets = [];
    let numRows = floor(cam.height / this.gridStep);
    for (let r = 0; r < numRows; r++) {
      if (random() < 0.4) {
        this.rowOffsets.push(random(-60, 60));
      } else {
        this.rowOffsets.push(0);
      }
    }
  }
}


let cam;
let face;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
  face = new BinaryFace();
  textFont("monospace");
}

function draw() {
  background(0);
  face.update();
  face.display();
  drawScanlines();
}

// click to trigger glitch
function mousePressed() {
  face.triggerDestabilize();
}

// CRT lines
function drawScanlines() {
  let flicker = noise(frameCount * 0.01) * 20;
  for (let y = 0; y < height; y += 3) {
    stroke(0, 0, 0, 30 + flicker);
    line(0, y, width, y);
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
