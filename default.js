class PlanningGUI {
    constructor() {
        // Construction and initiation of the GUI system
        this._canvas = document.getElementById("planningGUI"); // The canvas
        this._ctx = this._canvas.getContext("2d"); // The drawable object
        this.daysAhead = 100;
        
        //this.Scrollbar.draw(this._ctx);
        this.scrollPosition = {x: 0, y: 0};
        
        this.dynamicObjects = [];
        
        this._resources = [
            {'id': 1, 'name': 'A', 'role': 'Developer'},
            {'id': 2, 'name': 'A', 'role': 'Developer'},
            {'id': 3, 'name': 'A', 'role': 'Developer'},
            {'id': 4, 'name': 'A', 'role': 'Test'}
        ]
        /*Observable.addListener('change', function(e) {
            window.alert('my custom event');
        });*/
        // Binding of methods
        this.setSize = this.setSize.bind(this);
        this._draw = this._draw.bind(this);
        this._drawGrid = this._drawGrid.bind(this);
        this._drawHours = this._drawHours.bind(this);
        //this._drawScrollbar = this._drawScrollbar.bind(this);
        //this.init = this.init.bind(this);
        this._mousemove = this._mousemove.bind(this);
        this._mousedown = this._mousedown.bind(this);
        this._mouseup = this._mouseup.bind(this);
        this._mouseout = this._mouseout.bind(this);
        this.resize = this.resize.bind(this);
        // Execution of methods
        this.setSize();
        let scrollBarData1 = {
            viewport: {
                x: 0 + 100, 
                y: 0, 
                width: this._canvas.width - 100, 
                height: this._canvas.height
            }, 
            content: {
                width: this.daysAhead * 31, 
                height: 1000
            },
            position: 0,
            orientation: 'HORIZONTAL'
        }
        this.dynamicObjects.push(new ScrollBar(this._ctx, scrollBarData1));
        let scrollBarData2 = {
            viewport: {
                x: 0 + 100, 
                y: 0, 
                width: this._canvas.width - 100, 
                height: this._canvas.height
            }, 
            content: {
                width: this.daysAhead * 31, 
                height: 1000
            },
            position: 0,
            orientation: 'VERTICAL'
        }
        this.dynamicObjects.push(new ScrollBar(this._ctx, scrollBarData2));
        this.dynamicObjects.push(new CrossHair(this._ctx));
        this._propagateHandlers('init');
        this._draw();
        
        Observable.addListener('scrollbarMove', this._draw);
        Observable.addListener('mouseMove', this._draw);

        this._canvas.addEventListener('mousemove', this._mousemove);
        this._canvas.addEventListener('mousedown', this._mousedown);
        this._canvas.addEventListener('mouseup', this._mouseup);
        this._canvas.addEventListener('mouseout', this._mouseout);
        window.addEventListener('resize', this.resize);
        this._canvas.addEventListener('contextmenu', function(e) {e.preventDefault();});
        this._mousemove(undefined);
    }

    _propagateHandlers(method, params = undefined) {
        for (var i = 0; i < this.dynamicObjects.length; i++) {
            if (isFunction(this.dynamicObjects[i][method])){
            this.dynamicObjects[i][method](params);
                }
        }
        
    }
    resize(e) {
        this._propagateHandlers('resize');
    }
    _mousemove(e) {
        var m_posx = 0, m_posy = 0, e_posx = 0, e_posy = 0; // Defaults
        //get mouse position on document crossbrowser
        if (!e){e = window.event;}
        if (e.pageX || e.pageY){
            m_posx = e.pageX;
            m_posy = e.pageY;
        } else if (e.clientX || e.clientY){
            m_posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            m_posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        var tmpObj = this._canvas;
        //get parent element position in document
        if (tmpObj.offsetParent){
            do { 
                e_posx += tmpObj.offsetLeft;
                e_posy += tmpObj.offsetTop;
            } while (tmpObj = tmpObj.offsetParent);
        }
        //this.calculate(m_posx-e_posx, m_posy-e_posy)
        this.mouseX = m_posx-e_posx;
        this.mouseY = m_posy-e_posy;
        $('#xC').text(this.mouseX);
        $('#yC').text(this.mouseY);
        this._propagateHandlers('mousemove', {e: e, x: this.mouseX, y: this.mouseY})
    }
    
    _mousedown(e) {
        $('#BP').text('Ja');
        this._propagateHandlers('mousedown', {e: e, x: this.mouseX, y: this.mouseY});
    }
    _mouseup(e) {
        if (e.button == 2) {
            e.preventDefault();
        }
        $('#BP').text('Nee');
        this._propagateHandlers('mouseup', {e: e, x: this.mouseX, y: this.mouseY});
    }
    _mouseout(e) {
        //this._mouseup(e);
        //this._propagateHandlers('mouseout', {e: e});
    }
    
    setSize(e = false) {
        //window.alert(document.getElementById('cWrap1').width);
        this._canvas.width = $($(this._canvas).parent()).width();
        this._canvas.height = $($(this._canvas).parent()).height();
        if (e != false) {
            this._draw();
        }
    }
    
    _draw(e) {
        if (e != undefined) {
            if (e.event == 'scrollbarMove') {
                if (e.isHorizontal) {
                    this.scrollPosition.x = e.position;
                } else {
                    this.scrollPosition.y = e.position;
                }
                
            }
        }
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._drawGrid();
        this._drawHours();
        for (var i = 0; i < this.dynamicObjects.length; i++) {
            this.dynamicObjects[i].draw();
        }
    }
    _drawGrid() {
        let startX = 100;
        let startY = 30;
        let rowHeight = 30;
        for (var i=0; i<this._resources.length; i++) {
            this._ctx.beginPath();
            if (i & 1) {
                this._ctx.fillStyle='#DCDCDC';
            } else {
                this._ctx.fillStyle='#D3D3D3';
            }
            this._ctx.fillRect(
                startX,
                (i*rowHeight+startY),
                this._canvas.width,
                rowHeight
            );
            this._ctx.closePath();
        }
    }
    _drawHours() {
        let startX = 100;
        for (var i=0; i<this.daysAhead; i++) {
            let xPos = (i*31+startX-this.scrollPosition.x);
            if (xPos + 0.5 >= startX && xPos + 0.5 <= (this._canvas.width - 24)) {
                this._ctx.strokeStyle='red';
                this._ctx.beginPath();
                this._ctx.moveTo(xPos + 0.5, 0);
                this._ctx.lineTo(xPos + 0.5, this._canvas.height);
                this._ctx.stroke();
                this._ctx.closePath();
            }
        }
    }

}

window.addEventListener('load', function(e) {
    var Chart1 = new PlanningGUI();
});