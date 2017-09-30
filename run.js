var app = {},
  mouse = {};
var eGet = document.getElementById('elements'),
  e = eGet.getContext('2d'),
  hGet = document.getElementById('hud'),
  h = hGet.getContext('2d');
var elements = [];
var ball = {};

function Ball(x, y, r, vx, vy, c) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.vx = vx;
  this.vy = vy;
  this.c = c;

  this.collide = () => {
    if (this.y + this.vy + this.r > elements[1].y + elements[1].h / 2 && elements[1].x - elements[1].w / 2 <= this.x && this.x <= elements[1].x + elements[1].w / 2) {
      this.vy = -this.vy;
    }
  };

  this.draw = () => {
    e.beginPath();
    e.strokeStyle = this.c;
    e.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    e.stroke();
  };

  this.update = () => {
    if (this.x + this.r >= app.width || this.x - this.r <= 0) {
      this.vx = -this.vx;
    }
    if (this.y + this.r >= app.height || this.y - this.r <= 0) {
      this.vy = -this.vy;
    }
    this.collide();
    this.x += this.vx;
    this.y += this.vy;

    this.draw();
  };
}

function Board() {
  this.x = 0;
  this.y = app.height * 9 / 10;
  this.w = app.width / 5;
  this.h = app.height / 40;

  this.draw = () => {
    e.fillStyle = '#ffffff';
    e.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
  };

  this.update = () => {
    if (mouse.x - this.w / 2 < 0) {
      this.x = this.w / 2;
    } else if (mouse.x + this.w / 2 > app.width) {
      this.x = app.width - this.w / 2;
    } else {
      this.x = mouse.x;
    }
    this.draw();
  };
}

function Brick(x, y) {
  this.x = x;
  this.y = y;
  this.w = app.width / 15;
  this.h = app.height / 25;

  this.collide = () => {};

  this.draw = () => {
    e.fillStyle = '#ffffff';
    e.fillRect(this.x, this.y, this.w, this.h);
  };

  this.update = () => {
    this.collide();
    this.draw();
  }
}

function Cursor() {
  this.x = 0;
  this.y = 0;

  this.draw = () => {
    h.beginPath();
    h.fillStyle = '#f8f8f8';
    h.arc(this.x, this.y, 2, 0, Math.PI * 2);
    h.fill();
  };

  this.update = () => {
    this.x = mouse.x;
    this.y = mouse.y;
    this.draw();
  };
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
  ball.letR = app.height / 50;
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

  elements.push(new Ball(rand(ball.letR, app.width - ball.letR), rand(ball.letR, app.height - ball.letR), ball.letR, ball.letVx, ball.letVy, 'rgb(' + rand(100, 255) + ',' + rand(100, 255) + ',' + rand(100, 255) + ')'));
  elements.push(new Board());
  elements.push(new Cursor());
  // elements.push(new Brick(app.width / 2, app.height / 2));

  update();
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function update() {
  requestAnimationFrame(update);
  e.clearRect(0, 0, app.width, app.height);
  h.clearRect(0, 0, app.width, app.height);
  for (var i = 0; i < elements.length; i++) {
    elements[i].update();
  }
}

init();
