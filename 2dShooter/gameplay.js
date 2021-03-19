let keys = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
let ratony = 0;
let ratonx = 0;
window.onkeyup = function (e) { keys[e.keyCode] = false; }
window.onkeydown = function (e) { keys[e.keyCode] = true; }

let walls = []
const lightSize = 10;

let maxV = 10;
let acceleration = 10;
let friction = 0.7;
let worldSize = 100;
let player = [2 * worldSize, 2 * worldSize];
let playerLast = player;
let hitBoxSize = 50;

function reorientVecToFaceVec(vec, gide, reverse) {
    let m = vec[0] * gide[0] < 0 || vec[1] * gide[1] < 0 ? -1 : 1
    m = (reverse ? -1 : 1) * m
    vec = [vec[0] * m, vec[1] * m]
    return vec;
}

function tick() {
    //w - 87
    //a - 65
    //s - 83
    //d - 68
    let nextLast = [player[0], player[1]]
    let shifting = keys[16] * -0.2
    let v = [(player[0] - playerLast[0] - (keys[65] - keys[68]) * acceleration) * (friction + shifting), (player[1] - playerLast[1] - (keys[87] - keys[83]) * acceleration) * (friction + shifting)]
    player = [player[0] + v[0], player[1] + v[1]]

    for (let w = 0; w < walls.length; w++) {
        const wall = walls[w];
        //console.log(distanceToWall(wall[0], wall[1], player))
        let d = distanceToWall(wall[0], wall[1], player)
        if (d < hitBoxSize) {

            let wallVec = [wall[0][0] - wall[1][0], wall[0][1] - wall[1][1]]

            let wallCenter = [(wall[0][0] + wall[1][0]) / 2, (wall[0][1] + wall[1][1]) / 2]
            let vecToWall = [wallCenter[0] - player[0], wallCenter[1] - player[1]]

            let normal = normalize([-wallVec[1], wallVec[0]], (hitBoxSize - d))
            console.log(wall)

            normal = reorientVecToFaceVec(normal, vecToWall, true)

            player = [player[0] + normal[0], player[1] + normal[1]]

        }

    }

    playerLast = nextLast;


    //console.log(player)

    rerender(player[0], player[1]);
}

function rerender(x, y) {
    //console.log("start render")
    // render sadows
    let canvas = document.getElementById("shadow")
    let ctx = canvas.getContext("2d");
    canvas.height = canvas.clientHeight
    canvas.width = canvas.clientWidth
    ctx.fillStyle = rgb(255, 255, 255)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let wall = 0; wall < walls.length; wall++) {
        const w = walls[wall];

        let wallCenter = [(w[0][0] + w[1][0]) / 2, (w[0][1] + w[1][1]) / 2]
        let vectorToWall = normalize(wallCenter, hitBoxSize)

        let light = [x, y]

        let shadowPoligon = []
        shadowPoligon.push(w[0])
        shadowPoligon.push(w[1])

        // project w[1]
        let vec1 = [light[0] - w[1][0], light[1] - w[1][1]]
        vec1 = normalize(vec1, 1000000)
        //console.log("vec1", w[1][0], vec1[0], w[1][1], vec1[1])
        shadowPoligon.push([w[1][0] - vec1[0], w[1][1] - vec1[1]])

        // project w[0]
        let vec0 = [light[0] - w[0][0], light[1] - w[0][1]]
        vec0 = normalize(vec0, 1000000)
        shadowPoligon.push([w[0][0] - vec0[0], w[0][1] - vec0[1]])

        //console.log("shadow polinome", shadowPoligon)

        drawPoligon(shadowPoligon, rgb(0, 0, 0), ctx, -x + canvas.width / 2, -y + canvas.height / 2)
    }

    // render background

    let bg = document.getElementById("bg")
    let bgCtx = bg.getContext("2d")
    bg.height = bg.clientHeight
    bg.width = bg.clientWidth

    var grd = bgCtx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 1000);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, "black");

    bgCtx.fillStyle = grd
    bgCtx.fillRect(0, 0, bg.width, bg.height);

    bgCtx.fillStyle = rgb(255, 100, 0)

    bgCtx.beginPath();
    bgCtx.arc(canvas.width / 2, canvas.height / 2,
        hitBoxSize,
        0, 2 * Math.PI);
    bgCtx.fill();


}

