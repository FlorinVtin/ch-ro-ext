// Elemente HTML pentru variabilele de tip float
const var1Input = document.getElementById("var1");
const var2Input = document.getElementById("var2");
const var3Input = document.getElementById("var3");
const var4Input = document.getElementById("var4");
const var5Input = document.getElementById("var5");
const var6Input = document.getElementById("var6");
const var7Input = document.getElementById("var7");
const var8Input = document.getElementById("var8");
const var9Input = document.getElementById("var9");
const var10Input = document.getElementById("var10");
const var11Input = document.getElementById("var11");
const saveButton = document.getElementById("saveButton");

// Încarcă valorile salvate din Local Storage (dacă există)
window.onload = () => {
    const savedVar1 = localStorage.getItem("var1");
    const savedVar2 = localStorage.getItem("var2");
    const savedVar3 = localStorage.getItem("var3");
    const savedVar4 = localStorage.getItem("var4");
    const savedVar5 = localStorage.getItem("var5");
    const savedVar6 = localStorage.getItem("var6");
    const savedVar7 = localStorage.getItem("var7");
    const savedVar8 = localStorage.getItem("var8");
    const savedVar9 = localStorage.getItem("var9");
    const savedVar10 = localStorage.getItem("var10");
    const savedVar11 = localStorage.getItem("var11");

    // Dacă există valori salvate, le setăm în câmpurile de input
    if (savedVar1 !== null) {
        var1Input.value = savedVar1;
    }

    if (savedVar2 !== null) {
        var2Input.value = savedVar2;
    }

    if (savedVar3 !== null) {
        var3Input.value = savedVar3;
    }
    if (savedVar4 !== null) {
        var4Input.value = savedVar4;
    }
    if (savedVar5 !== null) {
        var5Input.value = savedVar5;
    }
    if (savedVar6 !== null) {
        var6Input.value = savedVar6;
    }
    if (savedVar7 !== null) {
        var7Input.value = savedVar7;
    }
    if (savedVar8 !== null) {
        var8Input.value = savedVar8;
    }
    if (savedVar9 !== null) {
        var9Input.value = savedVar9;
    }
    if (savedVar10 !== null) {
        var10Input.value = savedVar10;
    }
    if (savedVar11 !== null) {
        var11Input.value = savedVar11;
    }

};

// Salvează valorile în Local Storage când utilizatorul apasă butonul
saveButton.addEventListener("click", () => {
    const var1 = parseFloat(var1Input.value);
    const var2 = parseFloat(var2Input.value);
    const var3 = parseFloat(var3Input.value);
    const var4 = parseFloat(var4Input.value);
    const var5 = parseFloat(var5Input.value);
    const var6 = parseFloat(var6Input.value);
    const var7 = parseFloat(var7Input.value);
    const var8 = parseFloat(var8Input.value);
    const var9 = parseFloat(var9Input.value);
    const var10 = parseFloat(var10Input.value);
    const var11 = parseFloat(var11Input.value);

    // Verifică dacă valorile sunt valide
    if (isNaN(var1) || isNaN(var2)) {
        alert("Te rog să introduci valori numerice valide.");
    } else {
        // Salvează valorile în Local Storage
        localStorage.setItem("var1", var1);
        localStorage.setItem("var2", var2);
        localStorage.setItem("var3", var3);
        localStorage.setItem("var4", var4);
        localStorage.setItem("var5", var5);
        localStorage.setItem("var6", var6);
        localStorage.setItem("var7", var7);
        localStorage.setItem("var8", var8);
        localStorage.setItem("var9", var9);
        localStorage.setItem("var10", var10);
        localStorage.setItem("var11", var11);

        // Afișează mesaj de confirmare
        alert(`Comisioanele au fost salvate`);
    }
    console.log('salvare')
    return {var1, var2, var3, var4, var5, var6, var7, var8, var9, var10, var11};
});


// Funcție pentru a încărca valorile din Local Storage
export function loadVariables() {
    const var1 = parseFloat(localStorage.getItem("var1"));
    const var2 = parseFloat(localStorage.getItem("var2"));
    const var3 = parseFloat(localStorage.getItem("var3"));
    const var4 = parseFloat(localStorage.getItem("var4"));
    const var5 = parseFloat(localStorage.getItem("var5"));
    const var6 = parseFloat(localStorage.getItem("var6"));
    const var7 = parseFloat(localStorage.getItem("var7"));
    const var8 = parseFloat(localStorage.getItem("var8"));
    const var9 = parseFloat(localStorage.getItem("var9"));
    const var10 = parseFloat(localStorage.getItem("var10"));
    const var11 = parseFloat(localStorage.getItem("var11"));
    return {var1, var2, var3, var4, var5, var6, var7, var8, var9, var10, var11};

}

// Exportă funcția de încărcare a variabilelor
// export { loadVariables };
// // Event pentru butonul de scraping (funcționalitate existentă)
// document.getElementById("scrapeButton").addEventListener("click", () => {
//     alert("Scraping initiated..."); // Poti adăuga logica de scraping aici

// });

