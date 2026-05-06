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

    textSize(s + 2);
    noStroke();

    // scale cam to fill screen
    let scaleFactor = min(width / cam.width, height / cam.height) * 0.85;
    let offsetX = (width - cam.width * scaleFactor) / 2;
    let offsetY = (height - cam.height * scaleFactor) / 2;
    let textRed = map(communicationLevel, 0, 1, 0, 255);
    let textGreen = map(communicationLevel, 0, 1, 255, 30);
    let textBlue = map(communicationLevel, 0, 1, 65, 20);
    let cameraShiftX = 0;
    let cameraShiftY = 0;
    let cameraGlitchChance = 0.05 + this.glitchIntensity * 0.12 + communicationLevel * 0.08;

    if (random() < cameraGlitchChance) {
      cameraShiftX = random(-width * 0.04, width * 0.04);
      cameraShiftY = random(-height * 0.06, height * 0.06);
    }

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

        // skip darker pixels so only the brighter face area becomes binary text
        if (br < 150) {
          // nothing
        } else {
          let alpha = map(br, 30, 255, 20, 240);
          let char = "0";
          if (br > 228) {
            if (random() > 0.3) {
              char = "1";
            }
          } else {
            if (random() > 0.7) {
              char = "1";
            }
          }

          // voice makes the face data change faster
          if (random() < communicationLevel * 0.85) {
            if (random() > 0.5) {
              char = "1";
            } else {
              char = "0";
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

          fill(textRed, textGreen, textBlue, alpha);
          let drawX = offsetX + x * scaleFactor + glitchShift + cameraShiftX;
          let drawY = offsetY + y * scaleFactor + cameraShiftY;
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

class DataFlow {
  constructor() {
    this.reset();
  }

  reset() {
    this.laneX = [];
    this.laneY = [];
    this.laneSpeed = [];
    this.laneLength = [];
    this.laneSize = [];
    this.laneAlpha = [];
    this.laneCurve = [];
    this.laneCount = floor(random(5, 14));
    this.laneSpacing = random(10, 22);
    this.step = random(12, 20);
    this.baseY = random(height * 0.08, height * 0.92);
    this.baseSize = random(9, 16);
    this.baseAlpha = random(25, 85);

    if (random() > 0.5) {
      this.direction = 1;
      this.startX = random(-width * 0.9, -width * 0.15);
    } else {
      this.direction = -1;
      this.startX = random(width * 1.15, width * 1.9);
    }

    let centerLane = (this.laneCount - 1) / 2;
    for (let i = 0; i < this.laneCount; i++) {
      let distanceFromCenter = abs(i - centerLane);
      let maxDistance = centerLane;
      let taper = 1;

      if (maxDistance > 0) {
        taper = 1 - distanceFromCenter / maxDistance;
      }

      let speedType = random();
      let laneSpeed = 1;

      if (speedType < 0.35) {
        laneSpeed = random(0.35, 1.3);
      } else if (speedType < 0.75) {
        laneSpeed = random(1.8, 4.2);
      } else {
        laneSpeed = random(5.0, 9.5);
      }

      this.laneX[i] = this.startX - this.direction * distanceFromCenter * random(12, 42);
      this.laneY[i] = this.baseY + (i - centerLane) * this.laneSpacing;
      this.laneSpeed[i] = laneSpeed;
      this.laneLength[i] = floor(10 + taper * random(22, 58));
      this.laneSize[i] = this.baseSize * random(0.85, 1.18);
      this.laneAlpha[i] = this.baseAlpha * random(0.55, 1.35);
      this.laneCurve[i] = random(-0.012, 0.012);
    }
  }

  update() {
    let offscreenCount = 0;
    let speedBoost = 1 + communicationLevel * 8;

    for (let i = 0; i < this.laneCount; i++) {
      let soundJump = random(0, communicationLevel * 9);
      this.laneX[i] += this.direction * (this.laneSpeed[i] * speedBoost + soundJump);

      if (this.direction === 1) {
        if (this.laneX[i] - this.laneLength[i] * this.step > width * 1.25) {
          offscreenCount += 1;
        }
      } else {
        if (this.laneX[i] + this.laneLength[i] * this.step < -width * 0.25) {
          offscreenCount += 1;
        }
      }
    }

    if (offscreenCount === this.laneCount) {
      this.reset();
    }
  }

  display() {
    noStroke();
    let soundGlow = 1 + communicationLevel * 3;
    let dataRed = map(communicationLevel, 0, 1, 0, 255);
    let dataGreen = map(communicationLevel, 0, 1, 255, 25);
    let dataBlue = map(communicationLevel, 0, 1, 65, 15);

    for (let lane = 0; lane < this.laneCount; lane++) {
      textSize(this.laneSize[lane]);

      for (let i = 0; i < this.laneLength[lane]; i++) {
        let px = this.laneX[lane] - this.direction * i * this.step;
        let py = this.laneY[lane] + i * i * this.laneCurve[lane];
        let fade = map(i, 0, this.laneLength[lane] - 1, 1, 0.04);
        let char = "0";

        if (random() > 0.5) {
          char = "1";
        } else {
          char = "0";
        }

        if (i === 0) {
          fill(dataRed + 80, dataGreen, dataBlue + 60, this.laneAlpha[lane] * 1.8 * soundGlow);
        } else if (random() > 0.86) {
          fill(dataRed, dataGreen * 0.8, dataBlue + 80, this.laneAlpha[lane] * fade * soundGlow);
        } else {
          fill(dataRed, dataGreen, dataBlue, this.laneAlpha[lane] * fade * soundGlow);
        }

        text(char, px, py);
      }
    }
  }
}


let cam;
let face;
let randomVal;
let bgMusic;
let dataFlows = [];
let mic;
let micStarted = false;
let micLevel = 0;
let communicationLevel = 0;
let handPoseModel;
let hands = [];
let helloX = [];
let helloY = [];
let helloTimer = 0;
let lastHandTriggerFrame = -240;
let helloAlreadyPlayed = false;

function preload() {
  bgMusic = loadSound("processing.mp3");
  if (typeof ml5 !== "undefined" && ml5.handPose) {
    handPoseModel = ml5.handPose({ flipped: true });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
  mic = new p5.AudioIn();
  face = new BinaryFace();
  createDataFlows();
  textAlign(CENTER, CENTER);
  randomVal = floor(random(60, 240));
  makeHelloText();
  startHandTracking();
  startBackgroundMusic();
  startMic();
}

function draw() {
  background(0);
  updateSoundInput();
  drawDataFlows();
  face.update();
  face.glitchIntensity = max(face.glitchIntensity, communicationLevel * 0.9);
  face.display();
  updateHandGesture();
  fadeForHello();
  showHelloText();
  drawScanlines();

  if (frameCount % randomVal > randomVal * 0.9) {
    face.triggerDestabilize();
    randomVal = floor(random(60, 240));
  }
}

function createDataFlows() {
  dataFlows = [];
  let flowCount = max(8, floor((width * height) / 70000));

  for (let i = 0; i < flowCount; i++) {
    dataFlows.push(new DataFlow());
  }
}

function drawDataFlows() {
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "rgba(0, 255, 110, 0.38)";

  for (let flow of dataFlows) {
    flow.update();
    flow.display();
  }

  drawingContext.shadowBlur = 0;
}

// click to trigger glitch
function mousePressed() {
  startBackgroundMusic();
  startMic();
  face.triggerDestabilize();
}

function startBackgroundMusic() {
  if (!bgMusic || bgMusic.isPlaying()) return;

  userStartAudio().then(function () {
    bgMusic.setLoop(true);
    bgMusic.setVolume(0.45);
    bgMusic.play();
  });
}

function startMic() {
  if (micStarted) return;

  userStartAudio().then(function () {
    mic.start();
    micStarted = true;
  });
}

function updateSoundInput() {
  if (micStarted) {
    micLevel = mic.getLevel();
  } else {
    micLevel = 0;
  }

  let targetLevel = map(micLevel, 0, 0.18, 0, 1);
  targetLevel = constrain(targetLevel, 0, 1);
  communicationLevel = lerp(communicationLevel, targetLevel, 0.2);

  if (communicationLevel > 0.65) {
    if (frameCount % 12 === 0) {
      face.triggerDestabilize();
    }
  }
}

function startHandTracking() {
  if (handPoseModel && handPoseModel.detectStart) {
    handPoseModel.detectStart(cam, gotHands);
  }
}

function gotHands(results) {
  hands = results;
}

function updateHandGesture() {
  if (helloAlreadyPlayed) return;
  if (frameCount - lastHandTriggerFrame < 180) return;

  if (hands.length > 0) {
    helloTimer = 150;
    helloAlreadyPlayed = true;
    face.triggerDestabilize();
    lastHandTriggerFrame = frameCount;
  }
}

function makeHelloText() {
  helloX = [];
  helloY = [];
  let pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(0);
  pg.fill(255);
  pg.textAlign(CENTER, CENTER);
  pg.textStyle(BOLD);
  pg.textSize(min(width * 0.12, 80));
  pg.text("HELLO HUMAN", width / 2, height / 2);
  pg.loadPixels();

  for (let x = 0; x < width; x += 10) {
    for (let y = 0; y < height; y += 10) {
      let i = (x + y * width) * 4;
      if (pg.pixels[i] > 100) {
        helloX.push(x);
        helloY.push(y);
      }
    }
  }
}

function showHelloText() {
  if (helloTimer <= 0) return;

  helloTimer -= 1;
  let shake = 2;
  let alpha = 0;

  if (helloTimer > 110) {
    alpha = map(helloTimer, 150, 110, 0, 255);
  } else {
    alpha = 255;
  }

  if (helloTimer < 70) {
    shake = map(helloTimer, 70, 0, 2, 45);
  }

  if (helloTimer < 30) {
    alpha = map(helloTimer, 30, 0, 255, 0);
  }

  textSize(14);
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = "rgba(0, 255, 110, 0.8)";

  for (let i = 0; i < helloX.length; i++) {
    fill(0, 255, 90, alpha);
    text(random(["0", "1"]), helloX[i] + random(-shake, shake), helloY[i] + random(-shake, shake));
  }

  drawingContext.shadowBlur = 0;
}

function fadeForHello() {
  if (helloTimer <= 0) return;

  let blackAlpha = 0;
  if (helloTimer > 110) {
    blackAlpha = map(helloTimer, 150, 110, 0, 210);
  } else if (helloTimer > 30) {
    blackAlpha = 210;
  } else {
    blackAlpha = map(helloTimer, 30, 0, 210, 0);
  }

  fill(0, blackAlpha);
  rect(0, 0, width, height);
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
  createDataFlows();
  makeHelloText();
}
