let team;
let nick;
let logged = false;



let gameData = -1;

function prepareData() {

    let current = new URL(window.location.href + "AJAX");
    current.searchParams.set("queryPurpose", "getData")
    const http = new XMLHttpRequest()

    http.open("GET", current.href, true)
    http.onreadystatechange = () => {

        if (http.readyState == 4 && http.status == 200) {
            gameData = JSON.parse(http.responseText);

            console.log("recieved gameData", gameData)
            let map = gameData.map
            mapSize = Math.max(map.length, map[0].length)
            for (let y = 1; y < map.length - 1; y++) {
                const row = map[y];
                for (let x = 1; x < row.length - 1; x++) {
                    if (map[y][x] != "#") {
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

            let wip = document.createElement("option")
            wip.value = "unselected"
            wip.innerHTML = "select a team"
            dropDown.appendChild(wip)

            for (team in gameData.teams) {
                let wip = document.createElement("option")
                wip.value = team
                wip.innerHTML = team
                dropDown.appendChild(wip)
            }

            document.getElementById("loading").style.display = "none"
            document.getElementById("login").style.display = "block"

        }
    }
    http.send()
}

function logIn() {
    if (document.getElementById("team").value != "unselected") {
        if (document.getElementById("playerName").value != "") {

            let current = new URL(window.location.href + "AJAX");
            current.searchParams.set("queryPurpose", "logIn")
            current.searchParams.set("name", document.getElementById("playerName").value)
            current.searchParams.set("team", document.getElementById("team").value)

            const http = new XMLHttpRequest()

            http.open("GET", current.href, true)
            http.onreadystatechange = () => {

                if (http.readyState == 4 && http.status == 200) {
                    if (http.responseText != "OK") {
                        alert("Log in failed. Reason: " + http.responseText)
                    } else {
                        team = document.getElementById("team").value;
                        nick = document.getElementById("playerName").value;
                        player = gameData.teams[team].initialPos
                        playerLast = player
                        logged = true;
                        document.getElementById("loading").style.display = "block"
                        document.getElementById("login").style.display = "none"

                        waitForStart()
                    }
                }

            }
            http.send()

        } else {
            alert("input a name")
        }


    } else {
        alert("select a team")
    }
}

function waitForStart() {
    let current = new URL(window.location.href + "AJAX");
    current.searchParams.set("queryPurpose", "startGame")

    const http = new XMLHttpRequest()

    http.open("GET", current.href, true)
    http.onreadystatechange = () => {

        if (http.readyState == 4 && http.status == 200) {
            if (http.responseText == "true") {
                document.getElementById("loading").style.display = "none"
                document.getElementById("gameplay").style.display = "block"
                start();
            } else {
                setTimeout(() => {
                    waitForStart()
                }, 100);
            }
        }
    }
    http.send()
}


function unlog() {
    if (logged) {
        let current = new URL(window.location.href + "AJAX");
        current.searchParams.set("queryPurpose", "logOut")
        current.searchParams.set("name", document.getElementById("playerName").value)
        const http = new XMLHttpRequest()
        http.open("GET", current.href, true)
        http.send()
    }
}

window.onbeforeunload = () => {
    unlog();
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

prepareData()
