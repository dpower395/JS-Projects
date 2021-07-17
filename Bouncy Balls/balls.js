// javascript-canvas boilerplate
var canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var c = canvas.getContext("2d");

// declaring random variables
var ballArray = [];
var tick = 0;
var acc = 1;
var friction = 0.98;
var colors = ["#52006A", "#CD113B", "#FF7600", "#FFA900"];

// defining the Ball object
function Ball(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;
  // method to draw the ball
  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  // method to update ball's position
  this.update = function() {
    // check if it hit the floor
    if (this.y + this.radius >= canvas.height && this.dy > 0) {
      this.dy = -this.dy * friction;
    }
    else {this.dy += acc;}
    // check if it hit the walls
    if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
      this.dx = -this.dx;
    }
    this.y += this.dy;
    this.x += this.dx;
  }
}

// return random number in a range
function randomInt(low, high) {
  var multiplier = high - low;
  var rand_int = Math.floor(Math.random() * multiplier);
  rand_int += low;
  return rand_int;
}

// function to create balls
function addBall() {
  var ball_x = randomInt(50, canvas.width - 50);
  var ball_y = randomInt(50, canvas.height - 50);
  var ball_dx = randomInt(-10, 10);
  var ball_color = colors[randomInt(0, colors.length)];
  var ball_radius = randomInt(30, 50);
  ballArray.push(new Ball(ball_x, ball_y, ball_dx, 0, ball_radius, ball_color));
}

//function to update balls' position
function updateBalls() {
  for (let i = 0; i < ballArray.length; i++) {
    ballArray[i].update();
  }
}

//function to draw balls
function drawBalls() {
  for (let i = 0; i < ballArray.length; i++) {
    ballArray[i].draw();
  }
}

// animation
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (ballArray.length < 50 && tick % 2 == 0) {
    addBall();
  }
  updateBalls();
  drawBalls();

  tick++;
}

animate();
