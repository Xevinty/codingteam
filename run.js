var app = new Object(),
  mouse = new Object();
var eGet = document.getElementById('elements'),
  e = eGet.getContext('2d'),
  hGet = document.getElementById('hud'),
  h = hGet.getContext('2d');
var ball = new Object();


function Ball(x, y, r, vx, vy, c) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.vx = vx;
  this.vy = vy;
  this.c = c;

  this.draw = () => {
    e.beginPath();
    e.strokeStyle = this.c;
    e.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    e.stroke();
  }

  this.update = () => {
    if (this.x + this.r >= app.width || this.x - this.r <= 0) {
      this.vx = -this.vx;
    }
    if (this.y + this.r >= app.height || this.y - this.r <= 0) {
      this.vy = -this.vy;
    }
    this.x += this.vx;
    this.y += this.vy;

    this.draw();
  }
}

function init() {
  app.width = eGet.width = hGet.width = window.innerWidth;
  app.height = eGet.height = hGet.height = window.innerHeight;

  document.addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  ball.sign = rand(1, 4);
  ball.letVx = rand(1, 3);
  ball.letVy = rand(1, 3);
  ball.letR = 16;
  switch (ball.sign) {
    case 1:
      ball.letVx = ball.letVx;
      ball.letVy = ball.letVy;
      break;
    case 2:
      ball.letVx = -ball.letVx;
      ball.letVy = ball.letVy;
      break;
    case 3:
      ball.letVx = -ball.letVx;
      ball.letVy = -ball.letVy;
      break;
    case 4:
      ball.letVx = ball.letVx;
      ball.letVy = -ball.letVy;
      break;
    default:
      ball.letVx = ball.letVx;
      ball.letVy = ball.letVy;
  }
  ball.object = new Ball(rand(ball.letR, app.width - ball.letR), rand(ball.letR, app.height - ball.letR), ball.letR, ball.letVx, ball.letVy, 'rgb(' + rand(0, 255) + ',' + rand(0, 255) + ',' + rand(0, 255) + ')');

  update();
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function update() {
  requestAnimationFrame(update);
  e.clearRect(0, 0, app.width, app.height);
  h.clearRect(0, 0, app.width, app.height);
  ball.object.update();
}

init();
