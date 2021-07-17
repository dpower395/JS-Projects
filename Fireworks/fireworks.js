// boilerplate
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

// variables
let particles = [];
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}
const gravity = 0.005;
const friction = 0.999;

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
    // update velocity with friction
    part.velocity.x = part.velocity.x * friction;
    part.velocity.y = part.velocity.y * friction;
    // update velocity with gravity
    part.velocity.y += gravity;
    // update position with velocity
    part.x += part.velocity.x;
    part.y += part.velocity.y;
    // if alpha of particle is not too low, decrement and draw
    if (part.alpha > 0.003) {
      part.alpha -= 0.002;
      part.draw();
    }
    // if alpha of particle is too low, delete it
    else {
      particles.splice(i, 1);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.05)"
  c.fillRect(0, 0, canvas.width, canvas.height);

  updateParticles();

}

animate();

// creating particles
addEventListener("click", function(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  let velocity = {
    x: 0,
    y: 0
  };
  const numParticles = 500;
  const angleIncrement = Math.PI*2 / numParticles;
  let angle = 0;
  for (let i = 0; i < numParticles; i++) {
    velocity.x = Math.cos(angle) * Math.random()*4;
    velocity.y = Math.sin(angle) * Math.random()*4;
    let hue = randomInt(0, 361);
    particles.push(new Particle(mouse.x, mouse.y, velocity.x, velocity.y, 3, `hsl(${hue}, 50%, 50%)`));
    angle += angleIncrement;
  }
});
