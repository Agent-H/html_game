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
}(['./ObjectsFactory', './config', './mixins', './Bullet', './Game', './eventsManager', './effects/Explosion', './effectsManager'],
  function(ObjectsFactory, config, mixins, Bullet, game, events, Explosion, effectsManager){

  effectsManager.addEffect(
    'playerHit',
    Explosion,
    {
      particles: 4,
      color: '#0ff',
      maxSpeed: 0.07,
      minSpeed: 0.03,
      life: 200
    });
  effectsManager.addEffect(
    'playerDead',
    Explosion,
    {
      particles: 20,
      color: '#c92',
      maxSpeed: 0.3,
      life: 1000
    });

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
      this.attrs.vx = config.PLAYER_FWD_SPEED;

      events.send('mvFwd', {x: this.attrs.x, y: this.attrs.y});
    },
    moveBackward: function() {
      this.attrs.vx = -config.PLAYER_BWD_SPEED;
    },

    hit: function() {
      if (this.attrs.lives > 0) {
        if (--this.attrs.lives <= 0) {
          events.send('playerDead', this.dumpAttributes());
        } else {
          events.send('playerHit', this.dumpAttributes());
        }
      }
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

        game.model.addBullet(bullet);
      }
    },

    update: function(dt) {
      this.move(dt);
      this.rotate(dt);
    }
  }, mixins.TwoD, mixins.DirectionalMobile, mixins.Orientable);

  return Player;
}));
