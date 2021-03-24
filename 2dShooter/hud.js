let hud = document.getElementById("hud")
let hudCtx = hud.getContext("2d")

let redNess = 0;
let redNessGoal = 0;

let health = 100;
let healthGoal = 100;

function hudRefresh() {

    hud.height = hud.clientHeight;
    hud.width = hud.clientWidth;


    // interpolations
    if (dead) {
        redNessGoal = 1;
    } else {
        redNessGoal = 0.7 - 0.7 * (health / 100);
    }
    redNess = redNess + (redNessGoal - redNess) * 0.03;
    health = health + (healthGoal - health) * 0.1;

    // draw health
    // draw if the flag is had


    // draw cooldown

    hudCtx.beginPath();
    hudCtx.arc(ratonx, ratony, 20, 0, 2 * Math.PI * Math.max(0, gunCoolDown / 100), false);
    hudCtx.lineWidth = 3;
    hudCtx.strokeStyle = '#ffffff';
    hudCtx.stroke();


    // draw red overlay of death

    let innerRad = (1 - redNess) * 300;

    //console.log(innerRad, redNess, redNessGoal, health, healthGoal)

    var grd = hudCtx.createRadialGradient(hud.width / 2, hud.height / 2, innerRad / 3, hud.width / 2, hud.height / 2, 2 * innerRad);
    grd.addColorStop(0, "rgba(255,0,0," + redNess * redNess / 2 + ")");
    grd.addColorStop(1, "rgb(255,0,0," + redNess / 2 + ")");

    hudCtx.fillStyle = grd
    hudCtx.fillRect(0, 0, hud.width, hud.height);


}
