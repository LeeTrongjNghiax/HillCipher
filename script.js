const ALPHABET = [];

for (let i = 65; i < 91; i++) 
    ALPHABET.push(String.fromCodePoint(i));

ALPHABET.push(" ");
ALPHABET.push("^");

console.log(ALPHABET);

// const LENGTH = ALPHABET.length;
const LENGTH = 1114111;

add = (a, b) => a + b;
multi = (a, b) => a * b;
mod = (a, b) => a % b;
mod2 = (a, b) => ((b + a % b) % b);

gcd = (a, b) => {
    if (!b) return a;
    return gcd(b, a % b);
}

getBlindResult = (a, b) => {
    for (let x = 1; x <= LENGTH; x++) {
        if ((x * a) % LENGTH == b) {
            return x;
        }
    }
}

isSquareNumber = num => {
    for (let i = 1; i <= num; i++)
        if (i * i == num) 
            return true;
    return false;
}

stringToColumnMatrix = (string, row, mode = 0) => {
    let m = []; 
    let index = 0;

    for (let i = 0; i < row; i++) {
        let k = index;
        m[i] = [];
        for (let j = 0; j < string.length / row; j++) {
            if (mode == 0)
                m[i][j] = ALPHABET.indexOf(string[k], 0);
            else
                m[i][j] = string[k].codePointAt(0);
            k += row;
        }
        index++;
    }

    return m;
}

stringToRowMatrix = (string, col, mode = 0) => {
    let m = []; 
    let index = 0;

    for (let i = 0; i < string.length / col; i++) {
        m[i] = [];
        for (let j = 0; j < col; j++) {
            if (mode == 0)
                m[i][j] = ALPHABET.indexOf(string[index], 0);
            else
                m[i][j] = string[index].codePointAt(0);
            index++;
        }
    }

    return m;
}

rowMatrixToString = (matrix, mode = 0) => {
    let s = '';

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (mode == 0)
                s += ALPHABET[ matrix[i][j] ];
            else 
                s += String.fromCodePoint(matrix[i][j]);
        }
    }

    return s;
}

columnMatrixToString = (matrix, mode = 0) => {
    let s = '';
    for (let i = 0; i < matrix[0].length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (mode == 0)
                s += ALPHABET[ matrix[j][i] ];
            else 
                s += String.fromCodePoint(matrix[j][i]);
        }
    }

    return s;
}

numberBinaryMatrix = (number, matrix, expression) => matrix.map(
    x => x.map(
        y => expression(y, number)
    )
)

matrixMultiMatrix = (m1, m2) => {
    let m3 = [];
    for (let i = 0; i < m1.length; i++) {
        m3[i] = []
    }

    for (let i = 0; i < m1.length; i++) {
        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0
            for (let k = 0; k < m2.length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            m3[i][j] = sum;
        }
    }

    return m3
}

transposeMatrix = matrix => matrix[0].map(
    (_, colIndex) => matrix.map(
        row => row[colIndex]
    )
);

smallerMatrix = (matrix, i, j) => {
    let matrix2 = [];
    matrix.map((row, x) => {
        if (x != i) {
            let rows = [];
            row.map((index, y) => {
                if (y != j) {
                    rows.push(index);
                }
            })
            matrix2.push(rows);
        }
    })
    return matrix2;
}

getDet = matrix => {
    if (matrix.length == 1) return matrix[0][0];
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
        sum += Math.pow(-1, 1 + (i + 1)) * matrix[0][i] * getDet(smallerMatrix(matrix, 0, i));
    }
    return sum;
}

cofactorMatrix = matrix => {
    let c = Array(matrix.length).fill(null).map( () => Array(matrix.length).fill(null));

    matrix.map((row, i) => {
        row.map((_, j) => {
            c[i][j] = Math.pow(-1, i + j) * getDet(smallerMatrix(matrix, i, j));
        })
    })
    
    return c;
}

inversedMatrix = matrix => {
    if (getDet(matrix) == 0) return null;
    return numberBinaryMatrix(
        1 / getDet(matrix), 
        transposeMatrix( cofactorMatrix(matrix) ), 
        multi
    )
}

encryptHill = (p, k, mode = 0) => {
    return columnMatrixToString(
        numberBinaryMatrix(
            LENGTH, 
            matrixMultiMatrix(
                stringToColumnMatrix(
                    k, 
                    Math.sqrt(k.length), 
                    mode
                ),
                stringToColumnMatrix(
                    p, 
                    Math.sqrt(k.length), 
                    mode
                ), 
            ), 
            mod2
        ), 
        1
    );
}

decryptHill = (c, k, mode = 0) => rowMatrixToString( 
    transposeMatrix( 
        numberBinaryMatrix(
            LENGTH, 
            matrixMultiMatrix(
                numberBinaryMatrix(
                    LENGTH, 
                    numberBinaryMatrix( 
                        getBlindResult(
                            (LENGTH + getDet(
                                stringToColumnMatrix(
                                    k, 
                                    Math.sqrt(k.length), 
                                    mode
                                )
                            ) % LENGTH) % LENGTH, 
                            1
                        ), 
                        numberBinaryMatrix( 
                            LENGTH, 
                            transposeMatrix( 
                                cofactorMatrix(
                                    stringToColumnMatrix(
                                        k, 
                                        Math.sqrt(k.length), 
                                        mode
                                    )
                                ) 
                            ), 
                            mod 
                        ), 
                        multi
                    ), 
                    mod2 
                ), 
                stringToColumnMatrix(
                    c, 
                    Math.sqrt(k.length), 
                    mode
                )
            ), 
            mod2
        ) 
    ), 
    mode
)