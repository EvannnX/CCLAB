let mySound;
let mySound1;
let x = 0;
let speed = 5;

function preload() {
    // Files are located in the "sounds" folder, not "assets"
    mySound = loadSound("sounds/beat.mp3");
    mySound1 = loadSound("sounds/kick.mp3");
}

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);
    fill(0);
    circle(x, height / 2, 30);
    x += speed;

    if (x > width) {
        speed = -speed;
        mySound.play();
    }
    if (x < 0) {
        speed = -speed;
        mySound1.play();
    }
}
