var fs = require('fs');
var url = require('url');
var http = require('http');

let worldSize = 100;

http.globalAgent.keepAlive = true;

let server = http.createServer(function (req, res) {
    let directions = url.parse(req.url, true)

    //console.log("called", directions.href)//, "query", directions.query, "pathname", directions.pathname)

    if (directions.pathname == "/file") {
        console.log("file querry")
        fs.readFile(directions.query.dir, function (err, data) {
            res.write(data);
            console.log("   returning")
            return res.end();
        });
    }


    if (directions.pathname == "/") {
        console.log("base page querry")
        fs.readFile('index.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });

            res.write(data);
            console.log("   returning")
            return res.end();
        });
    }

    if (directions.pathname == "/AJAX") {
        if (directions.query.queryPurpose == "getData") {
            console.log("returning gameData")
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ "map": map, "teams": teams }));
            return res.end();
        }

        if (directions.query.queryPurpose == "logOut") {

            if (directions.query.name in users) {
                console.log("loggin out someone")
                teams[users[directions.query.name].team].playerNum--
                delete users[directions.query.name]

            }
        }
        if (directions.query.queryPurpose == "startGame") {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(gameStart);
            return res.end();

        }

        if (directions.query.queryPurpose == "event") {
            // console.log("event happened")
            if (directions.query.eventType == "hit") {
                events[nextEventId] = {
                    "type": "hit",
                    "victim": JSON.parse(directions.query.transmision).victim,
                    "shooterPos": JSON.parse(directions.query.transmision).shooter
                }
                users[JSON.parse(directions.query.transmision).victim].health -= 10;
                console.log("hit a human, ", users[JSON.parse(directions.query.transmision).victim])

            } else if (directions.query.eventType == "spark") {
                events[nextEventId] = {
                    "type": "spark",
                    "pos": JSON.parse(directions.query.transmision).pos,
                    "vec": JSON.parse(directions.query.transmision).vec,
                    "shooterPos": JSON.parse(directions.query.transmision).shooter
                }
            }
            let d = new Date();
            events[nextEventId].time = d.getTime();
            nextEventId++;
        }

        if (directions.query.queryPurpose == "GetEvent") {
            //console.log("event query")
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(events));
            return res.end();
        }

        if (directions.query.queryPurpose == "logIn") {
            console.log("loggin in someone")
            let success = "OK";
            if (directions.query.name in users) {
                success = "taken name"
            } else if (teams[directions.query.team].playerNum < maxPlayersPerTeam) {
                teams[directions.query.team].playerNum++
                users[directions.query.name] = {
                    "pos": teams[directions.query.team].initialPos,
                    "health": 100,
                    "team": directions.query.team,
                    "viewAngle": 0,
                    "animFrame": 0
                }

            } else {
                success = "no more space on team"
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write(success);
            console.log(teams, users)
            gameStart = "true"
            for (let team in teams) {
                if (teams[team].playerNum < maxPlayersPerTeam) {
                    gameStart = "false";
                }
            }

            return res.end();
        }
        if (directions.query.queryPurpose == "refresh") {

            if (gameOver == "true" || !(directions.query.name in users)) {
                for (let t in teams) {
                    teams[t].playerNum = 0;
                }
                users = {};
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ "restart": "true" }));
                return res.end();
            }
            let recieved = JSON.parse(directions.query.transmision);
            //console.log("transmision viewAngle", recieved.viewAngle)
            users[directions.query.name].pos = recieved.pos
            users[directions.query.name].viewAngle = recieved.viewAngle
            users[directions.query.name].animFrame = recieved.animFrame

            //console.log(users)


            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(users));
            return res.end();
        }

    }

    // if (directions.pathname == "/favicon.ico") {
    //     console.log("favico querry")
    //     fs.readFile('favico.ico', function (err, data) {
    //         //res.writeHead(200, { 'Content-Type': 'image/vnd.microsoft.icon' });
    //         res.write(data);
    //         console.log("   returning")
    //         return res.end();
    //     });
    // }

});
server.listen(8000);

let gameStart = "false";
let gameOver = "false"

let users = {}
let teams = {}
let maxPlayersPerTeam = 1;

function setUpTeams() {
    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        for (let x = 0; x < row.length; x++) {
            const c = row[x];
            if (c != "#" && c != " ") {
                teams[TeamNames[c]] = {
                    "playerNum": 0,
                    "initialPos": [(x + 1) * worldSize, (y + 1) * worldSize]
                }
            }
        }
    }
}

let events = {}
let nextEventId = 0;
setInterval(() => {
    let d = new Date();
    for (let e in events) {
        if (events[e].time < d.getTime() - 2000) {
            delete events[e]
        }
    }
}, 1000);

let TeamNames = {
    "a": "Team1",
    "b": "Team2"
}

let map = [
    "#######################",
    "#b   #a #             #",
    "#    #  #             #",
    "#               #     #",
    "#               #     #",
    "#####  ##########     #",
    "#   #   #  #    #     #",
    "#   #   #  #    #     #",
    "#          #          #",
    "#          #          #",
    "#######################",
]

setUpTeams();
