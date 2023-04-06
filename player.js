import {Standing, Sitting,
        Running, Jumping,
        Falling, Rolling,
        Diving, Hit} from "./playerStates.js";
import {CollisionAnimation} from "./collisionAnimation.js";
import {FloatingMessages} from "./floatingMessages.js";

export class Player
{
    constructor(game)
    {
        this.game = game;
        // sprite width and height
        this.width = 1200 / 12;
        this.height = 913 / 10;

        // position of player in canvas
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        // velocity and gravity
        this.vy = 0;
        this.weight = 1;
        // sprite sheet image
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 6; // different row/state may have different maxFrame
        this.speed = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.maxSpeed = 5;
        this.states = [new Standing(this.game), new Sitting(this.game),
                       new Running(this.game), new Jumping(this.game),
                       new Falling(this.game), new Rolling(this.game),
                       new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
    }
    update(input, deltaTime)
    {
        this.checkCollision();
        this.currentState.handleInput(input);
        // horizontal movement
        this.x += this.speed;
        /**
         * The includes() method determines whether an array
         * includes a certain value among its entries,
         * returning true or false as appropriate.
         * */
        // the player can move left and right even at other states such as jumping
        if (input.includes('ArrowRight') && this.currentState !== this.states[7])
            this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[7])
            this.speed = -this.maxSpeed;
        else this.speed = 0;

        // boundary of canvas edge
        if (this.x <= 0) this.x = 0;
        if (this.x >= this.game.width - this.width)
            this.x = this.game.width - this.width;

        // vertical movement
        this.y += this.vy;
        // falling, vy is like -20, -19, ...0, 1, 2. The y += vy, so be like
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        // vertical boundary
        if (this.y > this.game.height - this.height - this.game.groundMargin)
            this.y = this.game.height - this.height - this.game.groundMargin;

        // sprite animation
        if (this.frameTimer > this.frameInterval)
        {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        }
        else
            this.frameTimer += deltaTime;
    }

    draw(ctx)
    {
        if (this.game.debug)
        {
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 + 5, this.y + this.height / 2,
                this.width / 3, 0, Math.PI * 2);
            ctx.stroke();
            //ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        ctx.drawImage(this.image,
            this.frameX * this.width, this.frameY * this.height,
            this.width, this.height,
            this.x, this.y, this.width, this.height);
    }
    onGround()
    {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed) // param state is a type of State in playerStates.js
    {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed; // game.speed is 3px per frame
        this.currentState.enter();
    }
    checkCollision()
    {
        this.game.enemies.forEach(enemy =>
        {
            const dx = Math.abs((this.x + this.width / 2 + 5) - (enemy.x + enemy.width / 2));
            const dy = Math.abs((this.y + this.height / 2) - (enemy.y + enemy.height / 2));
            // from rect center to circle radius
            if (dx < (enemy.width / 2 + this.width / 3) &&
                dy < (enemy.height / 2 + this.width / 3))
            {
                enemy.markedForDeletion = true;
                this.game.collisions.push(
                    new CollisionAnimation
                    (
                        this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5
                    ));
                if (this.currentState === this.states[5] ||
                    this.currentState === this.states[6])
                {
                    this.game.score++;
                    this.game.floatingMessages.push(
                        new FloatingMessages('+1', enemy.x, enemy.y, 100, 45));
                }
                else
                {
                    this.setState(7, 0);
                    this.game.score -= 3;
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }

            }
        });
    }
}