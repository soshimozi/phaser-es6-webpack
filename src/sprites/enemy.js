import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor(game, x, y, asset, path, tileWidth, tileHeight) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)

        // TODO: add animations here
        this.speed = 1;
        this.speedX = 0;
        this.speedY = 0;
        this.curTile = 0;

        this.path = path;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        
        this.nextTile();
        this.moveElement();
        
    }
    // constructor(game, ) {
    // this.enemy = game.add.sprite(path[0].x * tileSquare, path[0].y * tileSquare, anim);

    // this.enemy.animations.add('walk');
    // this.enemy.animations.play('walk', animLength, true);
    // this.enemy.anchor.setTo(0.5, 0.5);
    // this.enemy.speed = 1;
    // this.enemy.speedX = 0;
    // this.enemy.speedY = 0;
    // this.enemy.curTile = 0
    // enemys.add(this.enemy);
    // Enemy.prototype.nextTile(this.enemy);
    // Enemy.prototype.moveElmt(this.enemy);        
    // }



    update() {
        this.moveElement();
    }
    

    moveElement() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.speedX > 0 && this.x >= this.next_positX) {
            this.x = this.next_positX;
            this.nextTile();
        }
        else if (this.speedX < 0 && this.x <= this.next_positX) {
            this.x = this.next_positX;
            this.nextTile();
        }
        else if (this.speedY > 0 && this.y >= this.next_positY) {
            this.y = this.next_positY;
            this.nextTile();
        }
        else if (this.speedY < 0 && this.y <= this.next_positY) {
            this.y = this.next_positY;
            this.nextTile();
        }
    }

    nextTile() {
        
        if(this.curTile < this.path.length - 1) 
            this.curTile++;
        else {
            // we are dead
            this.alive = false;
        }
        
        this.next_positX = parseInt(this.path[this.curTile].x * this.tileWidth + (this.tileWidth/2), 10);
        this.next_positY = parseInt(this.path[this.curTile].y * this.tileHeight + (this.tileHeight/2), 10);
        
        if (this.next_positX > this.x) {
            this.speedX = this.speed;
            this.angle = 0;
        }
        else if (this.next_positX < this.x) {
            this.speedX = -this.speed;
            this.angle = 180;
        }
        else {
            this.speedX = 0;
        }
        
        if (this.next_positY > this.y) {
            this.speedY = this.speed;
            this.angle = 90;
        }
        else if (this.next_positY < this.y) {
            this.speedY = -this.speed;
            this.angle = -90;
        }
        else {
            this.speedY = 0;
        }
    }

}
