// boilerplate
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

// variables
let tick = 0;
particles = [];
let numParticles = 750;
let radians = 0;
let radianIncrement = 0.001;
let adjWidth = canvas.width + 300;
// beige, light blue, dark blue, greenish
let colors = ["#FBC6A4", "#3D84B8", "#233E8B", "#1EAE98"];
let alpha = 1;
let mouseDown = false;

// event listeners
addEventListener("mousedown", function(event) {
  mouseDown = true;
});
addEventListener("mouseup", function(event) {
  mouseDown = false;
})

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
function getColor (colors) {
  return colors[randomInt(0, colors.length)];
}

// object definition
function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  // method to draw the particle
  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.shadowColor = this.color;
    c.shadowBlur = 20;
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
}

function addParticles () {
  let x;
  let y;
  let radius;
  let color;
  for (let i = 0; i < numParticles; i++) {
    x = randomInt(-adjWidth / 2, adjWidth / 2);
    y = randomInt(-adjWidth / 2, adjWidth / 2);
    radius = randomInt(1, 4);
    color = getColor(colors);
    particles.push(new Particle(x, y, radius, color));
  }
}

function updateParticles() {
  let part;
  for (let i = 0; i < particles.length; i++) {
    part = particles[i];
    part.draw();
  }
}

function animate() {
  requestAnimationFrame(animate);
  c. fillStyle = `rgba(5,5,5,${alpha})`;
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.translate(canvas.width / 2, canvas.height / 2);
  c.rotate(radians);
  updateParticles();
  c.restore();

  radians += radianIncrement;

  if (mouseDown) {
    if (radianIncrement < 0.009) {
      radianIncrement += 0.00005;
    }
    if (alpha >= 0.01) {
      alpha -= 0.01;
    }
  }
  else if (!mouseDown) {
    if (radianIncrement > 0.001) {
      radianIncrement -= 0.0001;
    }
    if (alpha < 1) {
      alpha += 0.01;
    }
  }
}

addParticles();
animate();
