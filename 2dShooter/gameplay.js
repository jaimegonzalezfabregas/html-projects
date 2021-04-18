let keys = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
let ratony = 0;
let ratonx = 0;
window.onkeyup = function (e) { keys[e.keyCode] = false; }
window.onkeydown = function (e) { keys[e.keyCode] = true; }

const lightSize = 10;

let mapSize;

let players = {};
let playersToDraw = -1;

let maxV = 10;
let acceleration = 5;
let friction = 0.8;
let worldSize = 100;
let player
let playerLast
let hitBoxSize = 70;
let wallSize = 10;

let doneEvents = [];
let events = {}

let CamOfsets = [[0, 0], [0, 0]]

function reorientVecToFaceVec(vec, gide, reverse) {
    let m = vec[0] * gide[0] < 0 || vec[1] * gide[1] < 0 ? -1 : 1
    m = (reverse ? -1 : 1) * m
    vec = [vec[0] * m, vec[1] * m]
    return vec;
}

let viewAngle = 0;
let mouseAngle = 0;

function getVecFromAngle(a) {
    return [Math.cos(a), Math.sin(a)]
}

function getAngleFromVec(v) {
    return Math.atan2(v[1], v[0])
}

let AcumulatedCamOfset = [0, 0]
let ongoingEvents = {}

let abort = false;

let FacingWalkStrength = 3;

let nextAudio = 0;

let dead = false;

function tick() {

    gunCoolDown--;
    //console.log(ongoingEvents)

    for (let ev in events) {
        doneEvents.push(ev);
        ongoingEvents[ev] = { "frame": -1, "data": events[ev] }
        let n = document.getElementById("shootAudio" + nextAudio);
        nextAudio = nextAudio % 4 + 1
        n.volume = min(1, 100 / l([player, events[ev].shooterPos]))
        console.log(n.volume)

        n.pause();
        n.currentTime = 0;
        n.play();

        delete events[ev]

    }

    for (let ev in ongoingEvents) {
        ongoingEvents[ev].frame++
        if (ongoingEvents[ev].frame > 14) {
            delete ongoingEvents[ev]
        }
    }

    //console.log("tick")
    //w - 87
    //a - 65
    //s - 83
    //d - 68
    AcumulatedCamOfset = [0, 0]
    for (let i = 0; i < CamOfsets.length; i++) {
        const off = CamOfsets[i];
        AcumulatedCamOfset = [AcumulatedCamOfset[0] + off[0], AcumulatedCamOfset[1] + off[1]]
    }

    let nextLast = [player[0], player[1]]
    let shifting = keys[16] * -0.2
    let v = [(player[0] - playerLast[0] - (keys[65] - keys[68]) * acceleration * !dead) * (friction + shifting), (player[1] - playerLast[1] - (keys[87] - keys[83]) * acceleration * !dead) * (friction + shifting)]

    frame += l([[0, 0], v]) / 10
    frame = frame % 20;

    const turnSpeed = 0.2;

    let mouseAngle = Math.atan2(ratony - canvas.height / 2, ratonx - canvas.width / 2)
    let CurrentVec = getVecFromAngle(viewAngle);

    let MouseVec = getVecFromAngle(mouseAngle);
    let nextVecMouse = [CurrentVec[0] + (MouseVec[0] - CurrentVec[0]) * turnSpeed, CurrentVec[1] + (MouseVec[1] - CurrentVec[1]) * turnSpeed]

    let vAngle = Math.atan2(v[1], v[0])

    let WalkVec = getVecFromAngle(vAngle);
    let nextVecWalk = [CurrentVec[0] + (WalkVec[0] * FacingWalkStrength - CurrentVec[0]) * turnSpeed, CurrentVec[1] + (WalkVec[1] * FacingWalkStrength - CurrentVec[1]) * turnSpeed]

    let nextVec = [nextVecMouse[0] + (nextVecWalk[0] - nextVecMouse[0]) * l([[0, 0], v]) / 30, nextVecMouse[1] + (nextVecWalk[1] - nextVecMouse[1]) * l([[0, 0], v]) / 30]

    viewAngle = getAngleFromVec(nextVec)

    //CamOfsets[0] = normalize(nextVecMouse, 0)



    //console.log("got to ", viewAngle)

    player = [player[0] + v[0], player[1] + v[1]]
    playerLast = nextLast;

    // colision
    for (let w = 0; w < walls.length; w++) {
        const wall = walls[w];
        //console.log(distanceToWall(wall[0], wall[1], player))
        let d = distanceToWall(wall[0], wall[1], player)
        if (d < hitBoxSize + wallSize) {

            let wallVec = [wall[0][0] - wall[1][0], wall[0][1] - wall[1][1]]

            let wallCenter = [(wall[0][0] + wall[1][0]) / 2, (wall[0][1] + wall[1][1]) / 2]
            let vecToWall = [wallCenter[0] - player[0], wallCenter[1] - player[1]]

            let normal = normalize([-wallVec[1], wallVec[0]], (hitBoxSize + wallSize - d))
            //console.log(wall)

            normal = reorientVecToFaceVec(normal, vecToWall, true)

            player = [player[0] + normal[0], player[1] + normal[1]]

        }

    }

    // interpolate other players

    for (let pl in players) {
        playersToDraw[pl].pos[0] = playersToDraw[pl].pos[0] + (players[pl].pos[0] - playersToDraw[pl].pos[0]) * 0.9
        playersToDraw[pl].pos[1] = playersToDraw[pl].pos[1] + (players[pl].pos[1] - playersToDraw[pl].pos[1]) * 0.9

        playersToDraw[pl].viewAngle = players[pl].viewAngle
        playersToDraw[pl].animFrame = players[pl].animFrame
        playersToDraw[pl].dead = players[pl].dead

        playersToDraw[pl].health = playersToDraw[pl].health + (players[pl].health - playersToDraw[pl].health) * 0.05
    }

    rerender();
    hudRefresh()
}

