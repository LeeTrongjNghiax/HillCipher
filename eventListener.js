const tx = document.getElementsByTagName("textarea");

for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", resize, false);
}

document.querySelector("#encrypt").addEventListener("click", () => {
    let arr = document.querySelector("#alphabetSection input:checked").value.split('');
    let temp = document.querySelector("#templateChar").value;
    let plain = document.querySelector("#plainText").value;
    let key = document.querySelector("#key").value;
    let cipherInput = document.querySelector("#cipherText");

    if ( document.querySelector("#caseSection input").checked ) {
        arr = document.querySelector("#alphabetSection input:checked").value.toUpperCase().split('');
        temp = temp.toUpperCase();
        plain = plain.toUpperCase();
        key = key.toUpperCase();
    }

    if ( isValidEncrypt(plain, key, temp, arr) ) {
        let s = plain;

        while ( s.length % Math.sqrt(key.length) != 0 )
            s += temp;

        cipherInput.value = encryptHill( s, key, 0, arr )
    }
});

document.querySelector("#plainTextClear").addEventListener("click", () => {
    document.querySelector("#plainText").value = "";
});

document.querySelector("#advanceSettingButton").addEventListener("click", () => {
    let collapsible = document.querySelector("#advanceSetting");

    if ( collapsible.style.maxHeight )
        collapsible.style.maxHeight = null;
    else 
        collapsible.style.maxHeight = collapsible.scrollHeight * 3 + 'px';
});

document.querySelector("#keyInputSection > #matrix").addEventListener("click", () => {
    document.querySelector("#key").style.display = "none";
    document.querySelector("#matrixKey").style.display = "grid";
    document.querySelector("#sizeSection").style.display = "flex";
    document.querySelector("#keyInputSection > #text").removeAttribute("disabled");
    document.querySelector("#keyInputSection > #matrix").setAttribute("disabled", "");
    document.querySelector("#matrixKey").innerHTML = "";

    let arr = document.querySelector("#alphabetSection input:checked").value.split('');
    let key = document.querySelector("#key").value;
    let size = 0;
    let inputs = [];
    let columns = "";

    for (let i = 0; i <= key.length; i++) {
        if (i * i >= key.length) {
            size = i;
            break;
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("name", `field${i}${j} index${i * size + j}`);
            input.setAttribute("class", "field");
            input.setAttribute("min", "0");

            if ( arr.indexOf(key[i * size + j], 0) != -1 )
                input.value = arr.indexOf(key[i * size + j], 0);
            
            inputs.push( input );
        }

        columns += "auto ";
    }

    document.querySelector("#matrixKey").style.gridTemplateColumns = columns;
    document.querySelector("#matrixSizeInput").value = size;

    for (let i = 0; i < size * size; i++) {
        inputs[i].addEventListener("change", () => {
            let key = "";
            for (let i = 0; i < inputs.length; i++) 
                if ( inputs[i].value >= 0 && inputs[i].value < arr.length ) {
                    key += arr[ inputs[i].value ]
                } else {
                    alert(`Matrix entries (${inputs[i].value}) must not greater than chosen alphabet length (${arr.length})`);
                    inputs[i].value = 0;
                    key += arr[ 0 ];
                }

            document.querySelector("#key").value = key;
        });
        document.querySelector("#matrixKey").appendChild(inputs[i]);
    }
});

document.querySelector("#matrixSizeInput").addEventListener("change", () => {
    document.querySelector("#matrixKey").innerHTML = "";

    let arr = document.querySelector("#alphabetSection input:checked").value.split('');
    let size = document.querySelector("#matrixSizeInput").value;
    let columns = "";
    let inputs = [];

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("name", `field${i}${j} index${i * size + j}`);
            input.setAttribute("class", "field");
            input.setAttribute("min", "0");

            if ( arr.indexOf(key[i * size + j], 0) != -1 )
                input.value = arr.indexOf(key[i * size + j], 0);
            
            inputs.push( input );
        }

        columns += "auto ";
    }

    document.querySelector("#matrixKey").style.gridTemplateColumns = columns;
    document.querySelector("#matrixSizeInput").value = size;

    for (let i = 0; i < size * size; i++) {
        inputs[i].addEventListener("change", () => {
            let key = "";
            for (let i = 0; i < inputs.length; i++) 
                if ( inputs[i].value >= 0 && inputs[i].value < arr.length ) {
                    key += arr[ inputs[i].value ]
                } else {
                    alert(`Matrix entries (${inputs[i].value}) must not greater than chosen alphabet length (${arr.length})`);
                    inputs[i].value = 0;
                    key += arr[ 0 ];
                }

            document.querySelector("#key").value = key;
        });
        document.querySelector("#matrixKey").appendChild(inputs[i]);
    }
});

document.querySelector("#keyInputSection > #text").addEventListener("click", () => {
    document.querySelector("#key").style.display = "block";
    document.querySelector("#matrixKey").style.display = "none"
    document.querySelector("#sizeSection").style.display = "none";
    document.querySelector("#keyInputSection > #text").setAttribute("disabled", "");
    document.querySelector("#keyInputSection > #matrix").removeAttribute("disabled");

    let arr = document.querySelector("#alphabetSection input:checked").value.split('');
    let inputs = document.getElementsByClassName("field");
    let key = "";

    for (let i = 0; i < inputs.length; i++) 
        if ( inputs[i].value >= 0 && inputs[i].value < arr.length && inputs[i].value != "")
            key += arr[ inputs[i].value ];

    document.querySelector("#key").value = key;
})

document.querySelector("#customAlphabetInput").addEventListener("change", () => {
    document.querySelector("#customAlphabet").value = document.querySelector("#customAlphabetInput").value;
})

document.querySelector("#decrypt").addEventListener("click", () => {
    let arr = document.querySelector("#alphabetSection input:checked").value.split('');
    let temp = document.querySelector("#templateChar").value;
    let plainInput = document.querySelector("#plainText");
    let key = document.querySelector("#key").value;
    let cipher = document.querySelector("#cipherText").value;

    if ( document.querySelector("#caseSection input").checked ) {
        arr = document.querySelector("#alphabetSection input:checked").value.toUpperCase().split('');
        temp = temp.toUpperCase();
        key = key.toUpperCase();
        cipher = cipher.toUpperCase();
    }

    if ( isValidDecrypt(cipher, key, temp, arr) ) {
        let decryptValue = decryptHill( cipher, key, 0, arr );

        decryptValue = decryptValue.replace(new RegExp(temp + "+$", "g"), '');
        plainInput.value = decryptValue;
    }
});

document.querySelector("#cipherTextClear").addEventListener("click", () => {
    document.querySelector("#cipherText").value = "";
});