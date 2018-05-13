import Phaser from 'phaser';
import events from '../utils/events.js';


const on_fire = 'on_fire';
      
export default class Turret extends Phaser.Sprite {
    constructor(game, x, y, asset, enemies, bullets, fire_freq) {
        super(game, x, y, asset);
        this.anchor.setTo(0.5);
        this.enemies = enemies;
        this.bullets = bullets;
        
        if( fire_freq )
            this.fire_rate = 1 / fire_freq;
        else
            this.fire_rate = 0;
            
        this.can_fire = true && this.fire_rate; // only fire if we have an actual frequency

        this.turret_events = new events();

    }
    
    static get ON_FIRE() {
        return on_fire;
    }
    
    setTarget(tgt) {
        this.target = tgt;
    }

    update() {
        
        if(!this.selected) {
            this.trackTarget();
        } else {
            this.trackPointer();
        }
    }
    
    trackPointer() {
        var x = this.game.input.activePointer.worldX;

        var y = this.game.input.activePointer.worldY;
        

        var angleTo = Phaser.Math.radToDeg(this.position.angle(new Phaser.Point(x, y)));
        
        var shortestAngle = this.game.math.getShortestAngle(angleTo, this.angle);
        
        var newAngle = this.angle - shortestAngle;
        
        var time = Math.abs(shortestAngle) * 2.5;
        
        this.game.add.tween(this).to({ angle: newAngle }, time, 'Linear', true);        
        
    }
    
    trackTarget() {
        var target = null;
        
        if(!this.target) {
            target = this.enemies.getClosestTo(this, function(e) { return e.alive; }, this);
        } else {
            target = this.target;
        }
        
        if(target != null) {

          // TODO: check distance for max range and check alive/dead
          // var angle = Phaser.Math.radToDeg(parseFloat(this.game.physics.arcade.angleToXY(this.turret, closest.x, closest.y))); //
          // this.game.add.tween(this.turret).to({ angle: angle }, angle, 'Linear', true);
          
          var angleTo = Phaser.Math.radToDeg(this.position.angle(target.position));
      
          var shortestAngle = this.game.math.getShortestAngle(angleTo, this.angle);
      
          var newAngle = this.angle - shortestAngle;
       
          var time = Math.abs(shortestAngle) * 2.5;
      
          this.game.add.tween(this).to({ angle: newAngle }, time, 'Linear', true);
          
          if(this.can_fire) {
              
            // let listeners know we can fire
            console.log('about to publish event', Turret.ON_FIRE);
            
            this.turret_events.publish(Turret.ON_FIRE, this);
            
            var bullet = this.bullets.getFirstExists(false);
            if (bullet) {
                bullet.reset(this.x, this.y);
                bullet.body.collideWorldBounds = true;
                bullet.rotation = parseFloat(this.game.physics.arcade.angleToXY(bullet, target.x, target.y)) * 180 / Math.PI;
                this.game.physics.arcade.moveToObject(bullet, target, 500);
            }            

            this.can_fire = false;
            this.game.time.events.add(Phaser.Timer.SECOND * this.fire_rate, () => { this.can_fire = true }, this);
              
          }
          
        } else {
          
          if(this.angle != -90) {
            this.game.add.tween(this).to({ angle: -90 }, 150, 'Linear', true);
          }
        }
        
    }
    
}
