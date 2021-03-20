var fs = require('fs');
var url = require('url');
var http = require('http');

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
            console.log("loggin out someone")

            teams[users[directions.query.name].team].playerNum--
            delete users[directions.query.name]

            console.log(teams, users)
        }
        if (directions.query.queryPurpose == "startGame") {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(gameStart);
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
                    "health": 1,
                    "team": directions.query.team
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

            users[directions.query.name].pos = JSON.parse(directions.query.pos).a

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

let users = {}
let teams = {
    "Team1": {
        "playerNum": 0,
        "initialPos": [200, 200]
    },
    // "Team2": {
    //     "playerNum": 0,
    //     "initialPos": [200, 300]
    // }
}
let maxPlayersPerTeam = 1;

let map = [
    "#######################",
    "#      #              #",
    "#      #              #",
    "#               #     #",
    "#               #     #",
    "#####  ##########     #",
    "#   #   #  #    #     #",
    "#   #   #  #    #     #",
    "#          #          #",
    "#          #          #",
    "#######################",
]