var app = {},
  mouse = {};
var eGet = document.getElementById('elements'),
  e = eGet.getContext('2d'),
  hGet = document.getElementById('hud'),
  h = hGet.getContext('2d');
var elements = [];
var ball = {};
var matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

function Ball(x, y, r, vx, vy, c) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.vx = vx;
  this.vy = vy;
  this.c = c;
  this.boardDist = 0;
  this.delta = 0;
  this.button = true;

  this.collide = () => {
    if (this.y + this.vy + this.r > elements[1].y + elements[1].h / 2 && elements[1].x - elements[1].w / 2 <= this.x && this.x <= elements[1].x + elements[1].w / 2) {
      this.vy = -this.vy;
      this.vx += this.delta;
    }
  };

  this.draw = () => {
    e.beginPath();
    e.strokeStyle = this.c;
    e.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    e.stroke();
  };

  this.start = () => {
    this.vy = 5;
  }

  this.update = () => {
    this.boardDist = this.x - elements[1].x;
    this.delta = (this.boardDist / elements[1].w) - 0.5;
    if (this.x + this.r >= app.width || this.x - this.r <= 0) {
      this.vx = -this.vx;
    }
    if (this.y - this.r <= 0) {
      this.vy = -this.vy;
    }
    if (this.y + this.r >= app.height + this.r) {
      this.status = false;
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
  this.status = true;

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

function Brick(x, y, c) {
  this.x = x;
  this.y = y;
  this.c = c;
  this.w = app.width / 15;
  this.h = app.height / 25;
  this.status = true;

  this.collide = () => {
    if (this.y < elements[0].y + elements[0].r + elements[0].vy && this.y + this.h > elements[0].y - elements[0].r + elements[0].vy && elements[0].x + elements[0].r + elements[0].vx >= this.x && elements[0].x - elements[0].r + elements[0].vx <= this.x + this.w) {
      elements[0].vy = -elements[0].vy;
      this.status = false;
    };
    if (this.x < elements[0].x + elements[0].vx + elements[0].r && this.x + this.w > elements[0].x + elements[0].vx - elements[0].r && elements[0].y - elements[0].r <= this.y + this.h && this.y <= elements[0].y + elements[0].r) {
      elements[0].vx = -elements[0].vx;
      elements[0].vy = -elements[0].vy;
      this.status = false;
    };

  }

  this.draw = () => {
    e.fillStyle = this.c;
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
  this.status = true;

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

function dist(x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function init() {
  app.width = eGet.width = hGet.width = window.innerWidth;
  app.height = eGet.height = hGet.height = window.innerHeight;
  app.click = 0;

  document.addEventListener('click', event => {
    if (elements[0].button === true) {
      elements[0].start();
      elements[0].button = false;
    }
  });

  document.addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  elements.push(new Ball(app.width / 2, app.height * 4 / 5, app.height / 50, 0, 0, 'rgb(' + rand(100, 255) + ',' + rand(100, 255) + ',' + rand(100, 255) + ')'));
  elements.push(new Board());
  elements.push(new Cursor());
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 10; j++) {
      switch (matrix[j * 15 + i]) {
        case 0:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#f8f8f8'));
          break;
        case 1:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#52ff00'));
          break;
        default:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#f8f8f8'));
      }
    }
  }

  setTimeout(update, 20);
};

function pyth(hyp, sid) {
  return Math.sqrt(Math.pow(hyp, 2) - Math.pow(sid, 2));
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function update() {
  requestAnimationFrame(update);
  e.clearRect(0, 0, app.width, app.height);
  h.clearRect(0, 0, app.width, app.height);
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].status === false) {
      elements.splice(i, 1);
    }
    elements[i].update();
  }
}

init();
