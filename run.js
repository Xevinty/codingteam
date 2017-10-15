var app = {},
  mouse = {},
  player = {};
var eGet = document.getElementById('elements'),
  e = eGet.getContext('2d'),
  hGet = document.getElementById('hud'),
  h = hGet.getContext('2d'),
  fpsDsp = document.getElementById('fps'),
  livesDsp = document.getElementById('lives'),
  rackTimeDsp = document.getElementById('rackTime'),
  scoreDsp = document.getElementById('score');
var elements = [];
var ball = {};
var matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9
];
var matrixCount = 0;
var firstClick = false;
var t = {};

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
  this.status = true;

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

  this.respawn = () => {
    this.button = true;
    this.vx = this.vy = 0;
    this.x = app.width / 2;
    this.y = app.height * 4 / 5;
  }

  this.start = () => {
    this.vy = 5;
  }

  this.update = () => {
    this.boardDist = this.x - elements[1].x;
    this.delta = (this.boardDist / elements[1].w);
    if (this.x + this.r >= app.width || this.x - this.r <= 0) {
      this.vx = -this.vx;
    }
    if (this.y - this.r <= 0) {
      this.vy = -this.vy;
    }
    if (this.y + this.r >= app.height + this.r) {
      player.lives--;
      if (player.lives > 0) {
        this.respawn();
      } else {
        this.status = false;
        result();
      }
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
    if ((elements[0].y + elements[0].r + elements[0].vy > this.y && elements[0].y - elements[0].r + elements[0].vy < this.y + this.h) && (elements[0].x + elements[0].vx > this.x && elements[0].x + elements[0].vx < this.x + this.w)) {
      elements[0].vy = -elements[0].vy;
      this.status = false;
    };
    if ((elements[0].x + elements[0].r + elements[0].vx > this.x && elements[0].x - elements[0].r + elements[0].vx < this.x + this.w) && (elements[0].y + elements[0].vy > this.y && elements[0].y + elements[0].vy < this.y + this.h)) {
      elements[0].vx = -elements[0].vx;
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

function clearScore() {
  localStorage.removeItem('hiscore');
}

function init() {
  app.width = eGet.width = hGet.width = window.innerWidth;
  app.height = eGet.height = hGet.height = window.innerHeight;
  app.click = 0;

  player.lives = 3;
  player.score = 0;

  t.current = 0;
  t.lapsed = 0;
  t.rackStart = 0;
  t.rackEnd = 0;
  t.rackUsed = 0;

  onclick = function(ev) {
    if (elements[0].button === true) {
      elements[0].start();
      elements[0].button = false;
      if (matrixCount === 0) {
        t.rackStart = t.lapsed;
        rackTimeDsp.style.display = 'none';
      }
    }
    if (firstClick === false) {
      firstClick = true;
    }
  };

  onmousemove = function(ev) {
    mouse.x = ev.clientX;
    mouse.y = ev.clientY;
  };

  elements.push(new Ball(app.width / 2, app.height * 4 / 5, app.height / 50, 0, 0, 'rgb(' + rand(100, 255) + ',' + rand(100, 255) + ',' + rand(100, 255) + ')'));
  elements.push(new Board());
  elements.push(new Cursor());
  matrixCreate();

  setTimeout(update, 20);
};

function matrixCreate() {
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 10; j++) {
      switch (matrix[j * 15 + i]) {
        case -1:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#f8f8f8'));
          break;
        case 0:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#f63535'));
          break;
        case 1:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#f69d35'));
          break;
        case 2:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#f6f435'));
          break;
        case 3:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#67f635'));
          break;
        case 4:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#35f654'));
          break;
        case 5:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#35f6c2'));
          break;
        case 6:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#355ff6'));
          break;
        case 7:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#9035f6'));
          break;
        case 8:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#f635dd'));
          break;
        case 9:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#f63563'));
          break;
        default:
          elements.push(new Brick(i * app.width / 15, j * app.height / 25 + 40, '#f8f8f8'));
      }
    }
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function result() {
  hiscore = localStorage.getItem('hiscore');
  if (player.score > hiscore) {
    localStorage.setItem('hiscore', player.score);
    livesDsp.innerText = 'New highscore!';
  } else {
    livesDsp.innerText = 'Lives: 0';
  }
}

function update() {
  requestAnimationFrame(update);
  t.sec = Math.floor(Date.now() / 1000);
  if (t.sec != t.current) {
    t.current = t.sec;
    t.lapsed++;
    t.frameLast = t.frameNow;
    t.frameNow = 1;
  } else {
    t.frameNow++;
  }
  e.clearRect(0, 0, app.width, app.height);
  h.clearRect(0, 0, app.width, app.height);
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].status === false) {
      elements.splice(i, 1);
      matrixCount++;
      player.score += 10;
    }
    elements[i].update();
  }
  if (matrixCount === 150) {
    elements[0].respawn();
    elements[1].w = Math.max(elements[1].w * 0.9, app.width / 50);
    matrixCreate();
    t.rackEnd = t.lapsed;
    t.rackUsed = t.rackEnd - t.rackStart;
    player.lives++;
    player.score += 500;
    for (var i = 600 - t.rackUsed; i > 0; i -= 10) {
      player.score += 10;
    }
    matrixCount -= 150;
    rackTimeDsp.style.display = 'block';
    rackTimeDsp.innerText = 'Time used: ' + t.rackUsed + ' seconds';
  }
  if (player.lives > 0) {
    livesDsp.innerText = 'Lives: ' + player.lives;
  }
  if (firstClick === false) {
    scoreDsp.innerText = 'Highscore: ' + localStorage.getItem('hiscore');
  } else {
    scoreDsp.innerText = 'Score: ' + player.score;
  }
  fpsDsp.innerText = 'FPS: ' + t.frameLast;
}

init();
