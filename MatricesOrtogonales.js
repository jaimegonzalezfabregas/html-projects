

function transpose(matrix) {
    let ret = JSON.parse(JSON.stringify({ "a": matrix })).a;
    for (let y = 0; y < matrix.length; y++) {
        const row = matrix[y];

        for (let x = 0; x < row.length; x++) {
            const e = row[x];
            ret[x][y] = matrix[y][x]
        }
    }
    return ret;
}

function determinant(matrix_) {
    let matrix = JSON.parse(JSON.stringify({ "a": matrix_ })).a
    if (matrix.length == 2) {
        return matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]
    }
    let ret = 0;
    for (let i = 0; i < matrix.length; i++) {
        let newMatrix = [];

        for (let y = 0; y < matrix.length; y++) {
            if (y != i) {
                let newRow = []
                for (let x = 0; x < matrix.length - 1; x++) {
                    newRow.push(matrix[y][x + 1])
                }
                newMatrix.push(newRow)
            }
        }
        ret += matrix[i][0] * determinant(newMatrix) * (i % 2 == 0 ? 1 : -1)

    }

    return ret;
}

function submatrix(matrix, x_, y_) {
    let ret = [];
    for (let y = 0; y < matrix.length; y++) {
        if (y != y_) {
            let row = []
            for (let x = 0; x < matrix[0].length; x++) {
                if (x != x_) {
                    row.push(matrix[y][x])
                }
            }
            ret.push(row)
        }
    }
    return ret;
}

function ScalarMul(matrix, sclr) {
    ret = JSON.parse(JSON.stringify({ "a": matrix })).a;
    for (let y = 0; y < ret.length; y++) {
        for (let x = 0; x < ret[0].length; x++) {
            ret[y][x] = matrix[y][x] * sclr
        }
    }
    return ret
}

function eq(m1, m2, factor) {
    if (m1.length != m2.length || m1[0].length != m2[0].length) {
        return false
    }
    for (let y = 0; y < m1.length; y++) {
        for (let x = 0; x < m1[0].length; x++) {
            if (Math.abs(m1[y][x] - m2[y][x]) > factor) {
                return false
            }
        }
    }
    return true
}

function adjacent(matrix) {
    let ret = JSON.parse(JSON.stringify({ "a": matrix })).a;
    for (let y = 0; y < ret.length; y++) {
        for (let x = 0; x < ret[0].length; x++) {
            ret[y][x] = determinant(submatrix(matrix, x, y)) * Math.pow(-1, x + 1 + y + 1)
        }
    }
    return ret;
}

function inverse(matrix) {
    return ScalarMul(transpose(adjacent(matrix)), 1 / determinant(matrix))
}

function ortogonal(matrix) {
    return determinant(matrix) != 0 && eq(transpose(matrix), inverse(matrix), 0, 01);
}

function flaten(matrix) {
    ret = [];
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            ret.push(matrix[y][x])
        }
    }
    return ret;
}

function inflate(arr) {
    let ret = [];
    let i = 0;
    let side = Math.sqrt(arr.length)
    for (let y = 0; y < side; y++) {
        let row = []
        for (let x = 0; x < side; x++) {
            row.push(arr[i])
            i++
        }
        ret.push(row)
    }
    return ret;
}

function getNextMatrix(range, matrix) {
    let flat = flaten(matrix)
    let i = 0;
    let done = false;
    while (!done) {
        flat[i]++;
        if (flat[i] > range[1]) {
            flat[i] = range[0]
            i++;
        } else {
            done = true
        }
    }
    return inflate(flat)
}

let testMatrix = inflate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
let progres = 0;
let range = [-1, 1]
while (true) {
    let a = getNextMatrix([0, 6], testMatrix)
    if (typeof a[a.length - 1][a.length - 1] == "number") {
        testMatrix = a
        if (ortogonal(testMatrix)) {
            console.log(testMatrix)
        }
        progres++;
        if (progres % 10000 == 0) {
            //console.log("hi:", testMatrix)
        }
    } else {
        testMatrix = inflate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        range[0]--
        range[1]++
        progres = 0;
        console.log("new range = ", range)
        console.log("restart matrix = ", testMatrix)

    }

}
