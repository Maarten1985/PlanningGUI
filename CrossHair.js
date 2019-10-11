class CrossHair {
    constructor(ctx, data) {
        this.ctx = ctx;
        this.coords = {x: 0, y: 10};
        //console.log(this.ctx);
        //Observable.addListener('draw', this.draw)
    }
    draw() {
        this.ctx.strokeStyle='red';
                this.ctx.beginPath();
                this.ctx.moveTo(this.coords.x - 20 + 0.5, this.coords.y + 0.5);
                this.ctx.lineTo(this.coords.x - 10 + 0.5, this.coords.y + 0.5);
                this.ctx.stroke();
                this.ctx.closePath();
        
        this.ctx.beginPath();
                this.ctx.moveTo(this.coords.x +10, this.coords.y + 0.5);
                this.ctx.lineTo(this.coords.x + 20, this.coords.y + 0.5);
                this.ctx.stroke();
                this.ctx.closePath();
        
         this.ctx.beginPath();
                this.ctx.moveTo(this.coords.x + 0.5, this.coords.y + 0.5 - 20);
                this.ctx.lineTo(this.coords.x + 0.5, this.coords.y + 0.5 - 10);
                this.ctx.stroke();
                this.ctx.closePath();
        
        this.ctx.beginPath();
                this.ctx.moveTo(this.coords.x + 0.5, this.coords.y + 0.5 + 10);
                this.ctx.lineTo(this.coords.x + 0.5, this.coords.y + 0.5 + 20);
                this.ctx.stroke();
                this.ctx.closePath();
    }
    mousemove(args) {
        this.coords = args;
        //console.log(this.coords);
        Observable.emit('mouseMove');
    }
}