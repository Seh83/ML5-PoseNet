// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */

// Grab elements, create settings, etc.
var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// The detected positions will be inside an array
let poses = [];

let callbacks = {
  architecture: "ResNet50",
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: false,
  minConfidence: 0.5,
  maxPoseDetections: 5,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "single",
  inputResolution: 513,
  multiplier: 0.75,
  quantBytes: 2,
};

let callbacks2 = {
  architecture: "ResNet50",
  outputStride: 32,
  inputResolution: { width: 257, height: 200 },
  quantBytes: 2,
  detectionType: "single",
};

leftHighX = 0;
rightLowX = 0;

//Create a webcam capture
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
//     video.srcObject = stream;
//     video.play();
//   });
// }

// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet
// is not detecting a position
function drawCameraIntoCanvas() {
  // Draw the video element into the canvas
  ctx.drawImage(video, 0, 0, 640, 480);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  window.requestAnimationFrame(drawCameraIntoCanvas);
}
// Loop over the drawCameraIntoCanvas function
//drawCameraIntoCanvas();

// Create a new poseNet method with a single detection
const poseNet = ml5.poseNet(video, modelReady, callbacks2);
poseNet.on("pose", gotPoses);

// A function that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}

function modelReady() {
  console.log("model ready");
  drawCameraIntoCanvas();
  poseNet.singlePose(video);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < poses.length; i += 1) {
    for (let j = 0; j < poses[i].pose.keypoints.length; j += 1) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        // ctx.beginPath();
        // ctx.strokeStyle = "#FF0000";
        // ctx.stroke();
      }
      if (keypoint.part == "rightShoulder") {
        if (rightLowX == 0) {
          rightLowX = keypoint.position.x - keypoint.position.x * 0.1;
        } else {
          if (keypoint.position.x < rightLowX) {
            rightLowX = keypoint.position.x;
          }
        }
        ctx.beginPath();
        ctx.strokeStyle = "#98fb00";
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.moveTo(rightLowX, keypoint.position.y);
        ctx.lineTo(rightLowX, keypoint.position.y + 50);
        ctx.stroke();
        ctx.moveTo(rightLowX, keypoint.position.y);
        ctx.lineTo(rightLowX, keypoint.position.y - 50);
        ctx.stroke();
      }

      if (keypoint.part == "leftShoulder") {
        if (leftHighX == 0) {
          leftHighX = keypoint.position.x + keypoint.position.x * 0.1;
        } else {
          if (keypoint.position.x > leftHighX) {
            leftHighX = keypoint.position.x;
          }
        }

        ctx.beginPath();
        ctx.strokeStyle = "#98fb00";
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.moveTo(leftHighX, keypoint.position.y);
        ctx.lineTo(leftHighX, keypoint.position.y + 50);
        ctx.stroke();
        ctx.moveTo(leftHighX, keypoint.position.y);
        ctx.lineTo(leftHighX, keypoint.position.y - 50);
        ctx.stroke();
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  //Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j += 1) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      ctx.beginPath();
      ctx.moveTo(partA.position.x, partA.position.y);
      ctx.lineTo(partB.position.x, partB.position.y);
      ctx.stroke();
    }
  }
}

function drawBoundaries() {}

function Original_drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j += 1) {
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.strokeStyle = "#FF0000";
        //ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }
}