let frame = 0;
let canvas = document.getElementById("shadow")
let bg = document.getElementById("bg")

function rerender() {
    //console.log("start render")

    let ctx = canvas.getContext("2d");
    canvas.height = canvas.clientHeight
    canvas.width = canvas.clientWidth

    let bgCtx = bg.getContext("2d")
    bg.height = bg.clientHeight
    bg.width = bg.clientWidth

    //cam shake n stuff
    ctx.fillStyle = "rgb(255, 255, 255,0)"
    ctx.fillRect(-canvas.height, -canvas.width, canvas.width * 2, canvas.height * 2);

    ctx.translate(AcumulatedCamOfset[0], AcumulatedCamOfset[1]);
    bgCtx.translate(AcumulatedCamOfset[0], AcumulatedCamOfset[1]);

    for (let wall = 0; wall < walls.length; wall++) {
        const w = walls[wall];

        let wallCenter = [(w[0][0] + w[1][0]) / 2, (w[0][1] + w[1][1]) / 2]
        let vectorToWall = normalize([player[0] - wallCenter[0], player[1] - wallCenter[1]], (hitBoxSize + wallSize) * 0.7)

        let light = [player[0] - vectorToWall[0], player[1] - vectorToWall[1]]

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

        drawPoligon(shadowPoligon, rgb(0, 0, 0), ctx,
            -player[0] + canvas.width / 2,
            -player[1] + canvas.height / 2)
    }

    // render background



    //floor:


    let img = document.getElementById("floorTile")
    let resize = 4;
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            bgCtx.drawImage(img,
                resize * x * worldSize - player[0] + canvas.width / 2,
                resize * y * worldSize - player[1] + canvas.height / 2,
                resize * worldSize * 1.001,
                resize * worldSize * 1.001);
        }

    }

    //centralPlayer
    let characterSize = hitBoxSize * 1.5

    if (!dead) {
        DrawPlayer("playerBlue", bgCtx, characterSize, viewAngle, player, frame);
    }

    // walls
    if (false) {
        bgCtx.strokeStyle = rgb(20, 20, 20);
        bgCtx.lineWidth = wallSize * 2;
        for (let i = 0; i < walls.length; i++) {
            const line = walls[i];
            bgCtx.beginPath();
            bgCtx.moveTo(canvas.width / 2 - player[0] + line[0][0], canvas.height / 2 - player[1] + line[0][1])
            bgCtx.lineTo(canvas.width / 2 - player[0] + line[1][0], canvas.height / 2 - player[1] + line[1][1])
            bgCtx.stroke();

            bgCtx.fillStyle = bgCtx.strokeStyle;

            bgCtx.beginPath();
            bgCtx.arc(canvas.width / 2 - player[0] + line[0][0], canvas.height / 2 - player[1] + line[0][1],
                wallSize,
                0, 2 * Math.PI);
            bgCtx.fill();

            bgCtx.beginPath();
            bgCtx.arc(canvas.width / 2 - player[0] + line[1][0], canvas.height / 2 - player[1] + line[1][1],
                wallSize,
                0, 2 * Math.PI);
            bgCtx.fill();

        }
    }

    // other players

    for (let p in playersToDraw) {
        if (p != nick && !playersToDraw[p].dead) {
            const companion = playersToDraw[p];

            DrawPlayer(companion.team == team ? "playerBlue" : "playerRed", bgCtx, characterSize, companion.viewAngle, companion.pos, companion.animFrame);

            bgCtx.font = "40px Arial";
            bgCtx.textAlign = "center";
            bgCtx.fillStyle = rgb(255, 255, 255)
            bgCtx.fillText(p, canvas.width / 2 - player[0] + companion.pos[0], canvas.height / 2 - player[1] + companion.pos[1]);

            bgCtx.lineWidth = 2;
            bgCtx.strokeText(p, canvas.width / 2 - player[0] + companion.pos[0], canvas.height / 2 - player[1] + companion.pos[1]);

            let downOffset = 10;
            let healthBarWidth = 100;
            let healthBarHeight = 10;
            bgCtx.fillStyle = "#555555"
            bgCtx.fillRect(canvas.width / 2 - player[0] + companion.pos[0] - healthBarWidth / 2, canvas.height / 2 - player[1] + companion.pos[1] - healthBarHeight / 2 + downOffset, healthBarWidth, healthBarHeight)
            bgCtx.fillStyle = rgb((100 - companion.health) * 255 / 100, 255 / 100 * companion.health, 30)
            bgCtx.fillRect(canvas.width / 2 - player[0] + companion.pos[0] - healthBarWidth / 2, canvas.height / 2 - player[1] + companion.pos[1] - healthBarHeight / 2 + downOffset, healthBarWidth * companion.health / 100, healthBarHeight)

            bgCtx.strokeStyle = companion.team == team ? "rgb(100,100,255)" : "rgb(255,100,100)";
        }
    }

    // luz

    var grd = bgCtx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width/2,canvas.height/2));
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, "black");

    bgCtx.fillStyle = grd
    bgCtx.fillRect(-AcumulatedCamOfset[0], -AcumulatedCamOfset[1], canvas.width, canvas.height);

    // sparks

    for (let ev in ongoingEvents) {
        if (ongoingEvents[ev].data.type == "spark") {
            let sparkSize = 300;
            let viewAngle = getAngleFromVec(ongoingEvents[ev].data.vec)
            bgCtx.translate(canvas.width / 2 - player[0] + ongoingEvents[ev].data.pos[0], canvas.height / 2 - player[1] + ongoingEvents[ev].data.pos[1]);
            bgCtx.rotate(+viewAngle - Math.PI);
            bgCtx.drawImage(document.getElementById("spark"), Math.floor(ongoingEvents[ev].frame) * 13440 / 14, 0, 13440 / 14, 540, -sparkSize, -sparkSize, sparkSize * 2, sparkSize * 2); //, )
            bgCtx.rotate(-viewAngle + Math.PI);
            bgCtx.translate(-canvas.width / 2 + player[0] - ongoingEvents[ev].data.pos[0], -canvas.height / 2 + player[1] - ongoingEvents[ev].data.pos[1]);
        }
    }

    //cam shake n stuff
    ctx.translate(-AcumulatedCamOfset[0], -AcumulatedCamOfset[1]);
    bgCtx.translate(-AcumulatedCamOfset[0], -AcumulatedCamOfset[1]);

}

