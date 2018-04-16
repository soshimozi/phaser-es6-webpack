import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor(game, x, y, asset, enemies, fire_freq, on_fire) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)
        this.enemies = enemies
        
        if( fire_freq )
            this.fire_rate = 1 / fire_freq
        else
            this.fire_rate = 0;
            
        this.on_fire = on_fire
        this.can_fire = true && this.fire_rate // only fire if we have an actual frequency
        
        console.log('fire_rate: ', fire_freq);
    }
    
    setTarget(tgt) {
        this.target = tgt;
    }

    update() {
        
        if(!this.selected) {
            this.trackTarget()
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
              
            if(typeof this.on_fire === 'function') {
                this.on_fire(this);
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
