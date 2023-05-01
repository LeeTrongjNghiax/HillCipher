add = (a, b) => a + b;
multi = (a, b) => a * b;
mod = (a, b) => a % b;
mod2 = (a, b) => ((b + a % b) % b);

hasDuplicates = array => (new Set(array)).size !== array.length;

gcd = (a, b) => {
    if (!b) return a;
    return gcd(b, a % b);
}

getBlindResult = (a, b, length) => {
    for (let x = 1; x <= length; x++) {
        if ((x * a) % length == b) {
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

stringToColumnMatrix = (string, row, mode = 0, arr) => {
    let m = []; 
    let index = 0;

    for (let i = 0; i < row; i++) {
        let k = index;
        m[i] = [];
        for (let j = 0; j < string.length / row; j++) {
            if (mode == 0) {
                m[i][j] = arr.indexOf(string[k], 0);
            }
            else
                m[i][j] = string[k].codePointAt(0);
            k += row;
        }
        index++;
    }

    return m;
}

stringToRowMatrix = (string, col, mode = 0, arr) => {
    let m = []; 
    let index = 0;

    for (let i = 0; i < string.length / col; i++) {
        m[i] = [];
        for (let j = 0; j < col; j++) {
            if (mode == 0)
                m[i][j] = arr.indexOf(string[index], 0);
            else
                m[i][j] = string[index].codePointAt(0);
            index++;
        }
    }

    return m;
}

rowMatrixToString = (matrix, mode = 0, arr) => {
    let s = '';

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (mode == 0)
                s += arr[ matrix[i][j] ];
            else 
                s += String.fromCodePoint(matrix[i][j]);
        }
    }

    return s;
}

columnMatrixToString = (matrix, mode = 0, arr) => {
    let s = '';
    for (let i = 0; i < matrix[0].length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (mode == 0)
                s += arr[ matrix[j][i] ];
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

    return m3;
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

encryptHill = (p, k, mode = 0, arr) => columnMatrixToString(
    numberBinaryMatrix(
        arr.length, 
        matrixMultiMatrix(
            stringToRowMatrix(
                k, 
                Math.sqrt(k.length), 
                mode, 
                arr
            ),
            stringToColumnMatrix(
                p, 
                Math.sqrt(k.length), 
                mode, 
                arr
            ), 
        ), 
        mod2
    ), 
    mode, 
    arr
);

decryptHill = (c, k, mode = 0, arr) => rowMatrixToString( 
    transposeMatrix( 
        numberBinaryMatrix(
            arr.length, 
            matrixMultiMatrix(
                numberBinaryMatrix(
                    arr.length, 
                    numberBinaryMatrix( 
                        getBlindResult(
                            (arr.length + getDet(
                                stringToRowMatrix(
                                    k, 
                                    Math.sqrt(k.length), 
                                    mode, 
                                    arr
                                )
                            ) % arr.length) % arr.length, 
                            1, 
                            arr.length
                        ), 
                        numberBinaryMatrix( 
                            arr.length, 
                            transposeMatrix( 
                                cofactorMatrix(
                                    stringToRowMatrix(
                                        k, 
                                        Math.sqrt(k.length), 
                                        mode, 
                                        arr
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
                    mode, 
                    arr
                )
            ), 
            mod2
        ) 
    ), 
    mode, 
    arr
);

function resize() {
    this.style.height = 0;
    this.style.height = (this.scrollHeight) + "px";
}

isValidEncrypt = (p, k, t, a) => {
    if ( p.length < 1 ) {
        alert(`Please fill out plain text to encrypt`);
        return false;
    }

    if ( k.length < 1 ) {
        alert(`Please fill out key to encrypt`);
        return false;
    }

    if ( !isSquareNumber(k.length) ) {
        alert(`Key length is not a square number`);
        return false;
    }

    if ( t.length != 1 ) {
        alert(`Please chose 1 template character`);
        return false;
    }

    for (let i = 0; i < p.length; i++) {
        if ( a.indexOf(p[i], 0) == -1 ) {
            alert(`Your alphabet does not include all of your character in plain text`);
            return false;
        }
    }

    if ( hasDuplicates(a) ) {
        alert`Your alphabet has duplicate values`;
        return false;
    }

    if ( a.indexOf(t, 0) == -1 ) {
        alert(`Your alphabet does not include template character`);
        return false;
    }

    return true;
}

isValidDecrypt = (c, k, t, a) => {
    if ( c.length < 1 ) {
        alert(`Please fill out cipher text to encrypt`);
        return false;
    }

    if ( k.length < 1 ) {
        alert(`Please fill out key to encrypt`);
        return false;
    }

    if ( !isSquareNumber(k.length) ) {
        alert(`Key length is not a square number`);
        return false;
    }

    if ( Math.sqrt(k.length) % c.length != 0 && c.length % Math.sqrt(k.length) != 0 ) {
        alert(`Cipher length is not divisible by key length and vice versa`);
        return false;
    }

    if ( t.length != 1 ) {
        alert(`Please chose 1 template character`);
        return false;
    }

    for (let i = 0; i < c.length; i++) {
        if ( a.indexOf(c[i], 0) == -1 ) {
            alert(`Your alphabet does not include all of your character in cipher text`);
            console.log(c[i]);
            return false;
        }
    }

    if ( hasDuplicates(a) ) {
        alert`Your alphabet has duplicate values`;
        return false;
    }

    if ( a.indexOf(t, 0) == -1 ) {
        alert(`Your alphabet does not include template character`);
        return false;
    }

    // console.table(stringToColumnMatrix(
    //     k, 
    //     Math.sqrt( k.length ), 
    //     0, 
    //     a
    // ));
    // console.log("Det: " + getDet(
    //     stringToColumnMatrix(
    //         k, 
    //         Math.sqrt( k.length ), 
    //         0, 
    //         a
    //     )
    // ));
    // console.log("Alphabet length: " + a.length);
    // console.log("Det modulo Alphabet length (x): " + mod2(
    //     getDet(
    //         stringToColumnMatrix(
    //             k, 
    //             Math.sqrt( k.length ), 
    //             0, 
    //             a
    //         )
    //     ), 
    //     a.length
    // ));
    // console.log("GCD of x and Alphabet length: " + gcd(
    //     mod2(
    //         getDet(
    //             stringToColumnMatrix(
    //                 k, 
    //                 Math.sqrt( k.length ), 
    //                 0, 
    //                 a
    //             )
    //         ), 
    //         a.length
    //     ), 
    //     a.length
    // ));
    if (getDet(
        stringToColumnMatrix(
            k, 
            Math.sqrt( k.length ), 
            0, 
            a
        )
    ) == 0) {
        alert(`Cannot decrypt this cipher text (determinant of key matrix (${getDet(
            stringToColumnMatrix(
                k, 
                Math.sqrt( k.length ), 
                0, 
                a
            )
        )}) modulo alphabet is 0)`);
        return false;
    }
    if (
        gcd(
            mod2(
                getDet(
                    stringToColumnMatrix(
                        k, 
                        Math.sqrt( k.length ), 
                        0, 
                        a
                    )
                ), 
                a.length
            ), 
            a.length
        ) != 1
    ) {
        alert(`Cannot decrypt this cipher text (greatest common divisor of determinant of key matrix modulo alphabet length (${mod2(
            getDet(
                stringToColumnMatrix(
                    k, 
                    Math.sqrt( k.length ), 
                    0, 
                    a
                )
            ), 
            a.length
        )}) and alphabet length (${a.length}) is ${gcd(
            mod2(
                getDet(
                    stringToColumnMatrix(
                        k, 
                        Math.sqrt( k.length ), 
                        0, 
                        a
                    )
                ), 
                a.length
            ), 
            a.length
        )}, not 1)`);
        return false;
    }

    return true;
}