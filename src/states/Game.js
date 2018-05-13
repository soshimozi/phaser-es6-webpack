/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Enemy from '../sprites/enemy'
import Turret from '../sprites/turret'

import HealthBar from '../sprites/phaser-percent-bar'


export default class extends Phaser.State {
  
  init () {  }
  
  preload () {}

  create () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.kineticScrolling.start();

    
    var map = this.game.add.tilemap('jungletilemap');

    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    map.addTilesetImage('JungleTiles', 'tiles');
    
    //  Creates a layer from the World1 layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    var layer = map.createLayer('Tile Layer 1');

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();

  	var sillhouetteBMD = this.createSillhouette('base-turret');
   
    //first create the border
    this.game.highlight = this.game.add.sprite(483,484,sillhouetteBMD);
    this.game.highlight.scale.setTo(1.2); 
    this.game.highlight.anchor.setTo(0.5);
    this.game.highlight.tint=0xfffab0;
    this.game.highlight.visible=false;    

    this.game.selection = this.game.add.sprite(483,484,sillhouetteBMD);
    this.game.selection.scale.setTo(1.2); 
    this.game.selection.anchor.setTo(0.5);
    this.game.selection.tint=0xff2323;
    this.game.selection.visible=false;    


    /*
     * Tower
     */
    this.towers = this.game.add.group();
    this.game.physics.enable(this.towers, Phaser.Physics.ARCADE);
    /*
     * Towers Bullets
     */
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    
    /*
     * Enemy
     */
    this.enemys = this.game.add.group();
    this.enemys.enableBody = true;
    this.enemys.physicsBodyType = Phaser.Physics.ARCADE;
    
