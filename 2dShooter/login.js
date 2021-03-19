let team;
let name;

let GameData = -1;

function prepareData() {
    let current = new URL(window.location.href + "AJAX");
    current.searchParams.set("queryPurpose", "getData")
    const http = new XMLHttpRequest()

    http.open("GET", current.href, true)
    http.onreadystatechange = () => {

        if (http.readyState == 4 && http.status == 200) {
            console.log("recieved gameData")
            GameData = JSON.parse(http.responseText);
            let map = GameData.map
            for (let y = 1; y < map.length - 1; y++) {
                const row = map[y];
                for (let x = 1; x < row.length - 1; x++) {
                    if (map[y][x] == " ") {
                        if (map[y + 1][x] == "#") {
                            walls.push([[x * worldSize, (y + 1) * worldSize], [(x + 1) * worldSize, (y + 1) * worldSize]])
                        }
                        if (map[y - 1][x] == "#") {
                            walls.push([[x * worldSize, y * worldSize], [(x + 1) * worldSize, y * worldSize]])
                        }
                        if (map[y][x + 1] == "#") {
                            walls.push([[(x + 1) * worldSize, y * worldSize], [(x + 1) * worldSize, (y + 1) * worldSize]])
                        }
                        if (map[y][x - 1] == "#") {
                            walls.push([[x * worldSize, y * worldSize], [x * worldSize, (y + 1) * worldSize]])
                        }
                    }
                }
            }
            walls = clean(walls)

            let dropDown = document.getElementById("team")

            document.getElementById("loading").style.display = "none"
            document.getElementById("login").style.display = "block"

        }
    }
    http.send()
}


prepareData()