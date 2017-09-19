import Phaser from 'phaser'

export default class extends Phaser.State {
    init() {
        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.stars = null;
        this.score = 0;
        this.scoreText = null;
        this.hasStar = null;
        this.skilledStars = 0;
        this.numberStars = 10;
    }

    create() {
        this.scoreText = this.game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // Add background for our game
        this.add.sprite(0, 0, 'sky');

        // A Group is a container for display objects that allows for fast pooling, recycling and collision checks. 
        // The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = game.add.group();
        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Create the ground
        var ground = this.platforms.create(0, game.world.height - 64, 'ground');

        // Scale it to git the witdh of the game (percent)
        ground.scale.setTo(2,2);
        // This stops it from falling away when you jump on it
        ground.body.immovable = true;

        // Now let's create twp ledges
        var ledge = this.platforms.create(400, 200, 'ground');
        ledge.body.immovable = true;
        ledge = this.platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
        //  We need to enable physics on the player
        this.physics.arcade.enable(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;   //Sprite obj - https://phaser.io/docs/2.6.2/Phaser.Sprite.html#body
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        //  Finally some stars to collect
        this.stars = game.add.group();
    
        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;
    
        this.renderStar();
        
        //This populates the cursors object with four properties: up, down, left, right
        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    update() {
        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.collide(this.stars, this.platforms);

        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;
    
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;
    
            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();
    
            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.body.velocity.y = -250;
        }
    }

    render() {

    }

    collectStar(player, star) {
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.core;
        
        this.skilledStars += 1;

        if(this.skilledStars == this.numberStars) {
            this.renderStar();
            this.skilledStars = 0;
        }
    }

    renderStar() {
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < this.numberStars; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = this.stars.create(i * 70, 0, 'star');
    
            //  Let gravity do its thing
            star.body.gravity.y = 300;
    
            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.8 + Math.random() * 0.2;
        }
    }
}