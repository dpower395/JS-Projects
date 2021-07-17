// boilerplate
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

// variables
let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};
let particles = [];
let curPart;
let colors = ["#00587A", "#5EAAA8", "#ECB390"];

// event listeners
addEventListener("mousemove", function(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

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
function randColor (colors) {
  return colors[randomInt(0, colors.length)];
}

// object definition
function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.prev = {x: x, y: y};
  this.lastMouse = {x: x, y: y};
  this.radius = radius;
  this.color = color;
  this.radians = Math.random() * Math.PI * 2;
  this.velocity = Math.random() * 0.03 + 0.02;
  this.distance = randomInt(70, 170);

  this.draw = function() {
    c.beginPath();
    c.strokeStyle = this.color;
    c.lineWidth = this.radius;
    c.moveTo(this.prev.x, this.prev.y);
    c.lineTo(this.x, this.y);
    c.stroke();
    c.closePath();
  }
}

function addParticles() {
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(canvas.width / 2, canvas.height / 2, Math.random()*3 + 0.5, randColor(colors)));
  }
}

function updateParticles() {
  for (let i = 0; i < particles.length; i++) {
    curPart = particles[i];
    // gives drag effect to particles, used with this.draw
    curPart.prev.x = curPart.x;
    curPart.prev.y = curPart.y;
    // delays movement of circle, smoother drag effect
    curPart.lastMouse.x += (mouse.x - curPart.lastMouse.x) * 0.05;
    curPart.lastMouse.y += (mouse.y - curPart.lastMouse.y) * 0.05;
    // circular motion
    curPart.radians += curPart.velocity;
    curPart.x = curPart.lastMouse.x + (curPart.distance * Math.cos(curPart.radians));
    curPart.y = curPart.lastMouse.y + (curPart.distance * Math.sin(curPart.radians));
    curPart.draw();
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = 'rgba(255, 255, 255, 0.05)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  updateParticles();

}

addParticles();
animate();
