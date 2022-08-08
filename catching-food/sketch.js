// Snowfall
// Edited Video: https://youtu.be/cl-mHFCGzYk

let snow = []; //存放调整好大小的食物
let gravity;

let zOff = 0;

let spritesheet;
let textures = []; //存放食物素材

let song

// ml5 Face Detection Model
let faceapi;
let detections = [];
// Video
let video;
const faceOptions = { 
  withLandmarks: true, 
  withExpressions: false, 
  withDescriptors: false 
};


function preload() { //加载食物图片
  spritesheet = loadImage('Ghostpixxells_pixelfood.png'); 
  //song = loadSound('2019-01-02_-_8_Bit_Menu_-_David_Renda_-_FesliyanStudios.com.mp3')
  song = new Audio('2019-01-02_-_8_Bit_Menu_-_David_Renda_-_FesliyanStudios.com.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight); //画布大小跟随窗口
  gravity = createVector(0, 0.8); //设定重力
  for (let x = 0; x < spritesheet.width; x += 32) { //创建食物
    for (let y = 0; y < spritesheet.height; y += 32) { //这个spritsheet是72px的
      let img = spritesheet.get(x, y, 32, 32); //获取食物图片
      image(img, x, y);  //取(x, y)处的图片
      textures.push(img); //放在textures里
    }
  }

  for (let i = 0; i < 30; i++) { //生成30个食物
    let x = random(width);
    let y = random(height);
    let design = random(textures);
    snow.push(new Snowflake(x, y, design));  //最终生成的图片放入snow里
  }

  song.play()
  //准备camera
  video = createCapture(VIDEO);
  //video.size(1280, 720);
  video.size(windowWidth, windowHeight);
  video.hide(); //让video显示在canvas上而不是堆叠元素
  faceapi = ml5.faceApi(video, faceOptions, faceReady); //调用api
}

let mouthPos;
function draw() {
  background(0, 255, 0);
  //draw the video
  image(video, 0, 0, width, width * video.height / video.width);
  // Just look at the first face and draw all the points
  if (detections) {
    if (detections.length > 0) {
      // drawBox(detections);
      mouthPos = drawLandmarks(detections);
    }
  }

  zOff += 0.1;
  for (let i = 0; i < snow.length; i += 1){
    flake = snow[i]
  //for (flake of snow) {
    let xOff = flake.pos.x / width;
    let yOff = flake.pos.y / height;
    let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle);
    if(mouthPos){
      eat(mouthPos,flake,i);
    }
    wind.mult(0.01);
    flake.applyForce(gravity);
    flake.applyForce(wind);
    flake.update();
    flake.render(); 
  }
}

function faceReady() {
  faceapi.detect(gotFaces);
}

// Got faces
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  detections = result;
  faceapi.detect(gotFaces);
}

function drawLandmarks(detections) {
  noFill();
  stroke(161, 95, 251);
  strokeWeight(2);
  for (let i = 0; i < detections.length; i += 1) {
    const mouth = detections[i].parts.mouth;
    // const nose = detections[i].parts.nose;
    // const leftEye = detections[i].parts.leftEye;
    // const rightEye = detections[i].parts.rightEye;
    // const rightEyeBrow = detections[i].parts.rightEyeBrow;
    // const leftEyeBrow = detections[i].parts.leftEyeBrow;
    drawPart(mouth, true);
    // drawPart(nose, false);
    // drawPart(leftEye, true);
    // drawPart(leftEyeBrow, false);
    // drawPart(rightEye, true);
    // drawPart(rightEyeBrow, false);
    return mouth
  }
}

function drawPart(feature, closed) {
  beginShape();
  for (let i = 0; i < feature.length; i += 1) {
    const x = feature[i]._x;
    const y = feature[i]._y;
    vertex(x, y);
  }
  if (closed === true) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}

/*
    (20) [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t]
    0: t {_x: 381.36963665067253, _y: 629.4752191867425} //left
    1: t {_x: 410.2859987194179, _y: 620.8114822826221}
    2: t {_x: 445.48517347347195, _y: 619.686169866293} 
    3: t {_x: 467.2968996842662, _y: 620.2688872517696}
    4: t {_x: 486.4269581164165, _y: 616.2210155925166} //top
    5: t {_x: 536.2775984512025, _y: 621.0875765359722}
    6: t {_x: 579.6388654440656, _y: 631.1881722591271} //right
    7: t {_x: 522.6876537289332, _y: 637.7984452131165}
    8: t {_x: 489.5312073242863, _y: 653.8182385401747}
    9: t {_x: 463.10713322613583, _y: 659.0082169499743} //bottom
    10: t {_x: 434.93733937350737, _y: 649.4695642509282}
    11: t {_x: 403.7869522757717, _y: 643.1434376283385}
    12: t {_x: 387.939997814913, _y: 632.2040454317944}
    13: t {_x: 440.57035035755223, _y: 629.0579605022153}
    14: t {_x: 469.32285540774944, _y: 632.8177748207303}
    15: t {_x: 500.5405637437166, _y: 629.2288946162384}
    16: t {_x: 567.1372777817371, _y: 627.1317193852672}
    17: t {_x: 492.6625767146021, _y: 638.5820044310858}
    18: t {_x: 462.10333149942335, _y: 639.2681335046558}
    19: t {_x: 437.52563066010384, _y: 634.9885690510117}
    length: 20
    [[Prototype]]: Array(0)
*/
/*
  513.971476660703 553.5555472314327 
  561.1548219514382 713.6897757227368
*/

let score = 0;
let $score = document.querySelector('#score')
function eat(mouth, flake, i){
  //print(mouth)
  let top = 999999;
  let bottom = -1;
  let left = 999999;
  let right = -1;
  for (point of mouth){
    top = min(top, point._y);
    bottom = max(bottom, point._y);
    left = min(left, point._x);
    right = max(right, point._x);
  }
  //if (top < flake.pos.y < bottom){
  if (flake.pos.y > top & flake.pos.y < bottom){
    //print('y:', top, flake.pos.y, bottom);
    //if (left < flake.pos.x < right){
    if (flake.pos.x > left & flake.pos.x < right){
      //print('x:', left, flake.pos.x, right);
        score +=1;
        $score.innerHTML = score;
        if (i > -1) { // only splice array when item is found
          snow.splice(i, 1); // 2nd parameter means remove one item only
        }
    }
  }
}
