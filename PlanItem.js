class PlanItem {
    constructor(ctx, canvasWidth, contentLength, xStart, yStart, xPosition = 0) {
        this.ctx = ctx;
        this.xStart = xStart;
        this.canvasWidth = canvasWidth;
        this.maxSize = canvasWidth - xStart; // let maxSize = this._canvas.width - 100;
        this.size = (this.maxSize / contentLength) * this.maxSize; // let size = (maxSize / (this.daysAhead * 31)) * maxSize;
        this.xPosition = xPosition;
        this.drag = false;
        this.x0 = xStart + xPosition;
        this.y0 = yStart;
        this.draw = this.draw.bind(this);
        Observable.addListener('draw', this.draw);
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#F5F5F5';
        this.ctx.fillRect(
            this.xStart,
            this.y0 - 24,
            this.maxSize,
            24
        );
        this.ctx.closePath();
        this.ctx.beginPath();
        if (this.drag) {
            this.ctx.fillStyle = '#808080';
        } else {
            this.ctx.fillStyle='#D3D3D3';
        }
        this.ctx.fillRect(
            this.x0 + this.xPosition,
            this.y0 - 22,
            this.size,
            20
        );
        this.ctx.closePath();
    }
    mousemove(args) {
        if (this.drag) {
            let xPosition = this.xPosition;
            this.xPosition = this.xPositionOriginal + (args.x - this.mouseXStart);
            if (this.xPosition < 0) {
               this.xPosition = 0;
            } else {
                if ((this.x0 + this.xPosition + this.size) > this.canvasWidth) {
                    this.xPosition = this.canvasWidth - this.size - this.x0;
                }
            }
            if (xPosition != this.xPosition) {
                Observable.emit('scrollbarMove', {event: 'scrollbarMove', position: this.xPosition});
            }
        }
    }
    mousedown(args) {
        if (args.e.button == 0) {
            if (args.x >= this.x0 + this.xPosition && args.x <= this.x0 + this.xPosition + this.size && args.y >= this.y0 - 22 && args.y <= this.y0 - 2) {
                if (!this.drag) {
                    this.xPositionOriginal = this.xPosition;
                    this.mouseXStart = args.x;
                    this.mouseYStart = args.y;
                }
                this.drag = true;
                Observable.emit('scrollbarMove', {event: 'scrollbarMove', position: this.xPosition});
            } else {
                this.drag = false;
                Observable.emit('scrollbarMove', {event: 'scrollbarMove', position: this.xPosition});
            }
        }
    }
    mouseup(args) {
        if (args.e.button == 0) {
            this.drag = false;
            Observable.emit('scrollbarMove', {event: 'scrollbarMove', position: this.xPosition});
        }
    }
    mouseout(args) {
        this.drag = false;
        Observable.emit('scrollbarMove', {event: 'scrollbarMove', position: this.xPosition});
    }
}