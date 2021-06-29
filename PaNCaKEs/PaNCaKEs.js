const csv = require('csv-parser')
const fs = require('fs')


async function readSimbols(then) {
    let symbols = [];
    fs.createReadStream('PeriodicTable.csv')
        .pipe(csv())
        .on('data', (data) => symbols.push(data.Symbol))
        .on('end', () => then(symbols));
}

readSimbols((symbols) => {
    //console.log(symbols)
    let words = fs.readFileSync('mostUsedWords.txt').toString().split("\n"); //Object.keys(JSON.parse(fs.readFileSync("words.json")))

    for (let word in words) {
        let temp = check(words[word], symbols, "", 0)
        if (temp != 0) {
            console.log(temp)
        }
    }

})

function check(word, sym, construction, depth) {
    //console.log(word)

    if (word.length == 0) return depth > 3 ? construction : 0;
    for (let i = 0; i < sym.length; i++) {
        const symbol = sym[i];
        if (Caps(word.substring(0, symbol.length)) == Caps(symbol)) {
            let a = check(word.substring(symbol.length), sym, construction + symbol, depth + 1)
            if (a != 0) {
                return a;
            }
        }

    }
    return 0
}

function Caps(str) {
    //console.log(str)
    return str.toUpperCase()
}