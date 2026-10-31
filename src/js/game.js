import Grid from "../classes/Grid.js";
import Invader from "../classes/invader.js";
import Obstacle from "../classes/Obstacle.js";
import Particle from "../classes/Particle.js";
import Player from "../classes/PlayerTemp.js";
import Projectile from "../classes/Projectile.js";
import { GameState } from "../utils/constants.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

let currentState = GameState.PLAYING;

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);

const PlayerProjectiles = [];
const InvaderProjectiles = [];
const particles = [];
const obstacles = [];

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

const drawProjectiles = () => {
  const projectiles = [...PlayerProjectiles, ...InvaderProjectiles];

  projectiles.forEach((projectile) => {
    projectile.draw(ctx);
    projectile.update();
  });
};

const createExplosion = (position, size, color) => {
  for (let i = 0; i < size; i += 1) {
    const particle = new Particle(
      {
        x: position.x,
        y: position.y,
      },
      {
        y: Math.random() - 0.5 * 1.5,
        x: Math.random() - 0.5 * 1.5,
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

const clearProjecttiles = () => {
  PlayerProjectiles.forEach((projectile, index) => {
    if (projectile.position.y <= 0) {
      PlayerProjectiles.splice(index, 1);
    }
  });
};

const invader = new Invader({ x: 150, y: 100 }, 10);

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

const checkShootInvaders = () => {
  grid.invaders.forEach((invader, invaderIndex, projectileIndex) => {
    PlayerProjectiles.some((projectile) => {
      if (invader.hit(projectile)) {
        createExplosion(
          {
            x: invader.position.x + invader.width / 2,
            y: invader.position.y + invader.width / 2,
          },
          5,
          "#941CFF",
        );

        createExplosion(
          {
            x: invader.position.x + invader.width / 2,
            y: invader.position.y + invader.width / 2,
          },
          5,
          "#220033",
        );

        grid.invaders.splice(invaderIndex, 1);
        PlayerProjectiles.splice(projectileIndex, 1);
      }
    });
  });
};

const clearParticles = () => {
  particles.forEach((particle, i) => {
    if (particle.opacity <= 0) {
      particles.splice(i, 1);
    }
  });
};

const checkShootPlayer = () => {
  InvaderProjectiles.some((projectile, i) => {
    if (player.hit(projectile)) {
      InvaderProjectiles.splice(i, 1);
      gameOver();
    }
  });
};

const checkShootObstacles = () => {
  obstacles.forEach((obstacles) => {
    PlayerProjectiles.some((projectile, i) => {
      if (obstacles.hit(projectile)) {
        PlayerProjectiles.splice(i, 1);
      }
    });
  });
};

const spawnGrid = () => {
  if (grid.invaders.length === 0) {
    grid.rows = Math.round(Math.random() * 9 + 1);
    grid.cols = Math.round(Math.random() * 9 + 1);
    grid.restart();
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
};

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentState == GameState.PLAYING) {
    spawnGrid();

    drawParticles();
    drawProjectiles();
    drawObstacles();

    clearProjecttiles();
    clearParticles();

    checkShootPlayer();
    checkShootInvaders();
    checkShootObstacles();

    grid.draw(ctx);
    // grid.update(player.alive);

    ctx.save();

    ctx.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2,
    );

    if (keys.shoot.pressed && keys.shoot.released) {
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
    drawParticles();
    drawProjectiles();

    clearProjecttiles();
    clearParticles();

    grid.draw(ctx);
    grid.update();
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

// setInterval(() => {
//   const invader = grid.getRandomInvader();

//   if (invader) {
//     invader.shoot(InvaderProjectiles);
//   }
// }, 1000);

gameLoop();