function DrawPlayer(team, bgCtx, characterSize, viewAngle, pos, frame) {
    bgCtx.translate(canvas.width / 2 - player[0] + pos[0], canvas.height / 2 - player[1] + pos[1]);
    bgCtx.rotate(viewAngle);
    bgCtx.drawImage(document.getElementById(team), Math.floor(frame) * 258, 0, 258, 220, -characterSize, -characterSize, characterSize * 2, characterSize * 2); //, )
    bgCtx.rotate(-viewAngle);
    bgCtx.translate(-canvas.width / 2 + player[0] - pos[0], -canvas.height / 2 + player[1] - pos[1]);
}


function start() {
    setInterval(() => {
        if (!abort)
            tick()

    }, 1000 / 60);
    getEvents();
    refreshPos();
}

let gunCoolDown = 0;

// pañum pañum
document.onclick = () => {
    if (dead) return
    if(gunCoolDown > 0) return
    shake(0, 10, 30);
    gunCoolDown = 100
    if (playerLast) {
        let knockback = 40;
        playerLast = [playerLast[0] + Math.cos(viewAngle) * knockback, playerLast[1] + Math.sin(viewAngle) * knockback]


        let bulletPos = [player[0], player[1]]
        let bulletVec = [Math.cos(viewAngle), Math.sin(viewAngle)]

        let crash = false;
        let steps = 0;
        let bulletR = 10;

        let obstacleType = "wall";

        while (!crash && steps < 100) {

            let min = 10000;
            obstacleType = "wall"
            for (let wall = 0; wall < walls.length; wall++) {
                const w = walls[wall];
                let d = distanceToWall(w[0], w[1], bulletPos);
                if (d < min) {
                    min = d;
                }
            }
            for (let p in players) {
                if (p != nick && !players[p].dead) {
                    let d = l([players[p].pos, bulletPos]) - hitBoxSize;
                    if (d < min) {
                        min = d;
                        obstacleType = p
                    }
                }
            }

            if (min <= bulletR) {
                crash = true;
            } else {
                bulletVec = normalize(bulletVec, min);
                bulletPos = [bulletPos[0] + bulletVec[0], bulletPos[1] + bulletVec[1]]
            }
            steps++;
        }

        if (obstacleType != "wall") {
            hit(obstacleType)
        } else {
            sparkAt(bulletPos, bulletVec)
        }

    }
}

function normalize(vec, b) {
    let a = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]) / b
    return [vec[0] / a, vec[1] / a]
}

function distanceToWall(p1, p2, s) {
    return distToSegmentSquared(s, p1, p2)
}

function distToSegmentSquared(p, v, w) { // p: point, v: segment first Point, w: segment second Point
    let l2 = l([w, v]) * l([w, v]);
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return l([p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]]);
}

function l(w) {
    return Math.sqrt((w[0][0] - w[1][0]) * (w[0][0] - w[1][0]) + (w[0][1] - w[1][1]) * (w[0][1] - w[1][1]))
}

function eq(a, b) {
    return a[0] == b[0] && a[1] == b[1]
}

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

