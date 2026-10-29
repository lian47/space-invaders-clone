import Grid from "../classes/Grid.js";
import Invader from "../classes/invader.js";
import Player from "../classes/PlayerTemp.js";
import Projectile from "../classes/Projectile.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);
const PlayerProjectiles = [];
const InvaderProjectiles = [];

const drawProjectiles = () => {
  const projectiles = [...PlayerProjectiles, ...InvaderProjectiles];

  projectiles.forEach((projectile) => {
    projectile.draw(ctx);
    projectile.update();
  });
};

const clearProjecttiles = () => {
  PlayerProjectiles.forEach((projectile, index) => {
    if (projectile.position.y <= 0) {
      PlayerProjectiles.splice(index, 1);
    }
  });
};

const invader = new Invader({ x: 150, y: 100 }, 5);

const keys = {
  left: false,
  right: false,
  shoot: {
    pressed: false,
    released: true,
  },
};

const checkShootInvaders = () => {
  grid.invaders.forEach((invader, invaderIndex, projectileIndex) => {
    PlayerProjectiles.some((projectile) => {
      if (invader.hit(projectile)) {
        grid.invaders.splice(invaderIndex, 1);
        PlayerProjectiles.splice(projectileIndex, 1);
      }
    });
  });
};

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawProjectiles();
  clearProjecttiles();

  checkShootInvaders();

  grid.draw(ctx);
  // grid.update();

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
