// boilerplate
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

// variables
let triangles = [];
let tri;
let v;
let angle = (Math.PI/200)
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let centerZ = 0;
let triDist = 200;
let triWidth = 25;
let triX = Math.cos(0.524) * triDist;
let triY = Math.sin(0.524) * triDist;
let halfDistY = (triDist + triY) / 2;

// utility functions
function randomInt(low, high) {
  var multiplier = high - low;
  var rand_int = Math.floor(Math.random() * multiplier);
  rand_int += low;
  return rand_int;
}
function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  let distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  return distance;
}
function crossFromPoints (crossArray) {
  let px = crossArray[0].x;
  let py = crossArray[0].y;
  let pz = crossArray[0].z;
  let qx = crossArray[1].x;
  let qy = crossArray[1].y;
  let qz = crossArray[1].z;
  let rx = crossArray[2].x;
  let ry = crossArray[2].y;
  let rz = crossArray[2].z;
  let ax = qx - px;
  let ay = qy - py;
  let az = qz - pz;
  let bx = rx - px;
  let by = ry - py;
  let bz = rz - pz;
  let cx = (ay * bz) - (by * az);
  let cy = (bx * az) - (ax * bz);
  let cz = (ax * by) - (bx * ay);
  return [cx, cy, cz];
}
function getColor(cross) {
  // light should vary between 20 at 90 degrees and 55 at 0 degrees
  let magnitude = Math.sqrt(Math.pow(cross[0], 2) + Math.pow(cross[1], 2) + Math.pow(cross[2], 2));
  let unitVec = [cross[0] / magnitude, cross[1] / magnitude, cross[2] / magnitude];
  let zAxis = [0, 0, -1];
  let theta = Math.acos(-unitVec[2]) * (180 / Math.PI);
  let light = (((90 - theta) / 90) * 55) + 15;
  return `hsl(53, 100%, ${light}%)`;
}

// object definition
function Point(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
function Triangle(cx, cy, cz, triDist, triWidth) {
  this.cx = cx;
  this.cy = cy;
  this.cz = cz;
  this.triDist = triDist;
  this.triWidth = triWidth;
  this.triX = Math.cos(0.524) * triDist;
  this.triY = Math.sin(0.524) * triDist;
  this.vertices = [
    new Point(this.cx - this.triX, this.cy + this.triY, this.cz - this.triWidth),
    new Point(this.cx + this.triX, this.cy + this.triY, this.cz - this.triWidth),
    new Point(this.cx + 0, this.cy - this.triDist, this.cz - this.triWidth),
    new Point(this.cx - this.triX, this.cy + this.triY, this.cz + this.triWidth),
    new Point(this.cx + this.triX, this.cy + this.triY, this.cz + this.triWidth),
    new Point(this.cx + 0, this.cy - this.triDist, this.cz + this.triWidth),
  ];
  this.frontFace = [this.vertices[0], this.vertices[1], this.vertices[2]];
  this.frontCrossPoints = [this.vertices[0], this.vertices[1], this.vertices[2]];
  this.backFace = [this.vertices[3], this.vertices[4], this.vertices[5]];
  this.backCrossPoints = [this.vertices[3], this.vertices[5], this.vertices[4]];
  this.topLeftFace = [this.vertices[0], this.vertices[2], this.vertices[5], this.vertices[3]];
  this.topLeftCrossPoints = [this.vertices[0], this.vertices[2], this.vertices[3]];
  this.bottomFace = [this.vertices[0], this.vertices[3], this.vertices[4], this.vertices[1]];
  this.bottomCrossPoints = [this.vertices[0], this.vertices[3], this.vertices[1]];
}

// animation functions
function rotation(v1, v2, c1, c2, angle) {
  let dist = getDistance(v1, v2, c1, c2);
  let gamma = Math.acos((v1 - c1) / dist);
  if ((v2 - c2) < 0) {
    gamma = -gamma;
  }
  let new1 = dist * Math.cos(angle + gamma);
  let new2 = dist * Math.sin(angle + gamma);
  v1 = new1 + c1;
  v2 = new2 + c2;
  return [v1, v2];
}
function drawFace(thisCrossArray, thisFaceArray) {
  let thisCross = crossFromPoints(thisCrossArray);
  if (thisCross[2] < 0) {
    c.fillStyle = getColor(thisCross);
    c.beginPath();
    c.moveTo(thisFaceArray[0].x, thisFaceArray[0].y);
    for (let i = 1; i < thisFaceArray.length; i++) {
      c.lineTo(thisFaceArray[i].x, thisFaceArray[i].y);
    }
    c.closePath();
    c.fill();
  }
}


function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // iterate through each triangle
  for (let n = 0; n < triangles.length; n++) {
    tri = triangles[n];
    // rotate about z-axis
    for (let i = 0; i < tri.vertices.length; i++) {
      v = tri.vertices[i];
      let newCoords = rotation(v.x, v.y, tri.cx, tri.cy, angle);
      v.x = newCoords[0];
      v.y = newCoords[1];
    }
    // rotate about y-axis
    for (let i = 0; i < tri.vertices.length; i++) {
      v = tri.vertices[i];
      let newCoords = rotation(v.x, v.z, tri.cx, tri.cz, angle);
      v.x = newCoords[0];
      v.z = newCoords[1];
    }
    // rotate about x-axis
    for (let i = 0; i < tri.vertices.length; i++) {
      v = tri.vertices[i];
      let newCoords = rotation(v.y, v.z, tri.cy, tri.cz, angle);
      v.y = newCoords[0];
      v.z = newCoords[1];
    }

    // drawing all four faces
    drawFace(tri.frontCrossPoints, tri.frontFace);
    drawFace(tri.backCrossPoints, tri.backFace);
    drawFace(tri.topLeftCrossPoints, tri.topLeftFace);
    drawFace(tri.bottomCrossPoints, tri.bottomFace);
  }
}

// top triangle
triangles.push(new Triangle(centerX, centerY - halfDistY, centerZ, triDist, triWidth));
// left triangle
triangles.push(new Triangle(centerX - triX, centerY + halfDistY, centerZ, triDist, triWidth));
// right triangle
triangles.push(new Triangle(centerX + triX, centerY + halfDistY, centerZ, triDist, triWidth));




animate();