function normalize(vec, b) {
    let a = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]) / b
    return [vec[0] / a, vec[1] / a]
}


function start() {
    if (GameData != -1) {
        setInterval(() => {
            tick()
        }, 1000 / 60);
    } else {
        setTimeout(start, 100);
    }

}

function clean(walls) {
    for (let w1 = 0; w1 < walls.length; w1++) {
        let a = walls[w1];
        for (let w2 = w1 + 1; w2 < walls.length; w2++) {
            let b = walls[w2];
            let merge = false;


            if (eq(a[0], b[0])) {
                merge = true;
            } else if (eq(a[0], b[1])) {
                merge = true;
                b = [b[1], b[0]]
            } else if (eq(a[1], b[0])) {
                merge = true;
                a = [a[1], a[0]]
            } else if (eq(a[1], b[1])) {
                merge = true;
                b = [b[1], b[0]]
                a = [a[1], a[0]]
            }
            if (merge) {
                if (b[1] != a[1]) {
                    let result = [a[1], b[1]]
                    if (l(result) == l(a) + l(b)) {
                        walls.splice(w1, 1)
                        walls.splice(w2 - 1, 1)
                        walls.push(result)
                        return clean(walls)
                    }
                } else {
                    walls.splice(w1, 1)
                    return clean(walls)
                }

            }

        }
    }
    return walls
}

const cornerLeniency = 0.9

function distanceToWall(p1, p2, s) {
    return Math.sqrt(distToSegmentSquared(s, p1, p2))

    // euristic

    // let a = l([p1, p2])
    // let b = l([p2, s])
    // let c = l([s, p1])
    // let area = 0.25 * Math.sqrt(((a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c)))
    // // area = 1/2 * h * a ; h = area * 2 / a
    // //console.log(p1,p2,s)
    // let ret = area * 2 / a

    // if (b * cornerLeniency < hitBoxSize) {
    //     return a
    // }
    // if (c * cornerLeniency < hitBoxSize) {
    //     return c
    // }
    // if (b > a || c > a) {
    //     return hitBoxSize * 2
    // }


    // return ret;
}

function distToSegmentSquared(p, v, w) {
    let l2 = l([w, v]) * l([w, v]);
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.pow(l([p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]]), 2);
}

function l(w) {
    return Math.sqrt((w[0][0] - w[1][0]) * (w[0][0] - w[1][0]) + (w[0][1] - w[1][1]) * (w[0][1] - w[1][1]))
}

function eq(a, b) {
    return a[0] == b[0] && a[1] == b[1]
}

// document.onmousemove = () => {
//     MainLight = [ratonx, ratony]
//     rerender()
// }

// function createObstacle(points) {
//     let obstacle = []
//     for (let p = 0; p < points.length; p++) {
//         obstacle.push([points[p], points[(p + 1) % points.length]])
//     }
//     obstacles.push(obstacle)
// }


function min(a, b) {
    return a < b ? a : b;
}

function drawPoligon(vertex, color, ctx, xOff, yOff) {
    if (color)
        ctx.fillStyle = color;
    else
        ctx.fillStyle = "#555555";

    ctx.beginPath();
    ctx.moveTo(vertex[0][0] + xOff, vertex[0][1] + yOff);
    for (let v = 0; v < vertex.length; v++) {
        const p = vertex[v];
        ctx.lineTo(p[0] + xOff, p[1] + yOff);

        //console.log(p[0], p[1])
    }
    ctx.closePath();
    ctx.stroke();

    ctx.fill();
}
