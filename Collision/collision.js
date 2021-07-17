// selecting canvas element from html
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

// variables
var tick = 0;
var particles = [];
var colors = ["#D9ADAD", "#84A9AC", "#89C9B8"];
let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

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
function randomColor() {
  return colors[randomInt(0, colors.length)];
}
function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  let distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  return distance;
}

// creating particle object
function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: Math.random()*4 - 2,
    y: Math.random()*4 - 2
  }
  this.radius = radius;
  this.color = color;
  this.opacity = 0;
  // method to draw the particle
  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }
}

// add particles to the stack
function addParticles() {
  for (let i = 0; i < 400; i++) {
    var p_radius = 20;
    var p_x = randomInt(p_radius + 5, canvas.width - p_radius - 5);
    var p_y = randomInt(p_radius + 5, canvas.height - p_radius - 5);
    var p_color = randomColor();
    // ensure particles don't spawn on top of each other
    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (getDistance(particles[j].x, particles[j].y, p_x, p_y) < (p_radius * 2) + 1) {
          p_x = randomInt(p_radius, canvas.width - p_radius);
          p_y = randomInt(p_radius, canvas.height - p_radius);
          j = -1;
        }
      }
    }
    particles.push(new Particle(p_x, p_y, p_radius, p_color));
  }
}

// particle collision function
function particleBounce(part1, part2) {
  // get m1 and m2 from the radii
  let m1 = Math.pow(part1.radius, 2);
  let m2 = Math.pow(part2.radius, 2);
  // get the unit vector of collision from part1's perspective
  // (subtract part2's position vector by part1's position vector)
  let colVec = [(part2.x - part1.x), (part2.y - part1.y)];
  let magnitude = Math.sqrt(Math.pow(colVec[0], 2) + Math.pow(colVec[1], 2));
  colVec = [colVec[0]/magnitude, colVec[1]/magnitude];
  // get in part2's reference frame to get velocity vector
  // (subract part1's and part2's velocity vector by part2' velocity vector)
  let part1_v = [part1.velocity.x - part2.velocity.x, part1.velocity.y - part2.velocity.y];
  let part2_v = [0, 0];
  // prevent stickies
  if ((part1_v[0] * (part2.x - part1.x)) + (part1_v[1] * (part2.y - part1.y)) >= 0) {
    // do the dot product of velocity with unit collision vector
    let dotProd = (part1_v[0] * colVec[0]) + (part1_v[1] * colVec[1]);
    // then multiply by unit collision vector
    let projection = [colVec[0] * dotProd, colVec[1] * dotProd];
    // take this vector and multiply by 2m1 / (m1 + m2)
    part2_adj = (2 * m1) / (m1 + m2);
    part2_v[0] += ((part2_adj * projection[0]) + part2.velocity.x);
    part2_v[1] += ((part2_adj * projection[1]) + part2.velocity.y);
    // this gets you the velocity imparted to part2
    // take the vector and multiply it by (m1 - m2)/(m1 + m2)
    part1_adj = (2 * m2) / (m1 + m2);
    part1_v[0] += (-(part1_adj * projection[0]) + part2.velocity.x);
    part1_v[1] += (-(part1_adj * projection[1]) + part2.velocity.y);
    // this gets the velocity taken from part1
    // add back the part2 velocity vector to both and you're done
    part1.velocity.x = part1_v[0];
    part1.velocity.y = part1_v[1];
    part2.velocity.x = part2_v[0];
    part2.velocity.y = part2_v[1];
  }
}

// animation function to update particle positions and draw
function updateParticles(particles) {
  for (let i = 0; i < particles.length; i++) {
    let curpart = particles[i];
    // particle collision detection
    for (let j = 0; j < particles.length; j++) {
      if (j === i) {continue;}
      let dist = getDistance(curpart.x, curpart.y, particles[j].x, particles[j].y);
      if (dist < (curpart.radius + particles[j].radius)) {
        particleBounce(curpart, particles[j]);
      }
    }
    // wall collision detection
    if (curpart.x <= curpart.radius || curpart.x >= canvas.width - curpart.radius) {
      curpart.velocity.x = -curpart.velocity.x;
    }
    if (curpart.y <= curpart.radius || curpart.y >= canvas.height - curpart.radius) {
      curpart.velocity.y = -curpart.velocity.y;
    }
    // mouse collision detection
    if (getDistance(mouse.x, mouse.y, curpart.x, curpart.y) <= 200 && curpart.opacity < 0.3) {
      curpart.opacity += 0.02;
    }
    else if (getDistance(mouse.x, mouse.y, curpart.x, curpart.y) > 200 && curpart.opacity > 0) {
      curpart.opacity = 0;
    }
    // update position from velocity
    curpart.x += curpart.velocity.x;
    curpart.y += curpart.velocity.y;
    // draw the particle
    curpart.draw();
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  updateParticles(particles);

  tick++;
}

addParticles();
animate();
