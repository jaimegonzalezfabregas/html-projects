var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var keys = [];

var ratonPos = { "x": 0, "y": 0 }
window.onkeyup = function (e) { keys[e.keyCode] = false; }
window.onkeydown = function (e) { keys[e.keyCode] = true; }

let handles = [];

let mouseDown = false;

let handleRad = 15;

function d(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
}

function subPos(a, b) {
    return { "x": a.x - b.x, "y": a.y - b.y }

}

function addPos(a, b) {
    return { "x": a.x + b.x, "y": a.y + b.y }
}

function cpPos(a) {
    return addPos(a, { "x": 0, "y": 0 })
}

let moving = -1;
let movingHandle = "";

canvas.addEventListener('mousemove', function onMouseover(e) {
    ratonPos.x = e.clientX;
    ratonPos.y = e.clientY;
    // console.log(moving, movingHandle)
    if (mouseDown) {
        if (moving == -1) {
            for (let i = 0; i < handles.length; i++) {
                if (d(ratonPos, handles[i].center) < handleRad) {
                    handles[i].a = addPos(handles[i].a, subPos(ratonPos, handles[i].center))
                    handles[i].b = addPos(handles[i].b, subPos(ratonPos, handles[i].center))

                    handles[i].center = cpPos(ratonPos);
                    moving = i;
                    movingHandle = "center"
                }
                if (d(ratonPos, handles[i].a) < handleRad) {
                    handles[i].a = cpPos(ratonPos);
                    moving = i
                    movingHandle = "a"
                }
                if (d(ratonPos, handles[i].b) < handleRad) {
                    handles[i].b = cpPos(ratonPos);
                    moving = i;
                    movingHandle = "b"
                }
            }
        } else {
            if(movingHandle == "center"){
                handles[moving].a = addPos(handles[moving].a, subPos(ratonPos, handles[moving].center))
                handles[moving].b = addPos(handles[moving].b, subPos(ratonPos, handles[moving].center))
            }
            handles[moving][movingHandle] = cpPos(ratonPos);
        }

    }
});

function onMouseDown() {
    let hit = false;
    for (let i = 0; i < handles.length && !hit; i++) {
        const elm = handles[i];
        if (d(elm.center, ratonPos) < handleRad || d(elm.b, ratonPos) < handleRad || d(elm.a, ratonPos) < handleRad) {
            hit = true;
            if (keys[66]) {
                handles.splice(i, 1);
            }
        }
    }

    console.log("colision:", hit)

    if (!hit) {
        handles.push({ "center": cpPos(ratonPos), "a": addPos(ratonPos, { "x": 30, "y": 0 }), "b": addPos(ratonPos, { "x": -30, "y": 0 }) })
    }
    mouseDown = true;
    console.log("down")
}

function onMouseUp() {
    console.log("up")
    moving = -1
    movingHandle = ""
    mouseDown = false;

}

function tick() {

    if (handles.length == 0) {
        return
    }

    canvas.height = canvas.clientHeight;

    canvas.width = canvas.clientWidth;

    for (let i = 0; i < handles.length; i++) {
        const element = handles[i];
        draw(element);
    }

    ctx.beginPath();
    let firstElm = handles[0];
    ctx.moveTo(firstElm.center.x, firstElm.center.y);

    for (let i = 1; i < handles.length +1; i++) {
        let start = handles[i - 1];
        let end = handles[i % handles.length];
        let res = 100;
        for (let i = 0; i < res; i++) {

            let t = i / (res-1);
            let P0 = start.center;
            let P1 = start.b;
            let P2 = end.a;
            let P3 = end.center;

            let x = (1 - t) ** 3 * P0.x + 3 * (1 - t) ** 2 * t * P1.x + 3 * (1 - t) * t ** 2 * P2.x + t ** 3 * P3.x;
            let y = (1 - t) ** 3 * P0.y + 3 * (1 - t) ** 2 * t * P1.y + 3 * (1 - t) * t ** 2 * P2.y + t ** 3 * P3.y;

            ctx.lineTo(x, y);


        }
    }

    ctx.stroke();

}

function draw(elm) {
    ctx.beginPath();
    ctx.arc(elm.center.x, elm.center.y, handleRad, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(elm.a.x, elm.a.y, handleRad*0.7, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(elm.b.x, elm.b.y, handleRad*0.7, 0, 2 * Math.PI);
    ctx.stroke();
}

function output() {

    let out = []    

    for (let i = 1; i < handles.length + 1; i++) {
        let start = handles[i - 1];
        let end = handles[i % handles.length];
        let res = 1000; // high numbers will guaranty that the result is very detailed but harder to compute
        for (let i = 0; i < res; i++) {

            let t = i / (res - 1);
            let P0 = start.center;
            let P1 = start.b;
            let P2 = end.a;
            let P3 = end.center;

            let x = (1 - t) ** 3 * P0.x + 3 * (1 - t) ** 2 * t * P1.x + 3 * (1 - t) * t ** 2 * P2.x + t ** 3 * P3.x;
            let y = (1 - t) ** 3 * P0.y + 3 * (1 - t) ** 2 * t * P1.y + 3 * (1 - t) * t ** 2 * P2.y + t ** 3 * P3.y;

            out.push({"x":x-canvas.width/2, "y":y-canvas.height/2});

        }
    }


    console.log(JSON.stringify(out))
    copyToClipboard(JSON.stringify(out))
    
}

function copyToClipboard(text) {
    const listener = function (ev) {
        ev.preventDefault();
        ev.clipboardData.setData('text/plain', text);
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
}

setInterval(tick, 10);