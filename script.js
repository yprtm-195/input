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
// @name         Patrick_Star (Fixed)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Auto-fill harga (Clean Version)
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
        
        "HARGA NORMAL| 80GR - EAT MILK/CHOCOLATE": "7900",
        "HARGA PROMO| 80GR - EAT MILK/CHOCOLATE": "6900",
        "HARGA NORMAL| 80GR - EAT MILK/HAZELNUT": "7900",
        "HARGA PROMO| 80GR - EAT MILK/HAZELNUT": "6900",
        "HARGA NORMAL| 80GR - EAT MILK/MARIE BISCUIT": "7900",
        "HARGA PROMO| 80GR - EAT MILK/MARIE BISCUIT": "6900",
        "HARGA NORMAL| 80GR - EAT MILK/MACHA": "0",
        "HARGA PROMO| 80GR - EAT MILK/MACHA": "0",
        "HARGA NORMAL| 240ML - CYD/BLUEBERRY": "9100",
        "HARGA PROMO| 240ML - CYD/BLUEBERRY": "0",
        "HARGA NORMAL| 240ML - CYD/MIX FRUIT": "9100",
        "HARGA PROMO| 240ML - CYD/MIX FRUIT": "0",
        "HARGA NORMAL| 240ML - CYD/MIXED BERRY": "9100",
        "HARGA PROMO| 240ML - CYD/MIXED BERRY": "0",
        "HARGA NORMAL| 240ML - CYD/PLAIN": "9100",
        "HARGA PROMO| 240ML - CYD/PLAIN": "0",
        "HARGA NORMAL| 240ML - CYD/STRAWBERRY": "9100",
        "HARGA PROMO| 240ML - CYD/STRAWBERRY": "0",
        "HARGA NORMAL| 240ML - CYD ZERO/BLUEBERRY": "8500",
        "HARGA PROMO| 240ML - CYD ZERO/BLUEBERRY": "0",
        "HARGA NORMAL| 240ML - CYD ZERO/STRAWBERRY": "8500",
        "HARGA PROMO| 240ML - CYD ZERO/STRAWBERRY": "0",
        "HARGA NORMAL| 240ML - CYD ZERO/STRAWBERRY MANGO": "8500",
        "HARGA PROMO| 240ML - CYD ZERO/STRAWBERRY MANGO": "0",
        "HARGA NORMAL| 240ML - CYD ZERO/TROPICAL FRUIT": "8500",
        "HARGA PROMO| 240ML - CYD ZERO/TROPICAL FRUIT": "0",
        "HARGA NORMAL| 65ML - B4/BLUEBERRY": "0",
        "HARGA PROMO| 65ML - B4/BLUEBERRY": "0",
        "HARGA NORMAL| 65ML - B4/STRAWBERRY": "0",
        "HARGA PROMO| 65ML - B4/STRAWBERRY": "0",
        "HARGA NORMAL| 40GR - STICKPACK/BLUEBERRY": "3500",
        "HARGA PROMO| 40GR - STICKPACK/BLUEBERRY": "0",
        "HARGA NORMAL| 40GR - STICKPACK/BROWN SUGAR": "3500",
        "HARGA PROMO| 40GR - STICKPACK/BROWN SUGAR": "0",
        "HARGA NORMAL| 40GR - STICKPACK/MANGO STICKY RICE": "3500",
        "HARGA PROMO| 40GR - STICKPACK/MANGO STICKY RICE": "0",
        "HARGA NORMAL| 40GR - STICKPACK/ORIGINAL": "3500",
        "HARGA PROMO| 40GR - STICKPACK/ORIGINAL": "0",
        "HARGA NORMAL| 40GR - STICKPACK/STRAWBERRY": "3500",
        "HARGA PROMO| 40GR - STICKPACK/STRAWBERRY": "0",
        "HARGA NORMAL| 40GR - STICKPACK/GRAPE": "3500",
        "HARGA PROMO| 40GR - STICKPACK/GRAPE": "0",
        "HARGA NORMAL| 40GR - STICKPACK/ORANGE": "3500",
        "HARGA PROMO| 40GR - STICKPACK/ORANGE": "0",
        "HARGA NORMAL| 120GR - SQ BITES/BLUEBERRY": "8500",
        "HARGA PROMO| 120GR - SQ BITES/BLUEBERRY": "7900",
        "HARGA NORMAL| 120GR - SQ BITES/BERRY BLEND": "8500",
        "HARGA PROMO| 120GR - SQ BITES/BERRY BLEND": "7900",
        "HARGA NORMAL| 120GR - SQ BITES/STRAWBERRY": "8500",
        "HARGA PROMO| 120GR - SQ BITES/STRAWBERRY": "7900",
        "HARGA NORMAL| 120GR - SQ BITES/STRAWBERRY LYCHEE": "8500",
        "HARGA PROMO| 120GR - SQ BITES/STRAWBERRY LYCHEE": "7900",
        "HARGA NORMAL| 120GR - SQ BITES/STRAWBERRY MANGO": "8500",
        "HARGA PROMO| 120GR - SQ BITES/STRAWBERRY MANGO": "7900",
        "HARGA NORMAL| 120GR - SQ BITES/YUZU": "0",
        "HARGA PROMO| 120GR - SQ BITES/YUZU": "0",
        "HARGA NORMAL| 120GR - SQ/BLUEBERRY": "10800",
        "HARGA PROMO| 120GR - SQ/BLUEBERRY": "0",
        "HARGA NORMAL| 120GR - SQ/BROWN SUGAR": "10800",
        "HARGA PROMO| 120GR - SQ/BROWN SUGAR": "0",
        "HARGA NORMAL| 120GR - SQ/MANGO STICKY RICE": "10800",
        "HARGA PROMO| 120GR - SQ/MANGO STICKY RICE": "0",
        "HARGA NORMAL| 120GR - SQ/ORIGINAL": "10800",
        "HARGA PROMO| 120GR - SQ/ORIGINAL": "0",
        "HARGA NORMAL| 120GR - SQ/STRAWBERRY": "10800",
        "HARGA PROMO| 120GR - SQ/STRAWBERRY": "0",
        "HARGA NORMAL| 225ML - MILK ZERO SUGAR/ALMOND": "0",
        "HARGA PROMO| 225ML - MILK ZERO SUGAR/ALMOND": "0",
        "HARGA NORMAL| 225ML - MILK ZERO/CHOCOLATE": "0",
        "HARGA PROMO| 225ML - MILK ZERO/CHOCOLATE": "0",
        "HARGA NORMAL| 225ML - MILK ZERO/MATCHA": "0",
        "HARGA PROMO| 225ML - MILK ZERO/MATCHA": "0",
        "HARGA NORMAL| 225ML - MILK ZERO/MARIE REGAL": "0",
        "HARGA PROMO| 225ML - MILK ZERO/MARIE REGAL": "0",
        "HARGA NORMAL| 250ML - MILK/ALMOND": "8000",
        "HARGA PROMO| 250ML - MILK/ALMOND": "0",
        "HARGA NORMAL| 250ML - MILK/CASHEW": "8000",
        "HARGA PROMO| 250ML - MILK/CASHEW": "0",
        "HARGA NORMAL| 250ML - MILK/CHOCO MALT": "8000",
        "HARGA PROMO| 250ML - MILK/CHOCO MALT": "0",
        "HARGA NORMAL| 250ML - MILK/CHOCOLATE": "8000",
        "HARGA PROMO| 250ML - MILK/CHOCOLATE": "0",
        "HARGA NORMAL| 250ML - MILK/HAZELNUT": "8000",
        "HARGA PROMO| 250ML - MILK/HAZELNUT": "0",
        "HARGA NORMAL| 250ML - MILK/MARIE REGAL": "8000",
        "HARGA PROMO| 250ML - MILK/MARIE REGAL": "0",
        "HARGA NORMAL| 250ML - MILK/MATCHA": "7800",
        "HARGA PROMO| 250ML - MILK/MATCHA": "0",
        "HARGA NORMAL| 250ML - MILK/STRAWBERRY": "0",
        "HARGA PROMO| 250ML - MILK/STRAWBERRY": "0",
        "HARGA NORMAL| 250ML - MILK/TIRAMISU": "7800",
        "HARGA PROMO| 250ML - MILK/TIRAMISU": "0",
        "HARGA NORMAL| 250ML - MILK/THAI TEA": "7500",
        "HARGA PROMO| 250ML - MILK/THAI TEA": "0",
        "HARGA NORMAL| 250ML - MILK/MILK TEA": "7500",
        "HARGA PROMO| 250ML - MILK/MILK TEA": "0",
        "HARGA NORMAL| 125ML - MILK/CHOCOLATE": "3600",
        "HARGA PROMO| 125ML - MILK/CHOCOLATE": "0",
        "HARGA NORMAL| 125ML - MILK/STRAWBERRY": "0",
        "HARGA PROMO| 125ML - MILK/STRAWBERRY": "0",
        "HARGA NORMAL| 750ML - MILK/ALMOND": "17500",
        "HARGA PROMO| 750ML - MILK/ALMOND": "15300",
        "HARGA NORMAL| 750ML - MILK/CHOCOLATE": "17500",
        "HARGA PROMO| 750ML - MILK/CHOCOLATE": "15300",
        "HARGA NORMAL| 60GR - SINGLES SOSIS/ORIGINAL": "9200",
        "HARGA PROMO| 60GR - SINGLES SOSIS/ORIGINAL": "0",
        "HARGA NORMAL| 60GR - SINGLES SOSIS/KEJU": "9200",
        "HARGA PROMO| 60GR - SINGLES SOSIS/KEJU": "0",
        "HARGA NORMAL| 60GR - SINGLES SOSIS/KEJU 2X": "9200",
        "HARGA PROMO| 60GR - SINGLES SOSIS/KEJU 2X": "0",
        "HARGA NORMAL| 60GR - SINGLES SOSIS/HOT": "9200",
        "HARGA PROMO| 60GR - SINGLES SOSIS/HOT": "0",
        "HARGA NORMAL| 60GR - SINGLES SOSIS/MINI": "9200",
        "HARGA PROMO| 60GR - SINGLES SOSIS/MINI": "0",
        "HARGA NORMAL| 60GR - SINGLES SOSIS/GOCHUJANG": "9200",
        "HARGA PROMO| 60GR - SINGLES SOSIS/GOCHUJANG": "0",
        "HARGA NORMAL| 60GR - SINGLES SOSIS/TOMYUM": "0",
        "HARGA PROMO| 60GR - SINGLES SOSIS/TOMYUM": "0",
        "HARGA NORMAL| 48GR - SINGLES BAKSO/ORIGINAL": "9200",
        "HARGA PROMO| 48GR - SINGLES BAKSO/ORIGINAL": "8900",
        "HARGA NORMAL| 48GR - SINGLES BAKSO/KEJU": "9200",
        "HARGA PROMO| 48GR - SINGLES BAKSO/KEJU": "8900",
        "HARGA NORMAL| 55GR - SINGLES BAKSO/HOT": "9200",
        "HARGA PROMO| 55GR - SINGLES BAKSO/HOT": "8900",
        "HARGA NORMAL| 55GR - SINGLES BAKSO/GOCHUJANG": "9200",
        "HARGA PROMO| 55GR - SINGLES BAKSO/GOCHUJANG": "8900",
        "HARGA NORMAL| 450GR - NUGGET/CHICKEN NUGGET": "59200",
        "HARGA PROMO| 450GR - NUGGET/CHICKEN NUGGET": "0",
        "HARGA NORMAL| 450GR - NUGGET/CRISPY NUGGET": "57900",
        "HARGA PROMO| 450GR - NUGGET/CRISPY NUGGET": "0",
        "HARGA NORMAL| 450GR - NUGGET/CRISPY STICK": "59200",
        "HARGA PROMO| 450GR - NUGGET/CRISPY STICK": "0",
        "HARGA NORMAL| 450GR - NUGGET/CRISPY SPICY": "61900",
        "HARGA PROMO| 450GR - NUGGET/CRISPY SPICY": "0",
        "HARGA NORMAL| 250GR - COCKTAIL/BEEF COCKTAIL": "39500",
        "HARGA PROMO| 250GR - COCKTAIL/BEEF COCKTAIL": "0"

    };
    // ============================================================
    // 🔼 BATAS AREA PASTE 🔼
    // ============================================================



    // --- MESIN PENGGERAK V3 (NATIVE SETTER + BLUR) ---
    function isiData(inputElement, nilai) {
        // 1. Fokus dulu
        inputElement.focus();

        // 2. Tulis value pake Native Setter
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(inputElement, nilai);

        // 3. Tembakin event
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));

        // 4. LEPAS FOKUS (BLUR) - KRUSIAL!
        inputElement.blur(); 
    }

    // --- LOGIC UTAMA PENCARI KOLOM ---
    function gasIsiForm() {
        let inputs = document.querySelectorAll('input[type="number"]');
        let terisi = 0;
        
        inputs.forEach(input => {
            let label = input.getAttribute('aria-label');
            if (label && databaseHarga[label] !== undefined) {
                isiData(input, databaseHarga[label]);
                input.style.backgroundColor = "#d4edda"; 
                input.style.border = "2px solid #28a745";
                terisi++;
            }
        });

        if (terisi > 0) {
            tampilkanToast(`✅ SUKSES: ${terisi} Item Terisi & Dikunci!`);
        } else {
            alert("❌ GAGAL: Gak ada item yg cocok.\nCek apakah GRUP PRODUK udah dipilih?");
        }
    }

    // --- FITUR TOAST ---
    function tampilkanToast(pesan) {
        let toast = document.createElement("div");
        toast.innerText = pesan;
        Object.assign(toast.style, {
            position: "fixed",
            bottom: "150px",
            left: "20px", 
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: "100000",
            fontSize: "14px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- PASANG TOMBOL SAKTI ---
    function pasangTombol() {
        if (document.getElementById("tombolMaster")) return;

        let btn = document.createElement("button");
        btn.id = "tombolMaster";
        btn.innerHTML = "🚀 HAJAR BOS";
        
        Object.assign(btn.style, {
            position: "fixed",
            bottom: "80px",
            left: "20px",
            zIndex: "99999",
            backgroundColor: "#dc3545",
            color: "white",
            padding: "15px 30px",
            borderRadius: "50px",
            fontWeight: "bold",
            fontSize: "16px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
            border: "2px solid white",
            cursor: "pointer"
        });

        btn.onclick = (e) => { 
            e.preventDefault(); 
            btn.innerHTML = "⏳ LAGI NGISI...";
            btn.style.backgroundColor = "#e67e22";
            setTimeout(() => {
                gasIsiForm();
                btn.innerHTML = "🚀 HAJAR BOS";
                btn.style.backgroundColor = "#dc3545";
            }, 100);
        };
        
        document.body.appendChild(btn);
    }
    
    setTimeout(pasangTombol, 3000);
    setInterval(pasangTombol, 2000);

})();


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
