let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let depthMap = document.getElementById("depthMap")

let depthMapCanvas = document.getElementById("depthMapCanvas");
let depthMapCtx = depthMapCanvas.getContext("2d");

function draw(){
    
    depthMapCanvas.width = depthMapCanvas.clientWidth
    depthMapCanvas.height = depthMapCanvas.clientHeight

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    depthMapCtx.drawImage(depthMap, 0, 0, canvas.width,canvas.height)

    console.log("done")
}