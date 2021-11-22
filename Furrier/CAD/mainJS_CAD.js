var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var keys = [];
var ratony = 0;
var ratonx = 0;
window.onkeyup = function (e) { keys[e.keyCode] = false; }
window.onkeydown = function (e) { keys[e.keyCode] = true; }

let objs = [];

let mouseDown = false;

function distance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
}

canvas.addEventListener('mousemove', function onMouseover(e) {
    ratonx = e.clientX;
    ratony = e.clientY;
    if (mouseDown) {
        let space = true;
        for (let i = 0; i < objs.length; i++) {
            const elm = objs[i];
            if (distance(elm, { "x": ratonx, "y": ratony }) < 30) {
                space = false;
            }

        }
        if (space)
            objs.push({ "x": ratonx, "y": ratony });
    }
});

function onMouseDown() {
    if(keys[66]){
        for (let i = 0; i < objs.length; i++) {
            const elm = objs[i];
            if (distance(elm, { "x": ratonx, "y": ratony }) < 30) {
                objs.splice(i,1);
                break;
            }

        }
    }else
    mouseDown = true;
    console.log("down")
}

function onMouseUp() {
    console.log("up")
    mouseDown = false;

}

function tick() {

    canvas.height = canvas.clientHeight;

    canvas.width = canvas.clientWidth;

    for (let i = 0; i < objs.length; i++) {
        const element = objs[i];
        draw(element);
    }

    ctx.beginPath();
    let firstElm = objs[0];
    ctx.moveTo(firstElm.x, firstElm.y);
    
    for (let i = 1; i < objs.length; i++) {
        const elm = objs[i];
        ctx.lineTo(elm.x, elm.y);
    }

    ctx.stroke();

}

function draw(elm) {
    ctx.beginPath();
    ctx.arc(elm.x, elm.y, 15, 0, 2 * Math.PI);
    ctx.stroke();
}

function output(){
    let out = JSON.parse(JSON.stringify(objs))

    for (let i = 0; i < out.length; i++) {
        out[i] = {"x":out[i].x-canvas.width/2 , "y":out[i].y-canvas.height/2}
    }
    
    console.log(JSON.stringify(out))
}

setInterval(tick, 10);