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