(function(deps, factory){
  if (typeof module === 'object') {
    var modules = [];
    for (var i in deps) {
      modules.push(require(deps[i]));
    }
    module.exports = factory.apply(this, modules);
  } else {
    define(deps, factory);
  }
}(['./ObjectsFactory', './config', './mixins', './Bullet'], function(ObjectsFactory, config, mixins, Bullet){
  var Player = ObjectsFactory.create({
    attrs: {
      name: 'anonymous',
      score: 0,
      lastFire: 0,
      lives: config.PLAYER_INITIAL_LIVES
    },

    reset: function() {
      this.attrs.x = config.WORLD_WIDTH/2 + 100 * (Math.random() - 0.5);
      this.attrs.y = config.WORLD_HEIGHT/2 + 100 * (Math.random() - 0.5);
      this.attrs.score = 0;
      this.attrs.lastFire = 0;
      this.attrs.lives = config.PLAYER_INITIAL_LIVES;
    },

    turnLeft: function() {
      this.attrs.angleV = -config.PLAYER_ANGLE_INCREMENT
    },
    turnRight: function() {
      this.attrs.angleV = config.PLAYER_ANGLE_INCREMENT
    },

    moveForward: function() {
      this.attrs.vx = config.PLAYER_FWD_SPEED * Math.cos(this.attrs.angle);
      this.attrs.vy = config.PLAYER_FWD_SPEED * Math.sin(this.attrs.angle);
    },
    moveBackward: function() {
      this.attrs.vx = -config.PLAYER_BWD_SPEED * Math.cos(this.attrs.angle);
      this.attrs.vy = -config.PLAYER_BWD_SPEED * Math.sin(this.attrs.angle);
    },

    hit: function() {
      if (this.attrs.lives > 0)
        this.attrs.lives --;
    },

    isDead: function() {
      return this.attrs.lives <= 0;
    },

    resetControls: function() {
      this.attrs.vx = this.attrs.vy = this.attrs.angleV = 0;
    },

    fire: function() {
      if (Date.now() - this.attrs.lastFire > config.PLAYER_FIRE_DELAY) {
        this.attrs.lastFire = Date.now();

        var bullet = new Bullet();
        bullet.attrs.vx = config.BULLET_SPEED * Math.cos(this.attrs.angle);
        bullet.attrs.vy = config.BULLET_SPEED * Math.sin(this.attrs.angle);
        bullet.attrs.x = this.attrs.x + config.PLAYER_BARREL_POS * Math.cos(this.attrs.angle);
        bullet.attrs.y = this.attrs.y + config.PLAYER_BARREL_POS * Math.sin(this.attrs.angle);

        this.model.addBullet(bullet);
      }
    },

    update: function(dt) {
      this.move(dt);
      this.rotate(dt);
    }
  }, mixins.TwoD, mixins.Mobile, mixins.Orientable, mixins.Actor);

  return Player;
}));