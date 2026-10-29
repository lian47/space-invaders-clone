import { PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Invader {
  constructor(position, velocity) {
    this.position = position;
    this.width = 45 * 0.9;
    this.height = 35 * 0.9;
    this.velocity = velocity;

    this.image = this.getImage(PATH_INVADER_IMAGE);
  }

  getImage(path) {
    const image = new Image();
    image.src = path;
    return image;
  }

  moveDown() {
    this.position.y += this.height;
  }

  incrementVelocity(boost) {
    this.velocity += boost;
  }

  moveLeft() {
    this.position.x -= this.velocity;
  }

  moveRight() {
    this.position.x += this.velocity;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    );
  }

  shoot(projectiles) {
    const p = new Projectile(
      {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height,
      },
      5,
    );
    projectiles.push(p);
  }

  hit(projectile) {
    return (
      projectile.position.x >= this.position.x &&
      projectile.position.x <= this.position.x + this.width &&
      projectile.position.y >= this.position.y &&
      projectile.position.y <= this.position.y + this.height
    );
  }
}

export default Invader;
