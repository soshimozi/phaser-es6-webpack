import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

import KineticScrolling from 'phaser-kinetic-scrolling-plugin';

const NumImages = 23;

function formatInteger(n, l, c) {
    return (n / Math.pow(10, l)).toFixed(l).substr(2).replace(/0/g, c || ' ');
}

export default class extends Phaser.State {
  init () {
    this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);    
    
    this.game.kineticScrolling.configure({
        verticalScroll: true,
        horizontalScroll: true
    });    
  }

  fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    var index = Math.floor(progress / 100 * NumImages);
    this.loadingImage.frameName = "LoadingBar_" + formatInteger(index, 2, "0") + ".png";
  }
    
  preload () {

    this.game.stage.backgroundColor = "#7f5217";
    this.loadAssets();
  }
  
  loadAssets() {
    //
    // load your assets
    //
    //this.load.image('mothership', require('../images/mothership.png'));
    //this.game.load.spritesheet('mothership', require('../images/mothership.png'), 108, 108);
    this.game.load.spritesheet('mothership_54x54', require('../images/Enemies/mothership_54x54.png'), 54, 54);
    this.game.load.image('cannon_1',  require('../images/Turrets/Cannon_Tier1_96x96.png'));
    
    this.game.load.tilemap('jungletilemap', require('../Maps/jungletiles.json'), null, Phaser.Tilemap.TILED_JSON);
    
    //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:
    this.game.load.image('tiles', require('../images/Tilesets/Tileset_Jungle_88x88.png'));    
    
    this.game.load.image('fighter', require('../images/Enemies/Fighter_44x46.png'));
    
    this.game.load.spritesheet('bullet_impact', require('../images/Effects/Bullet_Impact_32x16.png'), 16, 16);
    
    this.game.load.image('base-turret', require('../images/Turrets/Base1_96x96.png'));
  }
  
  configureLoadingImage() {
    this.loadingImage = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loading_bar_atlas');
    this.loadingImage.frameName = "LoadingBar_00.png";

     this.loadingImage.anchor.setTo(0.5, 0.5);
     this.loadingImage.scale.set(.5, .5);
     
    // hook up custom loading
    this.game.load.onFileComplete.add((progress, cacheKey, success, totalLoaded, totalFiles) => this.fileComplete(progress, cacheKey, success, totalLoaded, totalFiles), this);    
  }

  configureLoadingAnimation() {
    this.loadingAnimation = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loading_animation_atlas', 'Loading_00.png');
    this.loadingAnimation.anchor.setTo(0.5, 0.5);
    this.loadingAnimation.scale.set(.5, .5);

    this.loadingAnimation.animations.add('loading', [
        'Loading_00.png',
        'Loading_01.png',
        'Loading_02.png',
        'Loading_03.png',
        'Loading_04.png',
        'Loading_05.png',
        'Loading_06.png',
        'Loading_07.png',
        'Loading_08.png',
        'Loading_09.png',
        'Loading_10.png',
        'Loading_11.png',
        'Loading_12.png',
        'Loading_13.png',
        'Loading_14.png',
        'Loading_15.png',
        'Loading_16.png',
        'Loading_17.png',
        'Loading_18.png',
        'Loading_19.png',
        'Loading_20.png',
        'Loading_21.png',
        'Loading_22.png'
    ], 10, true, false);

    this.loadingAnimation.animations.play('loading');
  }
  
  create () {

    
    this.state.start('Game');
  }
}
