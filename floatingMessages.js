/**
 * this class is doing the floating message +1 when player kills an enemy
 * the +1 floats from enemy.x enemy.y to top left corner
 * */
export class FloatingMessages
{
    /**
     * @param value : +1
     * @param x, where initial appear +1
     * @param y
     * @param targetX where it's going
     * @param targetY
     * */
    constructor(value, x, y, targetX, targetY)
    {
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.markedForDeletion = false;
        this.timer = 0;
    }
    update()
    {
        // x and y are going toward to the top left corner, with 4% less pixels
        // it travels slower and slower
        this.x += (this.targetX - this.x) * 0.04;
        this.y += (this.targetY - this.y) * 0.04;
        this.timer++;
        if (this.timer > 100) this.markedForDeletion = true;
    }
    draw(ctx)
    {
        ctx.font = '20px Creepster';
        ctx.fillStyle = 'white';
        ctx.fillText(this.value, this.x, this.y);
        ctx.fillStyle = 'black';
        ctx.fillText(this.value, this.x - 2, this.y - 2);
    }

}