    this.bullet_impacts = this.game.add.group();
    this.bullet_impacts.createMultiple(30, 'bullet_impact');
    this.bullet_impacts.forEach((bi) => { 
      bi.anchor.x = 0.5;
      bi.anchor.y = 0.5;
      bi.animations.add('bullet_impact')}, 
      this);    
    

// TODO: read paths from json file
    var path =  [{x: 0, y: 4}, {x: 4, y: 4}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 5, y: 6}, {x: 9, y: 6}, {x: 9, y: 5}, {x: 9, y: 8}, {x: 12, y: 8}, {x: 12, y: 5}, {x: 12, y: 10}, {x:12, y: 8}, {x: 15, y: 8}];

    var i = 0;
    var enemysBcl = setInterval(() => {
        if (i < 5) {  // TODO: get number of units from JSON file
            // TODO: get tile width and tile height from tilemap
            // TODO: get start location from path
            var enemy = new Enemy(this.game, 0, 396, 'fighter', path, 88, 88);
            
            enemy.speed = 1;  // TODO: speed is configurable based on level/difficulty
            
            this.game.add.existing(enemy);
            this.enemys.add(enemy);

        } else {
            clearTimeout(enemysBcl);
        }
        i++;
    }, 2500); // TODO: timeout is configurable based on level/difficulty


    var enemy = this.enemy = new Enemy(this.game, 0, 396, 'fighter', path, 88, 88);
    this.game.add.existing(enemy);
    this.enemys.add(enemy);
    
    // Set health and max-health values
    enemy.health = 100;
    enemy.maxHealth = 100;

    // Create percentage bar as health bar
    enemy.health_bar = this.game.add.existing(new HealthBar({
      game: this.game,
      host: enemy,
      xOffset: -22,
      yOffset: -35
    }));
    

    
    // TODO: load turret locations from json file
    // take base turrets off of the map and place using the json file
    var base_turret = this.game.add.sprite(483, 484, 'base-turret');
    base_turret.anchor.setTo(0.5);
    this.towers.add(base_turret);

    var turret = new Turret(this.game, 483, 484, 'cannon_1', this.enemys, this.bullets, .5);
    var subscription = turret.turret_events.subscribe(Turret.ON_FIRE, (t) => {console.log('on fire: ', t)});
    
    this.game.add.existing(turret);
    this.towers.add(turret);
    turret.inputEnabled=true;
    turret.events.onInputOver.add((go, p) => { this.handleTowerMouseOver(go, p) }, this.game);
    turret.events.onInputOut.add((go, p) => { this.handleTowerMouseOut(go, p) }, this.game);    
    turret.events.onInputUp.add((go, p) => { this.game.selection.x = go.x; this.game.selection.y = go.y; this.game.selection.visible = true; go.selected = true; }, this.game);


    base_turret = this.game.add.sprite(659, 660, 'base-turret');
    base_turret.anchor.setTo(0.5);
    this.towers.add(base_turret);
    turret = new Turret(this.game, 659, 660, 'cannon_1', this.enemys, this.bullets, .5);
    this.game.add.existing(turret);
    this.towers.add(turret);
    
    turret.inputEnabled=true;
    turret.events.onInputOver.add((go, p) => { this.game.highlight.x = go.x; this.game.highlight.y = go.y; this.game.highlight.visible = true; }, this.game);
    turret.events.onInputOut.add((go, p) => { this.game.highlight.visible = false; }, this.game);    

    turret = new Turret(this.game, 923, 660, 'cannon_1', this.enemys, this.bullets, .5);
    this.game.add.existing(turret);
    this.towers.add(turret);
    
    this.game.world.setBounds(0, 0, 1320, 1320);

  }
  
  handleTowerMouseOut(gameObject, position) {
    
    this.game.highlight.visible = false
  }
  
  handleTowerMouseOver(gameObject, position) {
    this.game.highlight.x = gameObject.x 
    this.game.highlight.y = gameObject.y 
    this.game.highlight.visible = true    
  }
  
  createSillhouette(srcKey) {
	  var bmd = this.game.make.bitmapData()
	  // load our texture into the bitmap
	  bmd.load(srcKey)
	  bmd.processPixelRGB((p) => { p.r = 255; p.g = 255; p.b = 255; return p; }, this);
    return bmd
  }  
  
  collisionHandler(bullet, enemy) {
    bullet.kill();
    enemy.destroy();
  }
  
  update () {
    
    
    //  Run collision
    this.game.physics.arcade.overlap(this.bullets, this.enemys, (bullet, enemy) => this.collisionHandler(bullet, enemy), null, this);
    // this.fc = this.fc + 1;
    
    // var closest = this.enemys.getClosestTo(this.turret, function(e) { return e.alive; }, this);
    
    // if(closest != null) {
    //   //var closest = this.game.physics.arcade.closest(this.turret, this.enemys.children);
      
    //   // TODO: check distance for max range and check alive/dead
    //   // var angle = Phaser.Math.radToDeg(parseFloat(this.game.physics.arcade.angleToXY(this.turret, closest.x, closest.y))); //
    //   // this.game.add.tween(this.turret).to({ angle: angle }, angle, 'Linear', true);
      
    //   var angleTo = Phaser.Math.radToDeg(this.turret.position.angle(closest.position));
  
    //   var shortestAngle = this.game.math.getShortestAngle(angleTo, this.turret.angle);
  
    //   var newAngle = this.turret.angle - shortestAngle;
   
    //   var time = Math.abs(shortestAngle) * 2.5;
  
    //   this.game.add.tween(this.turret).to({ angle: newAngle }, time, 'Linear', true);
    // } else {
      
    //   //if(this.turret.angle != 270) {
    //     this.game.add.tween(this.turret).to({ angle: -90 }, 150, 'Linear', true);
    //   //}
    // }
    
    // if(this.fc % 60 == 0 && closest) {
    //   var explosion = this.bullet_impacts.getFirstExists(false);
    //   explosion.reset(closest.x, closest.y);
    //   explosion.play('bullet_impact', 30, false, true);      
    // }
    
  }

  render () {
    if (__DEV__) {
    }
  }
}
