class GameBase {
    constructor(canvas, fullscreen = true) {
        this.canvas = canvas;

        this.ctx = this.canvas.getContext("2d");

        window.onresize = (e) => {
            this.canvas.resize();
        };
    }

    resize() {
        if (this.fullscreen) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
        } else {
            this.canvas.width = this.canvas.offsetParent.clientWidth;
            this.canvas.height = this.canvas.offsetParent.clientHeight;

            // let widthTest = this.canvas.offsetParent.clientWidth;
            // let heightTest = this.canvas.offsetParent.clientHeight;

            // let val = Math.min(widthTest, heightTest);
            // this.canvas.width = val;
            // this.canvas.height = val;
        }
        this.cols = Math.floor(this.canvas.width / (this.size / 2)); // nombre de colonnes
        this.rows = Math.floor(this.canvas.height / (this.size / 2)); // nombre de lignes

        // this.canvas.width = document.documentElement.clientWidth;
        // this.canvas.height = document.documentElement.clientHeight;
    }

    preloadImages(urls) { //Load IMG by URL and return Image instance
        const promises = urls.map((url) => {
            return new Promise((resolve, reject) => {
                const image = new Image();

                image.src = url;

                image.onload = () => resolve(image);
                image.onerror = () => reject(`Image failed to load: ${url}`);
            });
        });

        return Promise.all(promises);
    }
}