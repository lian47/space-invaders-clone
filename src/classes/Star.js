const COLORS = ["#ffffff", "#941CFF", "#6a5acd", "#b388ff"];

class Star {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.radius = Math.random() * 2.5 + 0.5;
    this.position = {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
    };
    this.velocity = {
      x: (Math.random() - 0.5) * 0.4 * this.radius,
      y: (Math.random() - 0.5) * 0.4 * this.radius,
    };
    this.opacity = Math.random() * 0.6 + 0.3;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = this.opacity;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update(scroll = 0) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y + this.radius * scroll;

    if (this.position.x < -this.radius) {
      this.position.x = this.canvasWidth + this.radius;
    }
    if (this.position.x > this.canvasWidth + this.radius) {
      this.position.x = -this.radius;
    }
    if (this.position.y < -this.radius) {
      this.position.y = this.canvasHeight + this.radius;
    }
    if (this.position.y > this.canvasHeight + this.radius) {
      this.position.y = -this.radius;
    }
  }
}

export default Star;