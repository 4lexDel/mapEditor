class Game extends GameBase { //A renommer ?
    constructor(canvas, fullscreen = true) {
        super(canvas, fullscreen)

        this.init();
    }

    async init() {
        this.resize();

        this.initEvent();

        /*----------------IMG-----------------*/
        const urls = [];

        /*---------Draw settings----------*/
        this.FPS = 60;
        this.prevTick = 0;
        /*--------------------------------*/

        this.mousePressed = false;

        this.mouseX = 0;
        this.mouseY = 0;

        /*---------Editor settings----------*/
        this.size = 40; // taille d'un hexagone
        this.cols = Math.floor(this.canvas.width / (this.size / 2)); // nombre de colonnes
        this.rows = Math.floor(this.canvas.height / (this.size / 2)); // nombre de lignes

        this.alpha = 2 * Math.PI / 6;

        this.grid = [];

        for (var x = 0; x < this.rows; x++) {
            for (var y = 0; y < this.cols; y++) {
                var coordX = x * 3 * Math.cos(this.alpha) * this.size;
                var coordY = y * 2 * Math.sin(this.alpha) * this.size + (x % 2) * Math.sin(this.alpha) * this.size;
                this.createHexagon(coordX, coordY);
            }
        }

        /**---------------START----------------- */
        this.draw();
    }

    createHexagon(x, y) {
        let points = [];

        points.push({ x: x + this.size * Math.cos(0), y: y + this.size * Math.sin(0) });

        for (var i = 1; i <= 6; i++) {
            points.push({ x: x + this.size * Math.cos(i * this.alpha), y: y + this.size * Math.sin(i * this.alpha) });
        }

        this.grid.push(new Hexagon(x, y, points));
    }

    initEvent() {
        // this.canvas.onmouseup = (e) => {
        //     this.mouseAction(e);
        //     this.mousePressed = false;
        // }

        // this.canvas.onmousedown = (e) => {
        //     console.log("1");
        //     this.mousePressed = true;
        // }

        console.log(this.canvas);

        this.canvas.onmousedown = (e) => {
            this.selectHexagon(e);
        };
        this.canvas.onmouseup = (e) => {
            this.mousePressed = false;
        };
        this.canvas.onmousemove = (e) => { this.refreshMouseCoord(e); };

        this.canvas.addEventListener('touchstart', (e) => {
            this.refreshTouchCoord(e);
            this.mousePressed = true;
        }, false);

        this.canvas.addEventListener('touchmove', (e) => {
            this.refreshTouchCoord(e);
        }, false);

        this.canvas.addEventListener('touchend', (e) => {
            this.refreshTouchCoord(e);
            this.mousePressed = false;
        }, false);

        window.onresize = (e) => {
            this.resize();
        };

        document.addEventListener("keydown", (e) => { //KEYBOARD EVENT
            // console.log("|" + e.key + "|");
            switch (e.key) {
                case " ":
                    break;
                    // case "ArrowUp":
                    //     socket.emit("move", 0, -5);
                    //     break;

                    // case "ArrowDown":
                    //     socket.emit("move", 0, 5);
                    //     break;

                    // case "ArrowRight":
                    //     socket.emit("move", 5, 0);
                    //     break;

                    // case "ArrowLeft":
                    //     socket.emit("move", -5, 0);
                    //     break;
            }
        });
    }

    // mouseAction(e) {
    //     let coord = MouseControl.getMousePos(this.canvas, e);
    //     //let val = e.which == 1 ? 1 : 0;
    //     //this.map.setTileID(coord.x, coord.y, val);
    //     this.manageCoords(coord.x, coord.y);
    // }
    selectHexagon(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);

        this.mouseX = coord.x;
        this.mouseY = coord.y;

        if (this.grid.length > 0) {
            let target = this.grid[0];
            let currentDist = this.dist(target.x, target.y, this.mouseX, this.mouseY);

            for (let i = 1; i < this.grid.length; i++) {
                let d = this.dist(this.grid[i].x, this.grid[i].y, this.mouseX, this.mouseY);

                if (d < currentDist) {
                    target = this.grid[i];
                    currentDist = d;
                }
            }

            if (target.type != 1) target.type = 1;
            else target.type = 0;
        }
    }

    dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    refreshTouchCoord(e) {
        let coord = TouchControl.getTouchPos(this.canvas, e);

        this.mouseX = coord.x;
        this.mouseY = coord.y;
    }

    refreshMouseCoord(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);

        this.mouseX = coord.x;
        this.mouseY = coord.y;
    }

    draw() {
        /*------------------------------FPS-----------------------------*/
        window.requestAnimationFrame(() => this.draw());

        let now = Math.round(this.FPS * Date.now() / 1000);
        if (now == this.prevTick) return;
        this.prevTick = now;
        /*--------------------------------------------------------------*/

        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
        this.ctx.fillStyle = "rgb(210,210,210)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        /*------------------------------GRID-----------------------------*/
        // for (var x = 0; x < this.rows; x++) {
        //     for (var y = 0; y < this.cols; y++) {
        //         var coordX = x * 3 * Math.cos(this.alpha) * this.size;
        //         var coordY = y * 2 * Math.sin(this.alpha) * this.size + (x % 2) * Math.sin(this.alpha) * this.size;
        //         this.drawHexagon(coordX, coordY);
        //     }
        // }
        this.displayGrid();
    }

    displayGrid() {
        this.grid.forEach(hexagon => {
            let color = "white"

            switch (hexagon.type) {
                case 0:
                    color = "#53B654";
                    break;

                case 1:
                    color = "red";
                    break;
            }

            this.ctx.fillStyle = color;

            this.ctx.beginPath();
            this.ctx.moveTo(hexagon.points[0].x, hexagon.points[0].y);
            for (var i = 1; i <= 6; i++) {
                this.ctx.lineTo(hexagon.points[i].x, hexagon.points[i].y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.fill();
        });
    }

    drawHexagon(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.size * Math.cos(0), y + this.size * Math.sin(0));
        for (var i = 1; i <= 6; i++) {
            this.ctx.lineTo(x + this.size * Math.cos(i * this.alpha), y + this.size * Math.sin(i * this.alpha));
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

class Hexagon {
    constructor(x, y, points) {
        this.x = x;
        this.y = y;
        this.points = points;
        this.type = 0;
    }
}