class ScrollBar {
        
    constructor(ctx, data) {
        this.thickness = 24;
        this.drag = false;
        this.ctx = ctx;
        this.data = data;
        if (this.data.orientation == 'HORIZONTAL') {
            this.isHorizontal = true;
        } else {
            this.isHorizontal = false;
        }
        this.area = {};
        this.bar = {};
    }

    setArea() {
        if (this.isHorizontal) {
             this.area = {
                    x: (this.data.viewport.x),
                    y: (this.data.viewport.y + this.data.viewport.height - this.thickness),
                    width: this.data.viewport.width,
                    height: this.thickness
                }
            if (this.data.viewport.height < this.data.content.height) {
                this.area.width = this.area.width - this.thickness;
            }
        } else {
            this.area = {
                    x: (this.data.viewport.x + this.data.viewport.width - this.thickness),
                    y: (this.data.viewport.y),
                    width: this.thickness,
                    height: this.data.viewport.height
                }
            if (this.data.viewport.width < this.data.content.width) {
                this.area.height = this.area.height - this.thickness
            }
        }
    }
    setBar() {
        if (this.isHorizontal) {
            this.bar = {
                x: this.area.x + 0,
                y: this.area.y + 2,
                width: ((this.area.width / this.data.content.width) * this.area.width) - 4,
                height: this.area.height - 4,
                position: this.data.position,
                originalposition: this.data.position
            }
        } else {
            this.bar = {
                x: this.area.x + 2,
                y: this.area.y + 0,
                width: this.area.width - 4,
                height: ((this.area.height / this.data.content.height) * this.area.height) - 4,
                position: this.data.position,
                originalposition: this.data.position
            }
        }
    }
    init() {
        this.setArea();
        this.setBar();
        Observable.addListener('draw', this.draw);
    }
    drawSquare(x, width, y, height, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x,
            y,
            width,
            height
        );
        this.ctx.closePath();
    }
    
    draw() {
        this.drawSquare(this.area.x, this.area.width, this.area.y, this.area.height, '#000000'/*'#F5F5F5'*/);
        let color = '#D3D3D3';
        if (this.drag) {
            color = '#808080';
        }
        if (this.isHorizontal) {
            this.drawSquare(this.area.x + this.bar.position + 2, this.bar.width, this.area.y + 2, 20, color);
        } else {
            this.drawSquare(
                this.area.x + 2, 
                20, 
                this.area.y + this.bar.position + 2, 
                this.bar.height, 
                color);
        }
        
    }
    mousemove(args) {
        if (this.drag) {
            let position = this.bar.position;
            if (this.isHorizontal) {
                 this.bar.position = this.bar.originalposition + (args.x - this.mouseXStart);
                if (this.bar.position < 0) {
                   this.bar.position = 0;
                } else {
                    if ((this.area.x + this.bar.position + this.bar.width) > this.area.x + this.area.width) {
                        this.bar.position = (this.area.width - this.bar.width - 4);
                    }
                }
            } else {
                 this.bar.position = this.bar.originalposition + (args.y - this.mouseYStart);
                if (this.bar.position < 0) {
                   this.bar.position = 0;
                } else {
                    if ((this.area.y + this.bar.position + this.bar.height) > this.area.y + this.area.height) {
                        this.bar.position = (this.area.height - this.bar.height - 4);
                    }
                }
            }
            if (position != this.bar.position) {
                Observable.emit('scrollbarMove', {event: 'scrollbarMove', position: this.bar.position, isHorizontal: this.isHorizontal});
            }
        }
    }
    resize(args) {
        
    }
    checkArea(args) {
        let coords = {x: this.area.x, y: this.area.y}
        if (this.isHorizontal) {
            coords.x = coords.x + this.bar.position;
            if (args.x >= coords.x && args.x <= coords.x + this.bar.width && args.y >= coords.y && args.y <= coords.y + this.bar.height) {
                return true;
            } else {
                return false;
            }
        } else {
            coords.y = coords.y + this.bar.position;
            if (args.x >= coords.x && args.x <= coords.x + this.bar.width && args.y >= coords.y && args.y <= coords.y + this.bar.height) {
            return true;
        } else {
            return false;
        }
        }
        //console.log(args.x + ' >= ' + coords.x + ' = ' + (args.x >= coords.x));
        //console.log(args.x + ' <= ' + (coords.x  + this.bar.width) + ' = ' + (args.x <= coords.x + this.bar.widh));
        
    }
    mousedown(args) {
        if (args.e.button == 0) {
            if (this.checkArea(args)) {
                if (!this.drag) {
                        this.bar.originalposition = this.bar.position;
                        this.mouseXStart = args.x;
                        this.mouseYStart = args.y;
                    }
                    this.drag = true;
            } else {
                this.drag = false;
            }
            Observable.emit('scrollbarMove', {event: 'scrollbarMove', position: this.bar.position, isHorizontal: this.isHorizontal});
        }
    }
    mouseup(args) {
        if (args.e.button == 0) {
            this.drag = false;
            Observable.emit('scrollbarMove', {event: 'scrollbarMove', position: this.bar.position});
        }
    }
    mouseout(args) {
        this.drag = false;
        Observable.emit('scrollbarMove', {event: 'scrollbarMove', position: this.bar.position});
    }
}