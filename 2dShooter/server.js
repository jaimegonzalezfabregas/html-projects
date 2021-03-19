var fs = require('fs');
var url = require('url');
var http = require('http');

let server = http.createServer(function (req, res) {
    let directions = url.parse(req.url, true)

    console.log("called", directions.href, "query", directions.query, "pathname", directions.pathname)

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
        console.log("it is an ajax")
        if (directions.query.queryPurpose == "getData") {
            console.log("returning gameData")
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ "map": map, "teams": teams }));
            return res.end();
        }
        if (directions.query.queryPurpose == "signIn") {
            let success = "OK";
            if (directions.query.name in users) {
                success = "taken name"
            } else if (teams[directions.query.team].playerNum >= maxPlayersPerTeam) {
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
            return res.end();
        }
        if (directions.query.queryPurpose == "refresh") {

            users[directions.query.name].pos = directions.query.pos

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

let NextId = 0;

let users = {}
let teams = {
    "a": {
        "playerNum": 0,
        "initialPos": [1, 1]
    },
    "b": {
        "playerNum": 0,
        "initialPos": [4, 4]
    },
}
let maxPlayersPerTeam = 6;

let map = [
    "#######################",
    "#      #              #",
    "#               #     #",
    "#####  ##########     #",
    "#   #   #  #    #     #",
    "#          #          #",
    "#######################",
]