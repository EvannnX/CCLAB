let boxingcats = [];
let catX = [];
let catY = [];
let catSpeedX = [];
let catSpeedY = [];

let curCat = 0;
let numCats = 2;
let punchSound;

function preload() {
  for (let i = 1; i <= 4; i++) {
    boxingcats.push(loadImage(i + ".png"));
  }
  punchSound = loadSound('punchsound.mp3');
}

function setup() {
  createCanvas(800, 500);

  eraseBg(boxingcats, 10);


  for (let i = 0; i < numCats; i++) {
    if (i === 0) {
      catX.push(random(100, 350));
    } else {
      catX.push(random(450, 700));
    }
    catY.push(random(100, 400));
    catSpeedX.push(random(-3, 3));
    catSpeedY.push(random(-3, 3));
  }
}

function draw() {
  background(255);

  // boxingcat animation only has 4 frames
  curCat = floor((frameCount / 10) % 4);

  for (let i = 0; i < numCats; i++) {
    catX[i] += catSpeedX[i];
    catY[i] += catSpeedY[i];

    if (i === 0) {
      if (catX[i] < 50 || catX[i] > width / 2 - 20) {
        catSpeedX[i] = catSpeedX[i] * -1;
      }
    } else {
      if (catX[i] < width / 2 + 20 || catX[i] > width - 50) {
        catSpeedX[i] = catSpeedX[i] * -1;
      }
    }

    if (catY[i] < 50 || catY[i] > height - 50) {
      catSpeedY[i] = catSpeedY[i] * -1;
    }

    for (let j = i + 1; j < numCats; j++) {
      let d = dist(catX[i], catY[i], catX[j], catY[j]);
      
      if (d < 120) {
        if (!punchSound.isPlaying()) {
          punchSound.play();
        }
      }
    }
    push();
    imageMode(CENTER);
    translate(catX[i], catY[i]);
    if (i === 1) {
      scale(-1, 1);
    }
    image(
      boxingcats[curCat],
      0,
      0,
      boxingcats[0].width * 0.25,
      boxingcats[0].height * 0.25
    );
    pop();
  }
}

// You shouldn't need to modify these helper functions:

function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 10) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned
}

// 现代浏览器禁止网页自动播放声音（防止广告扰民）
// 所以在 p5.js 中，需要在用户点击鼠标后才能开始播放声音
function mousePressed() {
  userStartAudio(); // 强制告诉浏览器允许播放
  if (!punchSound.isPlaying()) {
    punchSound.loop(); // 开始循环播放背景音乐
  }
}
