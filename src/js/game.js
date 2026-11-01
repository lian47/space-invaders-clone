import Grid from "../classes/Grid.js";
import Obstacle from "../classes/Obstacle.js";
import Particle from "../classes/Particle.js";
import Player from "../classes/PlayerTemp.js";
import SoundEffects from "../classes/SoundEffects.js";
import Star from "../classes/Star.js";
import { GameState } from "../utils/constants.js";

const soundEffects = new SoundEffects();

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUI = document.querySelector(".score-ui");
const scoreElement = document.querySelector(".score > span");
const levelElement = document.querySelector(".level > span");
const highElement = document.querySelector(".high > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");

gameOverScreen.remove();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

let currentState = GameState.START;

const gameData = {
  score: 0,
  level: 1,
  high: 0,
};

const showGameData = () => {
  scoreElement.textContent = gameData.score;
  levelElement.textContent = gameData.level;
  highElement.textContent = gameData.high;
};

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);

const PlayerProjectiles = [];
const InvaderProjectiles = [];
const particles = [];
const obstacles = [];
const stars = Array.from(
  { length: 90 },
  () => new Star(canvas.width, canvas.height),
);

const initObstacle = () => {
  const x = canvas.width / 2 - 50;
  const y = canvas.height - 250;
  const offset = canvas.width * 0.15;
  const color = "#aaaaaa";

  const obstacle1 = new Obstacle({ x: x - offset, y }, 100, 20, color);
  const obstacle2 = new Obstacle({ x: x + offset, y: y }, 100, 20, color);

  obstacles.push(obstacle1);
  obstacles.push(obstacle2);
};

initObstacle();

const drawStars = (scroll = 0) => {
  stars.forEach((star) => {
    star.draw(ctx);
    star.update(scroll);
  });
};

const drawProjectiles = () => {
  const projectiles = [...PlayerProjectiles, ...InvaderProjectiles];

  projectiles.forEach((projectile) => {
    projectile.draw(ctx);
    projectile.update();
  });
};

const incrementScore = (value) => {
  gameData.score += value;

  if (gameData.score > gameData.high) {
    gameData.high = gameData.score;
  }
};

const createExplosion = (position, size, color) => {
  for (let i = 0; i < size; i += 1) {
    const particle = new Particle(
      {
        x: position.x,
        y: position.y,
      },
      {
        y: (Math.random() - 0.5) * 1.5,
        x: (Math.random() - 0.5) * 1.5,
      },
      2,
      color,
    );

    particles.push(particle);
  }
};

const drawParticles = () => {
  particles.forEach((particle) => {
    particle.draw(ctx);
    particle.update();
  });
};

const clearProjectiles = () => {
  for (let i = PlayerProjectiles.length - 1; i >= 0; i -= 1) {
    if (PlayerProjectiles[i].position.y <= 0) {
      PlayerProjectiles.splice(i, 1);
    }
  }

  for (let i = InvaderProjectiles.length - 1; i >= 0; i -= 1) {
    if (InvaderProjectiles[i].position.y >= canvas.height) {
      InvaderProjectiles.splice(i, 1);
    }
  }
};

const keys = {
  left: false,
  right: false,
  shoot: {
    pressed: false,
    released: true,
  },
};

const drawObstacles = () => {
  obstacles.forEach((obstacle) => obstacle.draw(ctx));
};

const clearParticles = () => {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    if (particles[i].opacity <= 0) {
      particles.splice(i, 1);
    }
  }
};

const checkShootInvaders = () => {
  for (let i = grid.invaders.length - 1; i >= 0; i -= 1) {
    const invader = grid.invaders[i];
    const projectileIndex = PlayerProjectiles.findIndex((projectile) =>
      invader.hit(projectile),
    );

    if (projectileIndex !== -1) {
      soundEffects.playHitSound();

      const center = {
        x: invader.position.x + invader.width / 2,
        y: invader.position.y + invader.width / 2,
      };

      createExplosion({ ...center }, 5, "#941CFF");
      createExplosion({ ...center }, 5, "#220033");

      incrementScore(10);

      grid.invaders.splice(i, 1);
      PlayerProjectiles.splice(projectileIndex, 1);
    }
  }
};

