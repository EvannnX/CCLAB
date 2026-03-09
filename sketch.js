let noiseTime = 0;
let rainLength = 10;
let rainGrowth = 0.5;
let creatureSize = 30;

let isStruck = false;
let strikeTimer = 0;
let strikeLightningFrames = 0;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent('canvas-container');
  frameRate(60);
  noCursor();
}

function draw() {
  if (isStruck) {
    strikeTimer--;
    if (strikeTimer <= 0) {
      isStruck = false; // Revert to normal state after 1 second
    }
  }

  // Creature Movement
  let creatureX;
  let creatureY;
  let interactionPadding = 50;

  if (mouseX > interactionPadding && mouseX < width - interactionPadding && mouseY > interactionPadding && mouseY < height - interactionPadding) {
    creatureX = mouseX + random(-5, 5);
    creatureY = mouseY + random(-5, 5);
  } else {
    creatureX = noise(noiseTime) * width + random(-2, 2);
    creatureY = noise(noiseTime + 1000) * height + random(-2, 2);
    noiseTime = noiseTime + 0.01;
  }

  // Atmosphere & Lighting
  if (strikeLightningFrames > 0) {
    //lightning triggered by mouse click
    background(255, 220, 220); // Background flashes
    stroke(255);
    strokeWeight(5);

    let currentX = random(creatureX - 200, creatureX + 200);
    let currentY = 0;

    while (currentY < creatureY) {
      // to make sure each segment of lightning tends to angle toward the creature
      let nextX = currentX + (creatureX - currentX) * 0.4 + random(-40, 40);
      let nextY = currentY + random(30, 80);

      // to make the lightning connects with the creature
      if (nextY >= creatureY) {
        nextY = creatureY;
        nextX = creatureX;
      }

      line(currentX, currentY, nextX, nextY);
      currentX = nextX;
      currentY = nextY;
    }
    strikeLightningFrames--;

  } else if (random(1) < 0.02) {
    // Normal random background lightning
    background(255, 255, 255);
    stroke(240);
    strokeWeight(4);

    let currentX = random(100, 700);
    let currentY = 0;

    while (currentY < height) {
      let nextX = currentX + random(-50, 50);
      let nextY = currentY + random(20, 80);
      line(currentX, currentY, nextX, nextY);
      currentX = nextX;
      currentY = nextY;
    }

    // Creature absorbs energy during normal lightning
    creatureSize += 2;
    if (creatureSize > 120) {
      creatureSize = 30;
    }

  } else {
    // Normal dark night background
    background(20, 20, 30, 30);
  }

  // Rain
  rainLength = rainLength + rainGrowth;
  if (rainLength > 50 || rainLength < 10) {
    rainGrowth = rainGrowth * -1;
  }

  stroke(138, 43, 226, 200);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    let rainX = random(width);
    let rainY = random(height);
    line(rainX, rainY, rainX, rainY + rainLength);
  }

  // Draw the Creature
  push();
  translate(creatureX, creatureY);

  // sometimes it stuck somehow, couldnt figure out why so added this function(thanks to the help from Eric)
  let displaySize = isStruck ? 100 : creatureSize;
  drawCreature(displaySize);
  pop();
}

// Mouse Click
function mousePressed() {
  isStruck = true;
  strikeTimer = 60;
  strikeLightningFrames = 5;
}
function drawCreature(currentSize) {
  // Body
  drawBody(currentSize);

  // Limbs
  let totalLimbs = 6;
  for (let limbIndex = 0; limbIndex < totalLimbs; limbIndex++) {
    push();
    let rotationAngle = (TWO_PI / totalLimbs) * limbIndex + (frameCount * 0.02);
    rotate(rotationAngle);
    drawLimb(currentSize);
    pop();
  }
}

function drawBody(currentSize) {
  // Switch body outline color based on struck state
  if (isStruck) {
    stroke(255, 50, 50, 220); // Red outline when struck
    strokeWeight(random(2, 4));
  } else if (random(1) < 0.1) {
    stroke(255);
    strokeWeight(random(1, 3));
  } else {
    stroke(100, 200, 255, 200); // Normal light blue outline
    strokeWeight(1.5);
  }

  noFill();
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.2) {
    // Increase breathing speed and jitter intensity when struck
    let speed = isStruck ? 0.5 : 0.1;
    let jitter = isStruck ? random(-25, 35) : random(-15, 25);

    let breathingOffset = sin(frameCount * speed) * 10;
    let bodyRadius = currentSize + breathingOffset + jitter;
    let offsetX = cos(angle) * bodyRadius;
    let offsetY = sin(angle) * bodyRadius;

    vertex(offsetX, offsetY);
  }
  endShape(CLOSE);

  // Core
  if (isStruck) {
    stroke(255, 100, 100, 200); // Red core when struck
  } else {
    stroke(255, 255, 255, 150); // Normal white core
  }
  strokeWeight(random(2, 5));
  point(random(-5, 5), random(-5, 5));
}

function drawLimb(currentSize) {
  // Switch limb color based on struck state
  if (isStruck) {
    stroke(255, 50, 50, 200); // Red limbs when struck
  } else {
    stroke(138, 43, 226, 180); // Normal purple limbs
  }
  strokeWeight(1.5);
  noFill();

  beginShape();
  let startX = currentSize + 5;
  let startY = 0;
  vertex(startX, startY);

  let limbSegmentX = startX;
  let limbSegmentY = startY;
  let totalSegments = 4;

  // Limbs shake much faster when struck
  let shakeSpeed = isStruck ? 0.8 : 0.2;

  for (let segmentIndex = 0; segmentIndex < totalSegments; segmentIndex++) {
    limbSegmentX += random(5, 15);
    limbSegmentY = sin(frameCount * shakeSpeed + segmentIndex) * 10 + random(-5, 5);
    vertex(limbSegmentX, limbSegmentY);
  }
  endShape();

  // Spark at the end of limbs
  if (isStruck) {
    fill(255, 100, 100, 200); // Red sparks
  } else {
    fill(255, 255, 255, 200); // White sparks
  }
  noStroke();
  circle(limbSegmentX, limbSegmentY, random(2, 4));
}