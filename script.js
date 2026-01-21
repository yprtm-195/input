document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#productTable tbody');
    const generateAndCopyButton = document.getElementById('generateAndCopy');
    const outputTextarea = document.getElementById('output');

    const productCatalog = [
        "80GR - EAT MILK/CHOCOLATE",
        "80GR - EAT MILK/HAZELNUT",
        "80GR - EAT MILK/MARIE BISCUIT",
        "80GR - EAT MILK/MACHA",
        "240ML - CYD/BLUEBERRY",
        "240ML - CYD/MIX FRUIT",
        "240ML - CYD/MIXED BERRY",
        "240ML - CYD/PLAIN",
        "240ML - CYD/STRAWBERRY",
        "240ML - CYD ZERO/BLUEBERRY",
        "240ML - CYD ZERO/STRAWBERRY",
        "240ML - CYD ZERO/STRAWBERRY MANGO",
        "240ML - CYD ZERO/TROPICAL FRUIT",
        "65ML - B4/BLUEBERRY",
        "65ML - B4/STRAWBERRY",
        "40GR - STICKPACK/BLUEBERRY",
        "40GR - STICKPACK/BROWN SUGAR",
        "40GR - STICKPACK/MANGO STICKY RICE",
        "40GR - STICKPACK/ORIGINAL",
        "40GR - STICKPACK/STRAWBERRY",
        "40GR - STICKPACK/GRAPE",
        "40GR - STICKPACK/ORANGE",
        "120GR - SQ BITES/BLUEBERRY",
        "120GR - SQ BITES/BERRY BLEND",
        "120GR - SQ BITES/STRAWBERRY",
        "120GR - SQ BITES/STRAWBERRY LYCHEE",
        "120GR - SQ BITES/STRAWBERRY MANGO",
        "120GR - SQ BITES/YUZU",
        "120GR - SQ/BLUEBERRY",
        "120GR - SQ/BROWN SUGAR",
        "120GR - SQ/MANGO STICKY RICE",
        "120GR - SQ/ORIGINAL",
        "120GR - SQ/STRAWBERRY",
        "225ML - MILK ZERO SUGAR/ALMOND",
        "225ML - MILK ZERO/CHOCOLATE",
        "225ML - MILK ZERO/MATCHA",
        "225ML - MILK ZERO/MARIE REGAL",
        "250ML - MILK/ALMOND",
        "250ML - MILK/CASHEW",
        "250ML - MILK/CHOCO MALT",
        "250ML - MILK/CHOCOLATE",
        "250ML - MILK/HAZELNUT",
        "250ML - MILK/MARIE REGAL",
        "250ML - MILK/MATCHA",
        "250ML - MILK/STRAWBERRY",
        "250ML - MILK/TIRAMISU",
        "250ML - MILK/THAI TEA",
        "250ML - MILK/MILK TEA",
        "125ML - MILK/CHOCOLATE",
        "125ML - MILK/STRAWBERRY",
        "750ML - MILK/ALMOND",
        "750ML - MILK/CHOCOLATE",
        "60GR - SINGLES SOSIS/ORIGINAL",
        "60GR - SINGLES SOSIS/KEJU",
        "60GR - SINGLES SOSIS/KEJU 2X",
        "60GR - SINGLES SOSIS/HOT",
        "60GR - SINGLES SOSIS/MINI",
        "60GR - SINGLES SOSIS/GOCHUJANG",
        "60GR - SINGLES SOSIS/TOMYUM",
        "48GR - SINGLES BAKSO/ORIGINAL",
        "48GR - SINGLES BAKSO/KEJU",
        "55GR - SINGLES BAKSO/HOT",
        "55GR - SINGLES BAKSO/GOCHUJANG",
        "450GR - NUGGET/CHICKEN NUGGET",
        "450GR - NUGGET/CRISPY NUGGET",
        "450GR - NUGGET/CRISPY STICK",
        "450GR - NUGGET/CRISPY SPICY",
        "250GR - COCKTAIL/BEEF COCKTAIL",
    ];

    const tampermonkeyTemplate = `// ==UserScript==
// @name         Patrick_Star
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Auto-fill harga
// @author       YPRTM
// @match        https://www.appsheet.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // 🔽 AREA PASTE DATA DARI NOTEPAD LU DI BAWAH SINI 🔽
    // ============================================================
    const databaseHarga = {
        
        // --- PASTE DISINI (JANGAN HAPUS KURUNG KURAWAL) ---
        
        {hargaData}

    };
    // ============================================================
    // 🔼 BATAS AREA PASTE 🔼
    // ============================================================


    // --- MESIN PENGGERAK (JANGAN OTAK-ATIK) ---
    function isiData(inputElement, nilai) {
        inputElement.value = nilai;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        let tracker = inputElement._valueTracker;
        if (tracker) tracker.setValue("dumy");
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function gasIsiForm() {
        let inputs = document.querySelectorAll('input[type="number"]');
        let terisi = 0;
        inputs.forEach(input => {
            let label = input.getAttribute('aria-label');
            if (label && databaseHarga[label] !== undefined) {
                isiData(input, databaseHarga[label]);
                input.style.backgroundColor = "#d4edda"; // Hijau
                input.style.border = "2px solid #28a745";
                terisi++;
            }
        });

        if (terisi > 0) {
            let toast = document.createElement("div");
            toast.innerText = \`✅ \${terisi} Item Terisi!\`;
            Object.assign(toast.style, {
                position: "fixed", bottom: "150px", right: "20px",
                backgroundColor: "black", color: "white", padding: "10px",
                borderRadius: "10px", zIndex: "99999"
            });
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } else {
            alert("❌ Gak ada item yang cocok di layar ini bro.");
        }
    }

    function pasangTombol() {
        if (document.getElementById("tombolMaster")) return;
        let btn = document.createElement("button");
        btn.id = "tombolMaster";
        btn.innerHTML = "🚀 HAJAR BOS";
        Object.assign(btn.style, {
            position: "fixed", bottom: "80px", left: "20px", zIndex: "99999",
            backgroundColor: "#dc3545", color: "white", padding: "15px 30px",
            borderRadius: "50px", fontWeight: "bold", boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
            border: "2px solid white"
        });
        btn.onclick = (e) => { e.preventDefault(); gasIsiForm(); };
        document.body.appendChild(btn);
    }
    
    setTimeout(pasangTombol, 3000);
    setInterval(pasangTombol, 2000);
})();`;


    function populateTable() {
        productCatalog.forEach((productName, index) => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = productName;
            
            const normalPriceCell = document.createElement('td');
            const normalPriceInput = document.createElement('input');
            normalPriceInput.type = 'number';
            normalPriceInput.placeholder = 'Harga Normal';
            normalPriceInput.id = `normal-price-${index}`;
                        normalPriceInput.value = '0'; // Default value 0
                        normalPriceInput.addEventListener('focus', function() {
                            // Use setTimeout to ensure select() happens after the click event has fully processed
                            setTimeout(() => this.select(), 0);
                        });
                        // Prevent deselection on mouseup after initial selection
                        normalPriceInput.addEventListener('mouseup', function(e) {
                            e.preventDefault();
                        });
                        normalPriceCell.appendChild(normalPriceInput);
            
                        const promoPriceCell = document.createElement('td');
                        const promoPriceInput = document.createElement('input');
                        promoPriceInput.type = 'number';
                        promoPriceInput.placeholder = 'Harga Promo (Opsional)';
                        promoPriceInput.id = `promo-price-${index}`;
                        promoPriceInput.value = '0'; // Default value 0
                        promoPriceInput.addEventListener('focus', function() {
                            // Use setTimeout to ensure select() happens after the click event has fully processed
                            setTimeout(() => this.select(), 0);
                        });
                        // Prevent deselection on mouseup after initial selection
                        promoPriceInput.addEventListener('mouseup', function(e) {
                            e.preventDefault();
                        });
                        promoPriceCell.appendChild(promoPriceInput);
            row.appendChild(nameCell);
            row.appendChild(normalPriceCell);
            row.appendChild(promoPriceCell);
            tableBody.appendChild(row);
        });
    }

    generateAndCopyButton.addEventListener('click', () => {
        let data = {};
        let allNormalPricesFilled = true;

        productCatalog.forEach((productName, index) => {
            const normalPriceInput = document.getElementById(`normal-price-${index}`);
            const promoPriceInput = document.getElementById(`promo-price-${index}`);
            
            const normalPrice = normalPriceInput.value;
            
            if (!normalPrice && normalPrice !== '0') {
                allNormalPricesFilled = false;
            }
            
            const promoPrice = promoPriceInput.value || normalPrice;

            if (normalPrice) {
                const normalKey = `HARGA NORMAL| ${productName}`;
                const promoKey = `HARGA PROMO| ${productName}`;
                data[normalKey] = normalPrice;
                data[promoKey] = promoPrice;
            }
        });

        if (!allNormalPricesFilled) {
            alert('Harap isi semua Harga Normal untuk setiap produk!');
            return;
        }

        let hargaDataString = '';
        const keys = Object.keys(data);
        keys.forEach((key, index) => {
            hargaDataString += `        "${key}": "${data[key]}"`;
            if (index < keys.length - 1) {
                hargaDataString += ',\n';
            } else {
                hargaDataString += '\n';
            }
        });

        const finalScript = tampermonkeyTemplate.replace('{hargaData}', hargaDataString);
        
        outputTextarea.value = finalScript;
        outputTextarea.style.display = 'block'; // Show the textarea

        // Copy to clipboard
        outputTextarea.select();
        document.execCommand('copy');
        alert('Script berhasil dicopy ke clipboard!');
    });

    populateTable();
});