const checkShootPlayer = () => {
  const index = InvaderProjectiles.findIndex((projectile) =>
    player.hit(projectile),
  );

  if (index !== -1) {
    soundEffects.playExplosionSound();
    InvaderProjectiles.splice(index, 1);
    gameOver();
  }
};

const checkShootObstacles = () => {
  obstacles.forEach((obstacle) => {
    const playerIndex = PlayerProjectiles.findIndex((projectile) =>
      obstacle.hit(projectile),
    );

    if (playerIndex !== -1) {
      PlayerProjectiles.splice(playerIndex, 1);
    }

    const invaderIndex = InvaderProjectiles.findIndex((projectile) =>
      obstacle.hit(projectile),
    );

    if (invaderIndex !== -1) {
      InvaderProjectiles.splice(invaderIndex, 1);
    }
  });
};

const spawnGrid = () => {
  if (grid.invaders.length === 0) {
    soundEffects.playNextLevelSound();
    grid.rows = Math.round(Math.random() * 9 + 1);
    grid.cols = Math.round(Math.random() * 9 + 1);
    grid.restart();

    gameData.level += 1;
  }
};

const gameOver = () => {
  createExplosion(
    {
      x: player.position.x + player.width / 1.5,
      y: player.position.y + player.width / 1.5,
    },
    10,
    "#e83b3b",
  );

  createExplosion(
    {
      x: player.position.x + player.width / 1.5,
      y: player.position.y + player.width / 1.5,
    },
    10,
    "#f79617",
  );

  currentState = GameState.GAME_OVER;
  player.alive = false;
  document.body.append(gameOverScreen);
};

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStars(currentState == GameState.PLAYING ? 0.2 : 0);

  if (currentState == GameState.START) {
    drawStars();
  }

  if (currentState == GameState.PLAYING) {
    showGameData();
    spawnGrid();

    drawParticles();
    drawProjectiles();
    drawObstacles();

    clearProjectiles();
    clearParticles();

    checkShootPlayer();
    checkShootInvaders();
    checkShootObstacles();

    grid.draw(ctx);
    grid.update(player.alive);

    ctx.save();

    ctx.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2,
    );

    if (keys.shoot.pressed && keys.shoot.released) {
      soundEffects.playShootSound();
      player.shoot(PlayerProjectiles);
      keys.shoot.released = false;
    }

    if (keys.left && player.position.x >= 0) {
      player.moveLeft();
      ctx.rotate(-0.15);
    }

    if (keys.right && player.position.x <= canvas.width - player.width) {
      player.moveRight();
      ctx.rotate(+0.15);
    }

    ctx.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2,
    );

    player.draw(ctx);

    ctx.restore();
  }

  if (currentState == GameState.GAME_OVER) {
    checkShootObstacles();

    drawParticles();
    drawProjectiles();

    clearProjectiles();
    clearParticles();

    grid.draw(ctx);
    grid.update(player.alive);
  }

  window.requestAnimationFrame(gameLoop);
};

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "a") keys.left = true;
  if (key === "d") keys.right = true;
  if (key === "enter") keys.shoot.pressed = true;
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();

  if (key === "a") keys.left = false;
  if (key === "d") keys.right = false;
  if (key === "enter") {
    keys.shoot.pressed = false;
    keys.shoot.released = true;
  }
});

buttonPlay.addEventListener("click", () => {
  startScreen.remove();
  scoreUI.style.display = "block";
  currentState = GameState.PLAYING;

  setInterval(() => {
    const invader = grid.getRandomInvader();

    if (invader) {
      invader.shoot(InvaderProjectiles);
    }
  }, 1000);
});

buttonRestart.addEventListener("click", () => {
  currentState = GameState.PLAYING;
  player.alive = true;

  grid.rows = 3;
  grid.cols = 6;
  grid.invaderVelocity = 0.5;
  grid.restart();

  InvaderProjectiles.length = 0;
  PlayerProjectiles.length = 0;
  particles.length = 0;

  gameData.score = 0;
  gameData.level = 1;

  gameOverScreen.remove();
});

gameLoop();
