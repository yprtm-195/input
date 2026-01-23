// ==UserScript==
// @name         Patrick_Star_ONLINE_MASTER
// @namespace    http://tampermonkey.net/
// @version      2026.01.24.0049
// @description  Auto-fill Harga + GPS + Time (Online Data GitHub) - Update: 24/01/2026 00:49
// @author       YPRTM
// @match        https://www.appsheet.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      raw.githubusercontent.com
// @updateURL    https://raw.githubusercontent.com/yprtm-195/tarikan-harga/main/scripts/patrick_star_online_master.user.js
// @downloadURL  https://raw.githubusercontent.com/yprtm-195/tarikan-harga/main/scripts/patrick_star_online_master.user.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    const uWin = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    console.log("🚀 PATRICK STAR SCRIPT MULAI JALAN...");

    // --- KONFIGURASI ---
    const BASE_URL = "https://raw.githubusercontent.com/yprtm-195/tarikan-harga/main/data/";
    let INDEX_TOKO = {}; // Cache Index Toko
    let DATA_HARGA = {}; // Cache Harga Toko Aktif
    let CURRENT_STORE_CODE = null;

    // --- 1. SYSTEM CORE (GPS & TIME) ---
    let savedLat = parseFloat(localStorage.getItem('PATRICK_LAT')) || -6.175392;
    let savedLon = parseFloat(localStorage.getItem('PATRICK_LON')) || 106.827153;
    uWin.PATRICK_GPS = { lat: savedLat, lon: savedLon };

    function bajakLokasi() {
        // 1. Mock Permissions
        const originalQuery = uWin.navigator.permissions.query;
        uWin.navigator.permissions.query = (parameters) => (
            parameters.name === 'geolocation'
                ? Promise.resolve({ state: 'granted', onchange: null })
                : originalQuery.apply(uWin.navigator.permissions, [parameters])
        );

        // 2. Simpan fungsi asli
        const originalGetCurrentPosition = uWin.navigator.geolocation.getCurrentPosition.bind(uWin.navigator.geolocation);
        uWin.originalGetCurrentPosition = originalGetCurrentPosition; 

        // 3. Fake Position
        const getFakePosition = () => {
            return {
                coords: {
                    latitude: uWin.PATRICK_GPS.lat,
                    longitude: uWin.PATRICK_GPS.lon,
                    accuracy: 20, 
                    altitude: 0,
                    altitudeAccuracy: 0,
                    heading: 0,
                    speed: 0
                },
                timestamp: Date.now()
            };
        };

        // 4. Override Brutal
        Object.defineProperty(uWin.navigator.geolocation, 'getCurrentPosition', {
            value: function(success, error, options) {
                if (options && options.MINTA_REAL) {
                    console.log("📍 [SPOOFER] Bypass: Minta Lokasi ASLI...");
                    originalGetCurrentPosition(success, error, options);
                } else {
                    console.log('📍 [SPOOFER] Intercepted! Mengirim lokasi palsu: ' + uWin.PATRICK_GPS.lat);
                    success(getFakePosition());
                }
            },
            writable: true
        });

        Object.defineProperty(uWin.navigator.geolocation, 'watchPosition', {
            value: function(success, error, options) {
                console.log("📍 [SPOOFER] Watch Intercepted!");
                success(getFakePosition());
                return Math.floor(Math.random() * 10000); 
            },
            writable: true
        });
        
        console.log("📍 GPS Spoofer: ACTIVE");
    }
    bajakLokasi();

    let savedTimeOffset = parseInt(localStorage.getItem('PATRICK_TIME_OFFSET')) || 0;
    uWin.PATRICK_TIME_OFFSET = savedTimeOffset;
    if (uWin.PATRICK_TIME_OFFSET !== 0) {
        const OriginalDate = uWin.Date;
        function MockDate(...args) {
            if (args.length === 0) return new OriginalDate(new OriginalDate().getTime() + (uWin.PATRICK_TIME_OFFSET * 60 * 1000));
            return new OriginalDate(...args);
        }
        MockDate.prototype = OriginalDate.prototype;
        MockDate.now = function() { return OriginalDate.now() + (uWin.PATRICK_TIME_OFFSET * 60 * 1000); };
        MockDate.parse = OriginalDate.parse;
        MockDate.UTC = OriginalDate.UTC;
        uWin.Date = MockDate;
        
        const OriginalDTF = uWin.Intl.DateTimeFormat;
        class MockDTF extends OriginalDTF {
            format(date) {
                if (!date) date = new uWin.Date(); 
                return super.format(date);
            }
        }
        uWin.Intl.DateTimeFormat = MockDTF;
        console.log('⏳ Time Machine Aktif: ' + uWin.PATRICK_TIME_OFFSET + ' Menit');
    }

    // --- 2. DATA FETCHER ---
    function fetchStoreIndex() {
        console.log("🔄 Fetching Store Index...");
        GM_xmlhttpRequest({
            method: "GET",
            url: BASE_URL + "store_index.json?t=" + Date.now(),
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        INDEX_TOKO = JSON.parse(response.responseText);
                        console.log("✅ Store Index Loaded: " + Object.keys(INDEX_TOKO).length + " toko.");
                        tampilkanToast("✅ Koneksi Data OK! Siap Scan Toko.");
                    } catch (e) { console.error("JSON Error:", e); }
                } else { console.error("Gagal fetch index:", response.status); }
            }
        });
    }

    function fetchHargaToko(storeCode) {
        if (!INDEX_TOKO[storeCode]) return;
        if (CURRENT_STORE_CODE === storeCode) return;

        const fileName = INDEX_TOKO[storeCode];
        
        let badge = document.getElementById("statusBadge");
        if(badge) { 
            badge.style.color = "#17a2b8"; 
            badge.innerText = "LOADING...";
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: BASE_URL + fileName + "?t=" + Date.now(),
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const branchData = JSON.parse(response.responseText);
                        const storeData = branchData.find(t => t.store_code === storeCode);
                        
                        if (storeData) {
                            DATA_HARGA = {};
                            storeData.products.forEach(p => {
                                if (p.normal) DATA_HARGA["HARGA NORMAL| " + p.id] = p.normal;
                                if (p.promo) DATA_HARGA["HARGA PROMO| " + p.id] = p.promo;
                            });
                            
                            CURRENT_STORE_CODE = storeCode;
                            console.log("✅ Data Harga Ready: " + storeData.store_name);
                            tampilkanToast("✅ Data Siap: " + storeData.store_name);
                            
                            if(badge) { 
                                badge.style.color = "#28a745"; 
                                badge.innerText = "READY: " + storeData.store_name.substring(0, 15);
                            }
                        } else {
                            if(badge) {
                                badge.style.color = "#dc3545";
                                badge.innerText = "NOT FOUND";
                            }
                        }
                    } catch (e) { 
                        if(badge) {
                            badge.style.color = "#dc3545";
                            badge.innerText = "PARSE ERR";
                        }
                    }
                }
            }
        });
    }

    // --- 3. AUTO-SCANNER ---
    function scanStoreCode() {
        if (Object.keys(INDEX_TOKO).length === 0) {
            console.log("Waiting for Store Index...");
            return;
        }

        let foundCode = null;
        // Regex lebih agresif: Gak pake boundary 
        const regex = /[A-Z0-9]{4}/g;

        // 1. Cek INPUT fields & Textarea
        let inputs = document.querySelectorAll('input, textarea');
        for (let input of inputs) {
            let val = input.value;
            if (val && val.length >= 4) {
                let matches = val.match(regex);
                if (matches) {
                    for (let m of matches) {
                        // console.log("Kandidat (Input): " + m); // Uncomment buat debug
                        if (INDEX_TOKO[m]) {
                            foundCode = m;
                            break;
                        }
                    }
                }
            }
            if (foundCode) break;
        }

        // 2. Cek Text Nodes (Fallback)
        if (!foundCode) {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while (node = walker.nextNode()) {
                const text = node.nodeValue;
                if (text && text.length >= 4 && text.length < 100) {
                    let matches = text.match(regex);
                    if (matches) {
                        for (let m of matches) {
                            // console.log("Kandidat (Text): " + m);
                            if (INDEX_TOKO[m]) {
                                foundCode = m;
                                break;
                            }
                        }
                    }
                }
                if (foundCode) break;
            }
        }

        if (foundCode) {
            fetchHargaToko(foundCode);
        }
    }

    setInterval(scanStoreCode, 2000);
    fetchStoreIndex();
    
    pasangTombol();

    // --- 4. EXECUTOR ---
    function isiData(inputElement, nilai) {
        inputElement.focus();
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(inputElement, nilai);
        let tracker = inputElement._valueTracker;
        if (tracker) tracker.setValue("dummy_old_value");
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        inputElement.blur(); 
    }

    function gasIsiForm() {
        if (Object.keys(DATA_HARGA).length === 0) {
            tampilkanToast("⚠️ Belum ada data! Pilih toko dulu.");
            return;
        }

        let inputs = document.querySelectorAll('input[type="number"]');
        let terisi = 0;
        inputs.forEach(input => {
            let label = input.getAttribute('aria-label');
            if (label && DATA_HARGA[label] !== undefined) {
                isiData(input, DATA_HARGA[label]);
                input.style.backgroundColor = "#d4edda"; 
                input.style.border = "2px solid #28a745";
                terisi++;
            }
        });

        if (terisi > 0) {
            tampilkanToast("✅ SUKSES: " + terisi + " Item Terisi!");
        } else {
            alert("❌ GAGAL: Gak ada item yg cocok. Cek apakah Form Harga udah kebuka?");
        }
    }

    function tampilkanToast(pesan) {
        let toast = document.createElement("div");
        toast.innerText = pesan;
        Object.assign(toast.style, {
            position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", 
            backgroundColor: "#333", color: "#fff", padding: "10px 20px", borderRadius: "8px", 
            zIndex: "2147483647", fontSize: "14px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", textAlign: "center"
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- UI PANEL ---
    function pasangTombol() {
        if (document.getElementById("tombolMaster")) return;

        let container = document.createElement("div");
        container.id = "tombolMaster";
        Object.assign(container.style, {
            position: "fixed", top: "50%", transform: "translateY(-50%)", 
            left: "10px", width: "auto", zIndex: "2147483647",
            display: "flex", flexDirection: "column", gap: "8px", fontFamily: "sans-serif", maxWidth: "90vw"
        });

        let settingsContainer = document.createElement("div");
        Object.assign(settingsContainer.style, { display: "none", flexDirection: "column", gap: "5px", marginBottom: "5px" });

        // GPS PANEL
        let gpsPanel = document.createElement("div");
        Object.assign(gpsPanel.style, { backgroundColor: "rgba(0,0,0,0.9)", padding: "10px", borderRadius: "12px", display: "flex", gap: "5px", alignItems: "center" });
        let inputCoords = document.createElement("input");
        inputCoords.type = "text"; inputCoords.readOnly = true; 
        // FIX: Baca dari LocalStorage biar aman dari race condition uWin
        let curLat = localStorage.getItem('PATRICK_LAT') || -6.175392;
        let curLon = localStorage.getItem('PATRICK_LON') || 106.827153;
        inputCoords.value = curLat + ', ' + curLon;
        
        Object.assign(inputCoords.style, { flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #555", fontSize: "12px", backgroundColor: "#333", color: "#fff", pointerEvents: "none" });
        
        let btnPaste = document.createElement("button"); btnPaste.innerHTML = "📋";
        Object.assign(btnPaste.style, { backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "8px", padding: "10px", fontWeight: "bold" });
        btnPaste.onclick = async (e) => { e.preventDefault(); e.stopPropagation(); try { const text = await navigator.clipboard.readText(); if(text) { inputCoords.value = text; tampilkanToast("✅ Paste: " + text.substring(0,15)); } } catch(err){ alert("Cek izin clipboard!"); } };

        let btnReal = document.createElement("button"); btnReal.innerHTML = "📍";
        Object.assign(btnReal.style, { backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "8px", padding: "10px", fontWeight: "bold" });
        btnReal.onclick = (e) => { e.preventDefault(); e.stopPropagation(); tampilkanToast("⏳ Mencari..."); navigator.geolocation.getCurrentPosition((pos)=>{ let lat=pos.coords.latitude; let lon=pos.coords.longitude; inputCoords.value=lat+', '+lon; tampilkanToast('📍 Asli: '+lat.toFixed(4)+', '+lon.toFixed(4)); }, (err)=>{ tampilkanToast("❌ Gagal: "+err.message); }, {MINTA_REAL:true}); };

        let btnSetGps = document.createElement("button"); btnSetGps.innerHTML = "SET";
        Object.assign(btnSetGps.style, { backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "8px", padding: "10px 15px", fontWeight: "bold" });
        btnSetGps.onclick = (e) => { 
            e.preventDefault(); 
            let raw = inputCoords.value; 
            let matches = raw.match(/[-+]?[0-9]*\.?[0-9]+/g); 
            if (matches && matches.length >= 2){ 
                let lat=parseFloat(matches[0]); 
                let lon=parseFloat(matches[1]); 
                // FIX: Re-init object kalo ilang
                if (!uWin.PATRICK_GPS) uWin.PATRICK_GPS = {};
                uWin.PATRICK_GPS.lat=lat; 
                uWin.PATRICK_GPS.lon=lon; 
                localStorage.setItem('PATRICK_LAT', lat); 
                localStorage.setItem('PATRICK_LON', lon); 
                tampilkanToast('📍 Lokasi OK! KLIK TOMBOL GPS DI FORM!');
                // Update tampilan tombol biar user tau
                let oldText = btnSetGps.innerHTML;
                btnSetGps.innerHTML = "OK!";
                btnSetGps.style.backgroundColor = "#28a745";
                setTimeout(() => { 
                    btnSetGps.innerHTML = oldText; 
                    btnSetGps.style.backgroundColor = "#007BFF";
                }, 1000);
            } else { alert("Format salah!"); } 
        };

        gpsPanel.appendChild(inputCoords); gpsPanel.appendChild(btnPaste); gpsPanel.appendChild(btnReal); gpsPanel.appendChild(btnSetGps);

        // TIME PANEL
        let timePanel = document.createElement("div");
        Object.assign(timePanel.style, { backgroundColor: "rgba(0,0,0,0.9)", padding: "10px", borderRadius: "12px", display: "flex", gap: "5px", alignItems: "center" });
        let inputTime = document.createElement("input");
        inputTime.placeholder = "Geser: +Maju, -Mundur";
        inputTime.type = "tel"; // Ganti jadi TEL biar keyboard angka tapi behavior text
        inputTime.value = parseInt(localStorage.getItem('PATRICK_TIME_OFFSET')) || 0;
        Object.assign(inputTime.style, { 
            flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #555", 
            fontSize: "14px", backgroundColor: "#fff", color: "#333", pointerEvents: "auto"
        });
        
        // Hapus touchstart dari stopPropagation biar keyboard HP bisa muncul natural
        ['click', 'mousedown'].forEach(evt => {
            inputTime.addEventListener(evt, (e) => e.stopPropagation());
        });
        
        // Paksa fokus pas diklik
        inputTime.onclick = (e) => {
            e.stopPropagation();
            inputTime.focus();
        };
        
        let btnSetTime = document.createElement("button"); btnSetTime.innerHTML = "SET TIME";
        Object.assign(btnSetTime.style, { backgroundColor: "#fd7e14", color: "white", border: "none", borderRadius: "8px", padding: "10px 15px", fontWeight: "bold", minWidth: "80px" });
        btnSetTime.onclick = (e) => { e.preventDefault(); e.stopPropagation(); let offset = parseInt(inputTime.value); if(!isNaN(offset)){
            window.PATRICK_TIME_OFFSET=offset;
            localStorage.setItem('PATRICK_TIME_OFFSET', offset);
            let ket=offset>0?"dimajukan":"dimundurkan";
            tampilkanToast('⏳ Waktu '+ket+' '+Math.abs(offset)+' menit. MEREFRESH...');
            setTimeout(()=>{location.reload()},1000);
        } };
        
        timePanel.appendChild(inputTime); timePanel.appendChild(btnSetTime);
        settingsContainer.appendChild(gpsPanel); settingsContainer.appendChild(timePanel);

        // STATUS BADGE
        let statusBadge = document.createElement("div");
        statusBadge.id = "statusBadge";
        statusBadge.innerText = "SCANNING...";
        Object.assign(statusBadge.style, {
            backgroundColor: "rgba(0,0,0,0.7)", color: "#ffc107",
            padding: "4px 12px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold",
            textAlign: "center", marginBottom: "5px", border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(2px)", pointerEvents: "none", transition: "all 0.3s ease"
        });

        // CONTROLS
        let controlsContainer = document.createElement("div");
        Object.assign(controlsContainer.style, { display: "flex", gap: "10px", justifyContent: "center" });
        
        let btnToggle = document.createElement("button"); btnToggle.innerHTML = "⚙️";
        Object.assign(btnToggle.style, { backgroundColor: "#343a40", color: "white", width: "50px", height: "50px", borderRadius: "50%", fontWeight: "bold", fontSize: "24px", boxShadow: "0 5px 15px rgba(0,0,0,0.4)", border: "2px solid white", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", padding: "0" });
        btnToggle.onclick = (e) => { e.preventDefault(); settingsContainer.style.display = settingsContainer.style.display === "none" ? "flex" : "none"; };

        let btnHajar = document.createElement("button"); btnHajar.innerHTML = "🚀";
        Object.assign(btnHajar.style, { backgroundColor: "#dc3545", color: "white", width: "50px", height: "50px", borderRadius: "50%", fontWeight: "bold", fontSize: "24px", boxShadow: "0 5px 15px rgba(0,0,0,0.4)", border: "2px solid white", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", padding: "0" });
        btnHajar.onclick = (e) => { e.preventDefault(); btnHajar.innerHTML = "⏳"; btnHajar.style.backgroundColor = "#e67e22"; setTimeout(() => { gasIsiForm(); btnHajar.innerHTML = "🚀"; btnHajar.style.backgroundColor = "#dc3545"; }, 100); };

        controlsContainer.appendChild(btnToggle); controlsContainer.appendChild(btnHajar);
        container.appendChild(settingsContainer); container.appendChild(statusBadge); container.appendChild(controlsContainer);
        document.body.appendChild(container);
    }

})();