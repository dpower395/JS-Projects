// boilerplate
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

// variables
let particles = [];
let tick = 0;
let xSpawn;
let ySpawn;
let tunnelSize = 80;
let tunnelSpeed = 40;
let theta = 0;
let hue = 0;
let hueSpeed = 3;

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

// object definition
function Particle(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: dx,
    y: dy
  }
  this.radius = radius;
  this.color = color;
  this.alpha = 1;
  // method to draw the particle
  this.draw = function() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.fillStyle = this.color;
    c.fill ();
    c.closePath();
    c.restore();
  }
}

// updating particle position, velocity, and alpha
function updateParticles() {
  let part;
  for (let i = 0; i < particles.length; i++) {
    part = particles[i];
    // update position with velocity
    part.x += part.velocity.x;
    part.y += part.velocity.y;
    // if particle is still on screen, draw it
    if (part.x > 0 && part.x < canvas.width && part.y > 0 && part.y < canvas.height) {
      part.draw();
    }
    else {
      particles.splice(i, 1);
    }
  }
}

function addParticles(tick, xSpawn, ySpawn, hue) {
  if (tick % 7 === 0) {
    let numParticles = 60;
    let angleIncrement = Math.PI*2 / numParticles;
    let angle = 0;
    let radius = 5;
    let velocity = {
      x: 0,
      y: 0
    }
    for (let i = 0; i < numParticles; i++) {
      velocity.x = Math.cos(angle)*5;
      velocity.y = Math.sin(angle)*5;
      particles.push(new Particle(xSpawn, ySpawn, velocity.x, velocity.y, radius, `hsl(${hue}, 50%, 50%)`));
      angle += angleIncrement;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,1)"
  c.fillRect(0, 0, canvas.width, canvas.height);
  // update spawn position of particles
  theta = (tick / tunnelSpeed);
  xSpawn = (canvas.width / 2) + Math.cos(theta)*tunnelSize;
  ySpawn = (canvas.height / 2) + Math.sin(theta)*tunnelSize;
  // update spawn color of particles
  hue = Math.floor(tick / hueSpeed) % 361;
  // generate new particles and update position
  addParticles(tick, xSpawn, ySpawn, hue);
  updateParticles();

  tick++;
}

animate();
