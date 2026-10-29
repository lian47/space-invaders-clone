import Invader from "./invader.js";

class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.direction = "right";
    this.moveDown = true;

    this.invaderVelocity = 1;
    this.invaders = this.init();
  }

  init() {
    const array = [];

    for (let rows = 0; rows < this.rows; rows += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        const invader = new Invader(
          {
            x: col * 50 + 20,
            y: rows * 40 + 20,
          },
          this.invaderVelocity,
        );
        array.push(invader);
      }
    }
    return array;
  }

  draw(ctx) {
    this.invaders.forEach((invader) => invader.draw(ctx));
  }

  update() {
    if (this.hitRight()) {
      this.direction = "left";
      this.moveDown = true;
    } else if (this.hitLeft()) {
      this.direction = "right";
      this.moveDown = true;
    }

    this.invaders.forEach((invader) => {
      if (this.moveDown) {
        invader.moveDown();
        invader.incrementVelocity(0.1);
        this.invaderVelocity = invader.velocity;
      }

      if (this.direction === "right") invader.moveRight();
      if (this.direction === "left") invader.moveLeft();
    });
    this.moveDown = false;
  }

  hitRight() {
    return this.invaders.some(
      (invader) => invader.position.x + invader.width >= window.innerWidth,
    );
  }

  hitLeft() {
    return this.invaders.some((invader) => invader.position.x <= 0);
  }

  getRandomInvader() {
    const index = Math.floor(Math.random() * this.invaders.length);
    return this.invaders[index];
  }
}

export default Grid;
