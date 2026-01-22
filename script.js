document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#productTable tbody');
    const downloadScriptButton = document.getElementById('downloadScript'); // Ganti ID
    const resetDataButton = document.getElementById('resetData');
    // const outputTextarea = document.getElementById('output'); // Hapus
    
    // --- NUMPAD ELEMENTS ---
    const numpad = document.getElementById('customNumpad');
    const numpadBtns = document.querySelectorAll('.numpad-btn');
    let activeInput = null; 

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

    // Template harus pake fungsi karena kita butuh insert versi dinamis
    function getTampermonkeyTemplate(version, dateString, hargaData) {
        return `// ==UserScript==
// @name         Patrick_Star_Auto_Fill
// @namespace    http://tampermonkey.net/
// @version      ${version}
// @description  Auto-fill harga (Update: ${dateString})
// @author       YPRTM
// @match        https://www.appsheet.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const databaseHarga = {
${hargaData}
    };

    function isiData(inputElement, nilai) {
        // 1. Fokus dulu
        inputElement.focus();

        // 2. Hack: Set Value pake Native Prototype
        // Ini wajib buat nembus state management framework (React/Angular/dll)
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(inputElement, nilai);

        // 3. Hack: Reset Value Tracker (Kalo ada)
        // Biar framework sadar kalo ada perubahan nilai
        let tracker = inputElement._valueTracker;
        if (tracker) {
            tracker.setValue("dummy_old_value");
        }

        // 4. Tembakin Event Wajib (Input & Change)
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));

        // 5. Lepas Fokus (Biasanya trigger save di sini)
        inputElement.blur(); 
    }

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
            tampilkanToast("✅ SUKSES: " + terisi + " Item Terisi & Dikunci!");
        } else {
            alert("❌ GAGAL: Gak ada item yg cocok.\nCek apakah GRUP PRODUK udah dipilih?");
        }
    }

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

    function pasangTombol() {
        if (document.getElementById("tombolMaster")) return;
        let btn = document.createElement("button");
        btn.id = "tombolMaster";
        btn.innerHTML = "🚀 HAJAR BOS";
        Object.assign(btn.style, {
            position: "fixed", bottom: "80px", left: "20px", zIndex: "99999",
            backgroundColor: "#dc3545", color: "white", padding: "15px 30px",
            borderRadius: "50px", fontWeight: "bold", fontSize: "16px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.4)", border: "2px solid white", cursor: "pointer"
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
})();`;
    }

    // --- FUNGSI BUAT NUMPAD ---
    function openNumpad(input) {
        if (activeInput && activeInput !== input) {
            if (activeInput.value.trim() === '') {
                activeInput.value = '0';
                activeInput.dispatchEvent(new Event('input')); 
            }
            activeInput.classList.remove('active-input');
        }

        activeInput = input;
        input.classList.add('active-input');
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        numpad.classList.add('show');
        
        if (input.value === '0') {
            input.value = '';
        }
    }

    function closeNumpad() {
        numpad.classList.remove('show');
        if (activeInput) {
            if (activeInput.value.trim() === '') {
                activeInput.value = '0';
                activeInput.dispatchEvent(new Event('input')); 
            }
            activeInput.classList.remove('active-input');
            activeInput = null;
        }
    }

    numpadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (!activeInput) return;

            const val = btn.getAttribute('data-val');
            const id = btn.id;

            if (id === 'numpadDone') {
                const allInputs = Array.from(document.querySelectorAll('input[type="number"]'));
                const currentIndex = allInputs.indexOf(activeInput);
                
                if (currentIndex >= 0 && currentIndex < allInputs.length - 1) {
                    const nextInput = allInputs[currentIndex + 1];
                    openNumpad(nextInput);
                } else {
                    closeNumpad();
                }
            } else if (id === 'numpadBackspace') {
                activeInput.value = activeInput.value.slice(0, -1);
            } else if (id === 'numpadClear') {
                activeInput.value = '';
            } else {
                activeInput.value += val;
            }

            activeInput.dispatchEvent(new Event('input'));
        });
    });

    document.addEventListener('click', (e) => {
        if (!numpad.contains(e.target) && !e.target.matches('input[type="number"]')) {
            closeNumpad();
        }
    });

    function populateTable() {
        productCatalog.forEach((productName, index) => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = productName;
            
            const savedNormal = localStorage.getItem(`harga_normal_${productName}`);
            const savedPromo = localStorage.getItem(`harga_promo_${productName}`);
            
            const normalPriceCell = document.createElement('td');
            const normalPriceInput = document.createElement('input');
            normalPriceInput.type = 'number';
            normalPriceInput.inputMode = 'none'; 
            normalPriceInput.id = `normal-price-${index}`;
            normalPriceInput.value = savedNormal !== null ? savedNormal : '0';
            
            normalPriceInput.addEventListener('click', function() { openNumpad(this); });
            normalPriceInput.addEventListener('input', (e) => { localStorage.setItem(`harga_normal_${productName}`, e.target.value); });
            normalPriceCell.appendChild(normalPriceInput);
            
            const promoPriceCell = document.createElement('td');
            const promoPriceInput = document.createElement('input');
            promoPriceInput.type = 'number';
            promoPriceInput.inputMode = 'none'; 
            promoPriceInput.id = `promo-price-${index}`;
            promoPriceInput.value = savedPromo !== null ? savedPromo : '0';

            promoPriceInput.addEventListener('click', function() { openNumpad(this); });
            promoPriceInput.addEventListener('input', (e) => { localStorage.setItem(`harga_promo_${productName}`, e.target.value); });
            promoPriceCell.appendChild(promoPriceInput);

            row.appendChild(nameCell);
            row.appendChild(normalPriceCell);
            row.appendChild(promoPriceCell);
            tableBody.appendChild(row);
        });
    }

    // --- LOGIKA UPDATE SCRIPT VIA BLOB ---
    downloadScriptButton.addEventListener('click', () => {
        let data = {};
        let allNormalPricesFilled = true;
        productCatalog.forEach((productName, index) => {
            const normalPrice = document.getElementById(`normal-price-${index}`).value;
            const promoPrice = document.getElementById(`promo-price-${index}`).value || normalPrice;
            if (!normalPrice && normalPrice !== '0') allNormalPricesFilled = false;
            if (normalPrice) {
                data[`HARGA NORMAL| ${productName}`] = normalPrice;
                data[`HARGA PROMO| ${productName}`] = promoPrice;
            }
        });

        if (!allNormalPricesFilled) {
            alert('Harap isi semua Harga Normal!');
            return;
        }

        let hargaDataString = '';
        const keys = Object.keys(data);
        keys.forEach((key, index) => {
            hargaDataString += `        "${key}": "${data[key]}"` + (index < keys.length - 1 ? "\n" : "\n");
        });

        // 1. Generate Versi Dinamis (YYYY.MM.DD.HHmm)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        
        const versionString = `${year}.${month}.${day}.${hour}${minute}`;
        const dateString = `${day}/${month}/${year} ${hour}:${minute}`;

        // 2. Isi Template
        const finalScript = getTampermonkeyTemplate(versionString, dateString, hargaDataString);

        // 3. Bikin Blob (File Virtual)
        const blob = new Blob([finalScript], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);

        // 4. Download / Install
        const a = document.createElement('a');
        a.href = url;
        a.download = 'patrick_star_auto_fill.user.js'; // Ekstensi .user.js wajib biar kedetect Tampermonkey
        document.body.appendChild(a);
        a.click();
        
        // Bersihin
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            tampilkanToast(`🚀 Script siap! Cek notif/layar Tampermonkey.`);
        }, 100);
    });

    resetDataButton.addEventListener('click', () => {
        if (confirm('Reset semua data?')) {
            localStorage.clear();
            document.querySelectorAll('input[type="number"]').forEach(input => input.value = '0');
            alert('Data direset!');
        }
    });

    populateTable();
});
