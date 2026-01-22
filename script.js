document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#productTable tbody');
    const downloadScriptButton = document.getElementById('downloadScript');
    const resetDataButton = document.getElementById('resetData');
    
    // --- MODAL BANTUAN ---
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const closeModal = document.querySelector('.close-modal');

    if (helpButton) helpButton.onclick = () => helpModal.style.display = "block";
    if (closeModal) closeModal.onclick = () => helpModal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == helpModal) {
            helpModal.style.display = "none";
        }
    };

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
// @description  Auto-fill harga + GPS & Time Spoofing (Update: ${dateString})
// @author       YPRTM
// @match        https://www.appsheet.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- 🌍 SISTEM BAJAK GPS (Dinamis) ---
    // Baca settingan terakhir dari LocalStorage, atau default Monas (-6.175, 106.827)
    let savedLat = parseFloat(localStorage.getItem('PATRICK_LAT')) || -6.175392;
    let savedLon = parseFloat(localStorage.getItem('PATRICK_LON')) || 106.827153;

    // Variabel Global buat nyimpen koordinat aktif
    window.PATRICK_GPS = {
        lat: savedLat,
        lon: savedLon
    };

    function bajakLokasi() {
        // Simpan fungsi asli
        const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
        window.originalGetCurrentPosition = originalGetCurrentPosition;

        const getFakePosition = () => {
            return {
                coords: {
                    latitude: window.PATRICK_GPS.lat,
                    longitude: window.PATRICK_GPS.lon,
                    accuracy: 10,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null
                },
                timestamp: Date.now()
            };
        };

        // Bajak getCurrentPosition
        navigator.geolocation.getCurrentPosition = function(success, error, options) {
            // Flag rahasia buat nembus fake gps
            if (options && options.MINTA_REAL) {
                console.log("📍 Minta Lokasi ASLI...");
                originalGetCurrentPosition(success, error, options);
            } else {
                console.log('📍 GPS DIBAJAK ke: ' + window.PATRICK_GPS.lat + ', ' + window.PATRICK_GPS.lon);
                success(getFakePosition());
            }
        };

        // Bajak watchPosition
        navigator.geolocation.watchPosition = function(success, error, options) {
            console.log("📍 GPS Tracking DIBAJAK!");
            success(getFakePosition());
            return Math.floor(Math.random() * 10000); 
        };
    }

    // Jalanin pembajakan SEGERA (sebelum AppSheet loading)
    bajakLokasi();


    // --- ⏳ SISTEM MESIN WAKTU (Time Spoofing V2 - Inverted Logic) ---
    // +15 = Maju (Cepat), -15 = Mundur (Lambat)
    let savedTimeOffset = parseInt(localStorage.getItem('PATRICK_TIME_OFFSET')) || 0;
    window.PATRICK_TIME_OFFSET = savedTimeOffset;

    if (window.PATRICK_TIME_OFFSET !== 0) {
        const OriginalDate = Date;
        
        function MockDate(...args) {
            if (args.length === 0) {
                const now = new OriginalDate();
                // SEKARANG: Positif = Maju (Cepat), Negatif = Mundur (Lambat)
                return new OriginalDate(now.getTime() + (window.PATRICK_TIME_OFFSET * 60 * 1000));
            }
            return new OriginalDate(...args);
        }

        MockDate.prototype = OriginalDate.prototype;
        MockDate.now = function() {
            return OriginalDate.now() + (window.PATRICK_TIME_OFFSET * 60 * 1000);
        };
        MockDate.parse = OriginalDate.parse;
        MockDate.UTC = OriginalDate.UTC;
        window.Date = MockDate;
        
        const OriginalDTF = Intl.DateTimeFormat;
        class MockDTF extends OriginalDTF {
            format(date) {
                if (!date) date = new Date(); 
                return super.format(date);
            }
        }
        window.Intl.DateTimeFormat = MockDTF;

        console.log('⏳ Time Machine Aktif: Geser ' + window.PATRICK_TIME_OFFSET + ' Menit!');
    }


    const databaseHarga = {
${hargaData}
    };

    function isiData(inputElement, nilai) {
        inputElement.focus();
        // Hack Native Setter
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(inputElement, nilai);
        
        // Hack Value Tracker
        let tracker = inputElement._valueTracker;
        if (tracker) {
            tracker.setValue("dummy_old_value");
        }

        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
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
            alert("❌ GAGAL: Gak ada item yg cocok. Cek apakah GRUP PRODUK udah dipilih?");
        }
    }

    function tampilkanToast(pesan) {
        let toast = document.createElement("div");
        toast.innerText = pesan;
        Object.assign(toast.style, {
            position: "fixed",
            top: "20px", // Pindah ke ATAS biar ga ketutupan
            left: "50%", 
            transform: "translateX(-50%)", // Tengahin
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: "2147483647",
            fontSize: "14px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            textAlign: "center"
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function pasangTombol() {
        if (document.getElementById("tombolMaster")) return;

        // Container Utama (Biar rapi numpuk ke atas)
        let container = document.createElement("div");
        container.id = "tombolMaster";
        Object.assign(container.style, {
            position: "fixed", 
            bottom: "80px", 
            left: "20px", 
            right: "20px", 
            zIndex: "2147483647",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontFamily: "sans-serif",
            maxWidth: "400px"
        });

        // --- CONTAINER SETTING (Hidden) ---
        let settingsContainer = document.createElement("div");
        Object.assign(settingsContainer.style, {
            display: "none",
            flexDirection: "column",
            gap: "5px",
            marginBottom: "5px"
        });

        // 1. PANEL GPS
        let gpsPanel = document.createElement("div");
        Object.assign(gpsPanel.style, {
            backgroundColor: "rgba(0,0,0,0.9)",
            padding: "10px",
            borderRadius: "12px",
            display: "flex",
            gap: "5px",
            alignItems: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
        });

        let inputCoords = document.createElement("input");
        inputCoords.placeholder = "Lat, Lon";
        inputCoords.type = "text";
        inputCoords.readOnly = true; 
        inputCoords.value = window.PATRICK_GPS.lat + ', ' + window.PATRICK_GPS.lon;
        Object.assign(inputCoords.style, { 
            flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #555", 
            fontSize: "12px", backgroundColor: "#333", color: "#fff", pointerEvents: "none"
        });

        let btnPaste = document.createElement("button");
        btnPaste.innerHTML = "📋";
        Object.assign(btnPaste.style, {
            backgroundColor: "#6c757d", color: "white", border: "none",
            borderRadius: "8px", padding: "10px", cursor: "pointer", fontWeight: "bold"
        });
        btnPaste.onclick = async (e) => {
            e.preventDefault(); e.stopPropagation();
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    inputCoords.value = text;
                    tampilkanToast("✅ Paste: " + text.substring(0, 15) + "...");
                } else { tampilkanToast("⚠️ Clipboard kosong!"); }
            } catch (err) { alert("Cek izin clipboard!"); }
        };

        // TOMBOL REAL GPS
        let btnReal = document.createElement("button");
        btnReal.innerHTML = "📍";
        Object.assign(btnReal.style, {
            backgroundColor: "#17a2b8", color: "white", border: "none",
            borderRadius: "8px", padding: "10px", cursor: "pointer", fontWeight: "bold"
        });
        btnReal.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            tampilkanToast("⏳ Mencari lokasi asli...");
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    let lat = pos.coords.latitude;
                    let lon = pos.coords.longitude;
                    inputCoords.value = lat + ', ' + lon;
                    tampilkanToast('📍 Dapet Lokasi Asli: ' + lat.toFixed(4) + ', ' + lon.toFixed(4));
                },
                (err) => { tampilkanToast("❌ Gagal: " + err.message); },
                { MINTA_REAL: true, enableHighAccuracy: true }
            );
        };

        let btnSetGps = document.createElement("button");
        btnSetGps.innerHTML = "SET";
        Object.assign(btnSetGps.style, {
            backgroundColor: "#007BFF", color: "white", border: "none",
            borderRadius: "8px", padding: "10px 15px", cursor: "pointer", fontWeight: "bold"
        });
        btnSetGps.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            let raw = inputCoords.value;
            // Regex nyari angka desimal/negatif
            let matches = raw.match(/[-+]?[0-9]*\\.?[0-9]+/g);
            if (matches && matches.length >= 2) {
                let lat = parseFloat(matches[0]);
                let lon = parseFloat(matches[1]);
                window.PATRICK_GPS.lat = lat;
                window.PATRICK_GPS.lon = lon;
                localStorage.setItem('PATRICK_LAT', lat);
                localStorage.setItem('PATRICK_LON', lon);
                tampilkanToast('📍 Lokasi OK! KLIK TOMBOL GPS DI FORM!');
                // Update tampilan
                btnSetGps.innerHTML = "OK!";
                btnSetGps.style.backgroundColor = "#28a745";
                setTimeout(() => {
                    btnSetGps.innerHTML = "SET";
                    btnSetGps.style.backgroundColor = "#007BFF";
                    inputCoords.value = lat + ', ' + lon;
                }, 1500);
            } else { alert("Format salah!"); }
        };

        gpsPanel.appendChild(inputCoords);
        gpsPanel.appendChild(btnPaste);
        gpsPanel.appendChild(btnReal);
        gpsPanel.appendChild(btnSetGps);

        // 2. PANEL WAKTU
        let timePanel = document.createElement("div");
        Object.assign(timePanel.style, {
            backgroundColor: "rgba(0,0,0,0.9)",
            padding: "10px",
            borderRadius: "12px",
            display: "flex",
            gap: "5px",
            alignItems: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
        });

        let inputTime = document.createElement("input");
        inputTime.placeholder = "Geser: +Maju, -Mundur";
        inputTime.type = "number";
        inputTime.value = parseInt(localStorage.getItem('PATRICK_TIME_OFFSET')) || 0;
        Object.assign(inputTime.style, { 
            flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #555", 
            fontSize: "14px", backgroundColor: "#fff", color: "#333", pointerEvents: "auto"
        });
        ['click', 'mousedown', 'touchstart', 'keydown'].forEach(evt => {
            inputTime.addEventListener(evt, (e) => e.stopPropagation());
        });

        let btnSetTime = document.createElement("button");
        btnSetTime.innerHTML = "SET TIME";
        Object.assign(btnSetTime.style, {
            backgroundColor: "#fd7e14", color: "white", border: "none",
            borderRadius: "8px", padding: "10px 15px", cursor: "pointer", fontWeight: "bold", minWidth: "80px"
        });
        btnSetTime.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            let offset = parseInt(inputTime.value);
            if (!isNaN(offset)) {
                window.PATRICK_TIME_OFFSET = offset;
                localStorage.setItem('PATRICK_TIME_OFFSET', offset);
                let ket = offset > 0 ? "dimajukan" : "dimundurkan";
                tampilkanToast('⏳ Waktu ' + ket + ' ' + Math.abs(offset) + ' menit. REFRESH APP!');
            }
        };

        timePanel.appendChild(inputTime);
        timePanel.appendChild(btnSetTime);

        settingsContainer.appendChild(gpsPanel);
        settingsContainer.appendChild(timePanel);


        // --- TOMBOL KONTROL (Toggle + Hajar) ---
        let controlsContainer = document.createElement("div");
        Object.assign(controlsContainer.style, {
            display: "flex",
            gap: "10px"
        });

        let btnToggle = document.createElement("button");
        btnToggle.innerHTML = "⚙️";
        Object.assign(btnToggle.style, {
            backgroundColor: "#343a40", color: "white", 
            width: "50px", height: "50px",
            borderRadius: "50%", 
            fontWeight: "bold", fontSize: "24px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.4)", border: "2px solid white", cursor: "pointer",
            display: "flex", justifyContent: "center", alignItems: "center", padding: "0"
        });
        btnToggle.onclick = (e) => {
            e.preventDefault();
            if (settingsContainer.style.display === "none") {
                settingsContainer.style.display = "flex";
            } else {
                settingsContainer.style.display = "none";
            }
        };

        let btnHajar = document.createElement("button");
        btnHajar.innerHTML = "🚀";
        Object.assign(btnHajar.style, {
            backgroundColor: "#dc3545", color: "white", 
            width: "50px", height: "50px",
            borderRadius: "50%", 
            fontWeight: "bold", fontSize: "24px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.4)", border: "2px solid white", cursor: "pointer",
            display: "flex", justifyContent: "center", alignItems: "center", padding: "0"
        });
        btnHajar.onclick = (e) => { 
            e.preventDefault(); 
            btnHajar.innerHTML = "⏳";
            btnHajar.style.backgroundColor = "#e67e22";
            setTimeout(() => {
                gasIsiForm();
                btnHajar.innerHTML = "🚀";
                btnHajar.style.backgroundColor = "#dc3545";
            }, 100);
        };

        controlsContainer.appendChild(btnToggle);
        controlsContainer.appendChild(btnHajar);

        container.appendChild(settingsContainer);
        container.appendChild(controlsContainer);
        
        document.body.appendChild(container);
        console.log("Panel Patrick Star (Compact UI) dipasang!");
    }
    
    setInterval(pasangTombol, 1000);
    pasangTombol();
})();`
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

        // Generate Object Bersih
        let cleanData = {};
        const keys = Object.keys(data);
        keys.forEach((key) => {
            cleanData[key] = data[key];
        });

        // Convert ke JSON String yang Rapi
        let jsonString = JSON.stringify(cleanData, null, 4);
        let hargaDataString = jsonString.substring(1, jsonString.length - 1);

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        
        const versionString = `${year}.${month}.${day}.${hour}${minute}`;
        const dateString = `${day}/${month}/${year} ${hour}:${minute}`;

        const finalScript = getTampermonkeyTemplate(versionString, dateString, hargaDataString);

        const blob = new Blob([finalScript], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'patrick_star_auto_fill.user.js'; 
        document.body.appendChild(a);
        a.click();
        
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
