
function getframe(name, step){
    return document.getElementById(name+"_"+step)
}

function loadFromServer(folder, name, range){
    for (let i = 0; i < range; i++) {
        let img = document.getElementById(img)
        img.id = name+"_"+i
        img.style.display = "none"
        img.src = "file?dir=" + folder + name + "_" + i + ".png"
    }

}