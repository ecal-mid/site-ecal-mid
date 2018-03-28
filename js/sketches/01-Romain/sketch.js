/*
 * sketch.js
 *
 * Source code of the interactive homepage of http://ecal-mid.ch
 *
 * Author:
 *    Romain Cazier
 *    romaincazier.com
 *    @romaincazier
 *
 * Default variables:
 *    "loop", the animation loop,
 *    "frameCount", the number of frames elapsed,
 *    "canvas", the canvas itself
 *    "ctx", the canvas' drawing context
 *    "width", the canvas' width
 *    "height", the canvas' height
 *    "pointerX", mouse/touch position
 *    "pointerY", mouse/touch position
 *
 * Default functions:
 *    "setup()"
 *    "update()"
 *    "draw()"
 *    "play()"
 *    "pause()"
 *
 */

var arcSize,
    arcs,
    frameCount,
    offsetX,
    offsetY,
    invert;

canvas.addEventListener('click', function(e) {
    invert = !invert;
}, false);

function setup() {
    arcSize = 25;
    arcs    = [];

    frameCount = 0;

    var inc = 0;
    for(var y = 0; y < height + arcSize; y += arcSize * .89) {
        for(var x = (inc++ % 2 == 0 ? 0 : -arcSize / 2); x < width + arcSize; x += arcSize) {
            arcs.push(new Arc(x + arcSize / 2, y + arcSize / 2, arcSize));
        }
    }

    offsetX = (width - (arcs[arcs.length - 1].x + arcSize / 2)) / 2;
    offsetY = (height - (arcs[arcs.length - 1].y + arcSize / 2)) / 2;

    for(var i = 0, l = arcs.length; i < l; i++) {
        arcs[i].x += offsetX;
        arcs[i].y += offsetY;
    }

    invert = false;

    draw();
}

function update() {
    pointerX += (newPointerX - pointerX) * .1;
    pointerY += (newPointerY - pointerY) * .1;

    for(var i = 0, l = arcs.length; i < l; i++) {
        arcs[i].update();
    }
}

function draw() {
    update();
    ctx.save();
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, width, height);

    /* START DRAWING STUFF */

    for(var i = 0, l = arcs.length; i < l; i++) {
        arcs[i].draw();
    }

    /* END DRAWING STUFF */

    ctx.restore();
    frameCount++;
    loop = requestAnimationFrame(draw);
}

function play() {
    draw();
}

function pause() {
    window.cancelAnimationFrame(loop);
}

var Arc = function(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.a = 0;
    this.c = 1;
}

Arc.prototype = {
    update: function() {
        var X = pointerX - this.x,
            Y = pointerY - this.y;

        this.a = Math.atan2(Y, X);
        this.c = Math.sqrt(X * X + Y * Y);
        if(invert) this.c = constrain(map(this.c, 1, width > height ? height : width, 1, 0), 0, 1);
        else this.c = constrain(map(this.c, 1, width > height ? height : width, 0, 1), 0, 1);
    },

    draw: function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.a);
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.arc(0, 0, this.s / 2 * this.c, 0, Math.PI * 2 * this.c);
        ctx.fill();
        ctx.restore();
    }
}

setup();
