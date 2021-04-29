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
    console.log(symbols)
})