let server = http.createServer(function (req, res) {
    let directions = url.parse(req.url, true)

    console.log("called", directions.href)

    if (directions.pathname == "/file") {
        console.log("file querry")
        fs.readFile(directions.query.dir, function (err, data) {
            res.writeHead(200, { 'Content-Type': directions.query.fileType });
            res.write(data);
            console.log("   returning")
            return res.end();
        });
    }


    if (directions.pathname == "/") {
        console.log("base page querry")
        fs.readFile('/index.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });

            res.write(data);
            console.log("   returning")
            return res.end();
        });
    }

    if (directions.pathname == "/AJAX") {

        if (directions.query.queryPurpose == "getMap") {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ "map": map }));
            return res.end();
        }
        if (directions.query.queryPurpose == "signIn") {
            let success = "OK";
            if (directions.query.name in users) {
                success = "taken name"
            } else if (teams[directions.query.team]){

            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write(success);
            return res.end();
        }
        if (directions.query.queryPurpose == "refresh") {

        }

    }

    if (directions.pathname == "/favicon.ico") {
        console.log("favico querry")
        fs.readFile('favico.ico', function (err, data) {
            //res.writeHead(200, { 'Content-Type': 'image/vnd.microsoft.icon' });
            res.write(data);
            console.log("   returning")
            return res.end();
        });
    }

});
server.listen(8000);

let NextId = 0;

let users = {}
let teams = {
    "a": {
        "playerNum": 0
    },
    "b": {
        "playerNum": 0
    },
}
let maxPlayersPerTeam = 6;

let map = [
    "######",
    "#    #",
    "#    #",
    "#    #",
    "#    #",
    "######",
]