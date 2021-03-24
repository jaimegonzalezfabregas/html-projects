
const httpGetEvents = new XMLHttpRequest()
httpGetEvents.onreadystatechange = () => {
    if (httpGetEvents.readyState == 4 && httpGetEvents.status == 200) {
        events = JSON.parse(httpGetEvents.responseText)
        //console.log(httpGetEvents.responseText)
        for (const ev in events) {
            if (doneEvents.indexOf(ev) != -1) {
                delete events[ev]
            }
        }
        if (!abort)
            setTimeout(getEvents, 10);
    }
}

function getEvents() {
    //console.log("query for events")
    let current = new URL(window.location.href + "AJAX");
    current.searchParams.set("queryPurpose", "GetEvent")
    current.searchParams.set("name", nick)
    current.searchParams.set("transmision", JSON.stringify({ "pos": player, "viewAngle": viewAngle, "animFrame": frame }))

    httpGetEvents.open("GET", current.href, true)

    httpGetEvents.send()
}


const httpEvent = new XMLHttpRequest()
httpEvent.onreadystatechange = () => { }

function hit(victim) {

    //console.log("hitting", victim)

    let current = new URL(window.location.href + "AJAX");
    current.searchParams.set("queryPurpose", "event")
    current.searchParams.set("eventType", "hit")
    current.searchParams.set("transmision", JSON.stringify({ "victim": victim, "shooter": player }))
    httpEvent.open("GET", current.href, true)

    httpEvent.send()
}

function sparkAt(pos, vec) {
    let current = new URL(window.location.href + "AJAX");
    current.searchParams.set("queryPurpose", "event")
    current.searchParams.set("eventType", "spark")
    current.searchParams.set("transmision", JSON.stringify({ "pos": pos, "vec": vec, "shooter": player }))

    httpEvent.open("GET", current.href, true)

    httpEvent.send()
}

const httpRefresh = new XMLHttpRequest()

let predeath = false;

httpRefresh.onreadystatechange = () => {

    if (httpRefresh.readyState == 4 && httpRefresh.status == 200) {
        players = JSON.parse(httpRefresh.responseText)
        if ("restart" in players) {
            unlog();
            alert("Game Over")
            abort = true;
            window.location.reload(false);
        }
        if (playersToDraw == -1) {
            playersToDraw = players;
        }
        dead = players[nick].dead

        if (predeath && !dead) {
            player = JSON.parse(JSON.stringify({ "a": gameData.teams[players[nick].team].initialPos })).a
            playerLast = JSON.parse(JSON.stringify({ "a": gameData.teams[players[nick].team].initialPos })).a

            console.log("respawning at:", player)
        }

        predeath = dead;

        healthGoal = players[nick].health;

        setTimeout(() => {
            if (!abort)
                refreshPos()
        }, 1000 / 60);
    }

}

function refreshPos() {
    let current = new URL(window.location.href + "AJAX");
    current.searchParams.set("queryPurpose", "refresh")
    current.searchParams.set("name", nick)
    current.searchParams.set("transmision", JSON.stringify({ "pos": player, "viewAngle": viewAngle, "animFrame": frame }))

    httpRefresh.open("GET", current.href, true)

    httpRefresh.send()
}