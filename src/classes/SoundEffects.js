class SoundEffects {
  constructor() {
    this.shootSounds = [
      new Audio("src/assets/audios/shoot.mp3"),
      new Audio("src/assets/audios/shoot.mp3"),
      new Audio("src/assets/audios/shoot.mp3"),
      new Audio("src/assets/audios/shoot.mp3"),
      new Audio("src/assets/audios/shoot.mp3"),
    ];

    this.hitSounds = [
      new Audio("src/assets/audios/shoot.mp3"),
      new Audio("src/assets/audios/shoot.mp3"),
      new Audio("src/assets/audios/shoot.mp3"),
      new Audio("src/assets/audios/shoot.mp3"),
      new Audio("src/assets/audios/shoot.mp3"),
    ];

    this.explosionSound = new Audio("src/assets/audios/explosion.mp3");
    this.nextLevelSound = new Audio("src/assets/audios/next_level.mp3");

    this.currentShootSound = 0;
    this.currentHitSound = 0;

    this.adjustVolume();
  }

  playExplosionSound() {
    this.explosionSound.play();
  }
  nextLevelSound() {
    this.explosionSound.play();
  }

  playShootSound() {
    this.shootSounds[this.currentHitSound].currentTime = 0;
    this.shootSounds[this.currentHitSound].play();
    this.currentShootSound += 1;
  }

  adjustVolume() {
    this.hitSounds.forEach((sound) => (sound.volume = 0.2));
    this.shootSounds.forEach((sound) => (sound.volume = 0.5));
    this.explosionSound.volume = 0.2;
    this.nextLevelSound.volume = 0.4;
  }
}

export default SoundEffects;
