/**
 * Navigate enemy sprite sheets
 * */
class Enemy
{
    constructor()
    {
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }
    /** move enemies around */
    update(deltaTime)
    {
        this.x -= this.speedX + this.game.speed;
        // + this.game.speed make in relation of dynamically scrolling game
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval)
        {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        }
        else this.frameTimer += deltaTime;
        // check if off screen
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    /** draw enemies */
    draw(ctx)
    {
        if (this.game.debug)
        {
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2,
                this.width / 2.5, 0, Math.PI * 2);
            ctx.stroke();
            // ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        ctx.drawImage(this.image,
            this.frameX * this.width, 0,
            this.width, this.height,
            this.x, this.y, this.width, this.height);
    }
}

export class FlyingEnemy extends Enemy
{
    constructor(game)
    {
        super();
        this.game = game;
        this.width = 360 / 6;
        this.height = 44;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = enemy_fly;
        // sin curve, va is making each flying enemy to have different angle
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }
    update(deltaTime)
    {
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

export class GroundEnemy extends Enemy
{
    constructor(game)
    {
        super();
        this.game = game;
        this.width = 120 / 2;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = enemy_plant;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
    }
    draw(ctx)
    {
        if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image,
            this.frameX * this.width, 0,
            this.width, this.height,
            this.x, this.y, this.width, this.height);
    }

}
export class ClimbingEnemy extends Enemy
{
    constructor(game)
    {
        super();
        this.game = game;
        this.spriteWidth = 720 / 6;
        this.spriteHeight = 144;
        this.width = this.spriteWidth * 0.7;
        this.height = this.spriteHeight * 0.7;
        this.x = this.game.width; // coming from right edge of screen
        this.y = Math.random() * this.game.height * 0.5; // top half randomly
        this.image = enemy_spider_big;
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
    }
    update(deltaTime)
    {
        super.update(deltaTime);
        if (this.y > this.game.height - this.height - this.game.groundMargin)
            this.speedY *= -1;
        if (this.y < -this.height) this.markedForDeletion = true;
    }
    draw(ctx)
    {
        if (this.game.debug)  ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image,
            this.frameX * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
        // spider web string
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, 0);
        ctx.lineTo(this.x + this.width / 2, this.y + 35);
        ctx.stroke();
    }
}