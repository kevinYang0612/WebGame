import {Player} from "./player.js";
import {InputHandler} from "./input.js";
import {Background} from "./background.js";
import {FlyingEnemy, ClimbingEnemy, GroundEnemy} from "./enemies.js";
import {UI} from "./UI.js";

/**
 * window is the main JavaScript object root,
 * aka the global object in a browser, and it can also be treated
 * as the root of the document object model. You can access it as window.
 *
 * window.screen or just screen is a small information
 * object about physical screen dimensions.
 *
 * window.document or just document is the main object of the potentially visible
 * (or better yet: rendered) document object model/DOM.
 *
 * load event waits all dependent resources such as stylesheets and images
 * to be fully loaded and available before it runs
 * */
window.addEventListener('load', () =>
{
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;
    let lastTime = 0;

    class Game
    {
        constructor(width, height)
        {
            // canvas dimension: gameWidth, gameHeight
            this.width = width;
            this.height = height;
            this.speed = 0; // 3px per second
            this.maxSpeed = 4;
            this.groundMargin = 40;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 100;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;  // add an enemy every 1000 ms = 1 second
            this.debug = false;
            this.score = 0;
            this.winnerScore = 40;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 300000;
            this.gameOver = false;
            this.lives = 5;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime)
        {
            this.time += deltaTime;
            if (this.time >= this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // handle enemies
            if (this.enemyTimer > this.enemyInterval)
            {
                this.addEnemy();
                this.enemyTimer = 0;
            }
            else this.enemyTimer += deltaTime;
            this.enemies.forEach(enemy =>
            {
                enemy.update(deltaTime);
            });
            // handle floating message
            this.floatingMessages.forEach(m =>
            {
                m.update();
            });
            // handle particles
            this.particles.forEach((particle, index) =>
            {
                particle.update();
            });
            if (this.particles.length > this.maxParticles)
            {
                // leave only 50 flames in the array
                this.particles.length = this.maxParticles;
            }
            // handle collision sprites
            this.collisions.forEach((collision, index) =>
            {
                collision.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(m => !m.markedForDeletion);
        }
        draw(ctx)
        {
            this.background.draw(ctx); // draw background first, background is behind
            this.player.draw(ctx);
            this.enemies.forEach(enemy =>
            {
                enemy.draw(ctx);
            });
            this.particles.forEach(particle =>
            {
                particle.draw(ctx);
            });
            this.collisions.forEach(collision =>
            {
                collision.draw(ctx);
            });
            this.floatingMessages.forEach(m =>
            {
                m.draw(ctx);
            });
            this.UI.draw(ctx);
        }
        addEnemy()
        {
            // this.speed > 0 means only background is scrolling/player is running
            if (this.speed > 0 && Math.random() < 0.5)
                this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }
    const game = new Game(canvas.width, canvas.height);

    function animate(timeStamp)
    {
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});