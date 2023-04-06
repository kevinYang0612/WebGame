class Layer
{
    /**
     * @param game we need to aware the game width and height
     * @param width actual background width
     * @param height actual background height
     * @param speedModifier each layer will move at a different speed
     * @param image each layer will have a different image
     * */
    constructor(game, width, height, speedModifier, image)
    {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }
    update()
    {
        if (this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }
    draw(ctx)
    {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}
export class Background
{
    constructor(game)
    {
        this.game = game;
        this.width = 1667;
        this.height = 500;
        this.layerImage5 = layer5;
        this.layerImage4 = layer4;
        this.layerImage3 = layer3;
        this.layerImage2 = layer2;
        this.layerImage1 = layer1;
        this.layer5 = new Layer(this.game, this.width, this.height,
            1, this.layerImage5);
        this.layer4 = new Layer(this.game, this.width, this.height,
            0.8, this.layerImage4);
        this.layer3 = new Layer(this.game, this.width, this.height,
            0.6, this.layerImage3);
        this.layer2 = new Layer(this.game, this.width, this.height,
            0.4, this.layerImage2);
        this.layer1 = new Layer(this.game, this.width, this.height,
            0, this.layerImage1);
        /**
         * hold all background layers, sequence matters here
         * draw and list the furthest to the closest background in array
         * */
        this.backgroundLayers = [this.layer1, this.layer2,
            this.layer3, this.layer4, this.layer5];
    }
    // Background class is updating each layer update()
    update()
    {
        this.backgroundLayers.forEach(layer =>
        {
            layer.update();
        });
    }
    // Background class is drawing each layer draw()
    draw(ctx)
    {
        this.backgroundLayers.forEach(layer =>
        {
            layer.draw(ctx);
        });
    }
}
