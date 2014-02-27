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
}(['./ObjectsFactory', './config', './mixins', './Bullet', './Game', './eventsManager'],
  function(ObjectsFactory, config, mixins, Bullet, game, events){

  var Player = ObjectsFactory.create({
    attrs: {
      name: 'anonymous',
      score: 0,
      lastFire: 0,
      lives: config.PLAYER_INITIAL_LIVES
    },

    spawn: function() {
      this.attrs.x = config.WORLD_WIDTH * (Math.random() * 0.8) + 100;
      this.attrs.y = config.WORLD_HEIGHT * (Math.random() * 0.8) + 100;
      this.attrs.lastFire = 0;
      this.attrs.lives = config.PLAYER_INITIAL_LIVES;
      events.send('spawn', this.attrs);
    },

    turnLeft: function() {
      this.attrs.angleV = -config.PLAYER_ANGLE_INCREMENT
    },
    turnRight: function() {
      this.attrs.angleV = config.PLAYER_ANGLE_INCREMENT
    },

    moveForward: function() {
      this.attrs.vx = config.PLAYER_FWD_SPEED;
    },
    moveBackward: function() {
      this.attrs.vx = -config.PLAYER_BWD_SPEED;
    },

    hit: function(b) {
      if (this.attrs.lives > 0) {
        events.send('playerHit', this.dumpAttributes());
        if (--this.attrs.lives <= 0) {
          events.send('playerDead', this.dumpAttributes());
          events.send('kill', {
            killer: b.attrs.owner,
            killee: this.attrs.id
          });
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
      if (Date.now() - this.attrs.lastFire > config.PLAYER_FIRE_DELAY &&
        !this.isDead()) {
        this.attrs.lastFire = Date.now();

        var bullet = new Bullet({
          owner: this.attrs.id
        });
        bullet.attrs.vx = config.BULLET_SPEED * Math.cos(this.attrs.angle);
        bullet.attrs.vy = config.BULLET_SPEED * Math.sin(this.attrs.angle);
        bullet.attrs.x = this.attrs.x + config.PLAYER_BARREL_POS * Math.cos(this.attrs.angle);
        bullet.attrs.y = this.attrs.y + config.PLAYER_BARREL_POS * Math.sin(this.attrs.angle);

        game.model.addBullet(bullet);
      }
    },

    update: function(dt) {
      if (!this.isDead()) {
        this.move(dt);
        this.rotate(dt);
      }
    }
  }, mixins.TwoD, mixins.DirectionalMobile, mixins.Orientable);

  return Player;
}));
