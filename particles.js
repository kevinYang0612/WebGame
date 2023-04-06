class Particle
{
    constructor(game)
    {
        this.game = game;
        this.markedForDeletion = false;
    }
    update()
    {
        /**
         * particles follow behind the player,
         * this.game.speed = this.game.maxSpeed * speed
         * (the base/background scrolling speed) * (as a param
         * passed in when running or rolling);
         * */
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.97;  // every frame the size of each particle decrease 5%
        if (this.size < 0.5) this.markedForDeletion = true;
    }
}

export class Dust extends Particle
{
    constructor(game, x, y)
    {
        super(game);
        this.size = Math.random() * 10 + 8;
        this.x = x;
        this.y = y;
        this.speedX = Math.random(); // each particle random speed
        this.speedY = Math.random();
        this.color = 'rgba(0, 0, 0, 0.4)';
    }
    draw(ctx)
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
export class Splash extends Particle
{
    constructor(game, x, y)
    {
        super(game);
        this.x = x;
        this.y = y + 30;
        this.size = Math.random() * 100 + 50;
        // each one small flame randomly to go anywhere
        this.speedX = Math.random() * 6 - 4;
        this.speedY = Math.random() * 2 + 1;
        this.gravity = 0;  // each flame falls down
        this.image = fire;
    }
    update()
    {
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity;
    }
    draw(ctx)
    {
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}
export class Fire extends Particle
{
    constructor(game, x, y)
    {
        super(game);
        this.image = fire;
        this.size = Math.random() * 100 + 50;
        this.x = x;
        this.y = y;
        this.speedX = 1;
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
    }
    update()
    {
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 10);
        // wave left and right going up
    }
    draw(ctx)
    {
        /**
         * save() method to save the current state and restore()
         * to restore to original default state
         */
        ctx.save();
        ctx.translate(this.x, this.y);
        // translate position default at 0, 0 to current x, y
        ctx.rotate(this.angle);
        // drawImage of this.image(fire), width and height is parent class 'this.size'
        // this.size is shrinking by 0.5 every loop
        // drawing this.image, 0, 0 is top left corner of fire image, needs to center fire image
        ctx.drawImage(this.image, -this.size * 0.5 + 7, -this.size * 0.5 + 7, this.size, this.size);
        // ctx translate the center point from 0, 0 to current x, y.
        // drawImage will draw at current center point, which is 0, 0
        ctx.restore();
    }
}