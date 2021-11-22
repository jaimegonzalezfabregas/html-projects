let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


Module.onRuntimeInitialized = () => {
    simulationSpaceSize = Module.__Z9JSGetSidei();
    tick()
}

function min(a, b) {
    return a < b ? a : b;
}
