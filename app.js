const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpYaH1wS9ejKgTbnilksCOLsIIzL8R1ICGad1cSdg5KmC-ODCJWiQQiMWeZdgcG885Jw/exec";

    const S_CODES = ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10"];
    const EX_CODES = ["REx1","REx2","REx3","REx4","REx5","REx6","REx7","CEx1","CEx2","CEx3","CEx4","CEx5","CEx6"];
    const CODE_INFO = {
        "S1":"ඒකාබද්ධ අරමුදල් සහ පළාත් සභා අරමුදල්", "S2":"සහයෝගිතා ගිවිසුම් යටතේ ක්‍රියාත්මක වන වැඩසටහන් හා ව්‍යාපෘති සඳහා ලැබෙන අරමුදල්", "S3":"රජයේ ආධාර", "S4":"පාසල් පාදක ඉගෙනුම් ප්‍රවර්ධන ප්‍රදානයන්, ගුණාත්මක යෙදවුම් හා උසස් මට්ටමේ ඉගෙනුම් ක්‍රියාවලි සඳහා ලැබෙන අරමුදල්", "S5":"රජය විසින් අනුමත හා ලියාපදිංචි රාජ්‍ය නොවන සංවිධාන වලින් ලැබෙන ආධාර", "S6":"පාසලේ දියුණුව වෙනුවෙන් ස්ව කැමැත්තෙන් දායකත්වය ලබා දෙන ඕනෑම පාර්ශවයක පරිත්‍යාග", "S7":"පාසලට අයත් වත්කම් වලින් උපයා ගන්නා ආදායම්", "S8":"පාසල් සංවර්ධන සමිති සාමාජික මුදල්", "S9":"පාසලේ ඉගෙනුම් ඉගැන්වීම් ක්‍රියාවලියට අදාළ අත්‍යවශ්‍ය ක්‍රියාකාරකම් සඳහා ලැබීම්", "S10":"පාසල් සංවර්ධන සමිතිය මඟින් තීරණය කරනු ලබන පාසලේ අත්‍යවශ්‍ය වියදම් පියවා ගැනීම සඳහා වන අරමුදල්",
        "REx1":"විෂය මාලා ක්‍රියාත්මක කිරීමට අදාළ පුනරාවර්තන වියදම්", "REx2":"උපදේශන, උසස් අධ්‍යාපන හා විෂය සමගාමී ක්‍රියාකාරකම්", "REx3":"අධ්‍යාපන පරිපාලන හා උපයෝගිතා සේවා හා සුභසාධන කටයුතු", "REx4":"කාර්ය මණ්ඩල පාරිශ්‍රමික", "REx5":"ප්‍රාග්ධන භාණ්ඩ හා උපකරණ නඩත්තු/අලුත්වැඩියා", "REx6":"පාසලේ ගොඩනැගිලි සුළු නඩත්තු/අලුත්වැඩියා", "REx7":"පවිත්‍රතා හා පිරිසිදු කිරීම්", 
        "CEx1":"මූලික පහසුකම් - නව සැපයීම්", "CEx2":"විෂය මාලා ක්‍රියාත්මක කිරීමට අදාළ ප්‍රාග්ධන වියදම්", "CEx3":"පුස්තකාල පොත් මිලට ගැනීම්", "CEx4":"ගොඩනැගිලි නව ඉදිකිරීම්, වැඩිදියුණු කිරීම් හා වෙනත් ප්‍රාග්ධන වියදම්", "CEx5":"ප්‍රාග්ධන උපකරණ මිලට ගැනීම්", "CEx6":"විෂේෂ ව්‍යාපෘති සඳහා විෂේෂ ප්‍රාග්ධන ආධාර"
    };
    const COLORS = ["#2e7d32", "#f9a825", "#388e3c", "#fbc02d", "#43a047", "#fdd835", "#4caf50", "#ffeb3b", "#66bb6a", "#ffee58"];

    let currentReport = '';
    let userRole = '';
    let allocations = JSON.parse(localStorage.getItem('sch_allocations') || '{}');
    let clearedStatus = JSON.parse(localStorage.getItem('sch_cleared') || '{}');
    let offlineQueue = JSON.parse(localStorage.getItem('sch_offline_queue') || '[]');
    let initialized = false;

 
    function updateOnlineStatus() {
        const statusDiv = document.getElementById('connection-status');
        if (navigator.onLine) {
            statusDiv.innerHTML = "🟢 ONLINE";
            statusDiv.className = "status-glow-online";
            syncOfflineData();
        } else {
            statusDiv.innerHTML = "🔴 OFFLINE";
            statusDiv.className = "status-glow-offline";
        }
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    function formatAmount(input) {
        let value = input.value.replace(/[^\d.]/g, '');
    
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1].length > 2) {
                parts[1] = parts[1].substring(0, 2);
                value = parts.join('.');
            }
        }
        
        input.value = value;
      
        const pattern = /^(\d+)(\.\d{0,2})?$/;
        if (value && !pattern.test(value)) {
            input.style.borderColor = 'var(--danger)';
            input.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.5)';
        } else {
            input.style.borderColor = '#dcedc8';
            input.style.boxShadow = 'none';
        }
    }

    function parseAmount(amountStr) {
        if (!amountStr) return 0;
        const num = parseFloat(amountStr);
        return isNaN(num) ? 0 : num;
    }

    function showConfirmDialog(title, message, yesText = "ඔව්", noText = "නැත") {
        return new Promise((resolve) => {
            document.getElementById('confirmTitle').textContent = title;
            document.getElementById('confirmMessage').textContent = message;
            document.getElementById('confirmYes').textContent = yesText;
            document.getElementById('confirmNo').textContent = noText;
            
            const dialog = document.getElementById('confirmDialog');
            dialog.style.display = 'flex';
            
            document.getElementById('confirmYes').onclick = () => {
                dialog.style.display = 'none';
                resolve(true);
            };
            
            document.getElementById('confirmNo').onclick = () => {
                dialog.style.display = 'none';
                resolve(false);
            };
        });
    }

    async function checkLogin() {
        const pass = document.getElementById('passInput').value;
        if(pass === "MyApp") userRole = 'ADMIN';
        else if(pass === "Staff123") userRole = 'STAFF';
        else if(pass === "Guest") userRole = 'GUEST';
        else { alert("මුරපදය වැරදියි!"); return; }
        
        document.getElementById('login-overlay').style.display = 'none';
        applyPermissions();
        await init();
    }

    function applyPermissions() {
        if(userRole === 'ADMIN' || userRole === 'STAFF') {
            document.querySelectorAll('.staff-only').forEach(el => el.style.display = 'block');
        }
        if(userRole === 'ADMIN') {
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
        }
        
        // Hide print and PDF buttons for Guest users
        if(userRole === 'GUEST') {
            document.getElementById('print-btn').style.display = 'none';
            document.getElementById('pdf-btn').style.display = 'none';
        } else {
            document.getElementById('print-btn').style.display = 'flex';
            document.getElementById('pdf-btn').style.display = 'flex';
        }
    }

    async function init() {
        updateOnlineStatus();
        if (initialized) return;

        populateOptions();
        refreshDashboard();
        renderCodesList();
        updateProjectSelects();
        renderProjectList();
        loadRecentTable();

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('inDate').value = today;
        document.getElementById('exDate').value = today;
        document.getElementById('repFrom').value = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
        document.getElementById('repTo').value = today;

        await fetchRemoteData();
        await fetchRemoteProjects();
        
        initialized = true;
    }

    async function manualRefresh() { 
        toggleLoading(true);
        await fetchRemoteData(); 
        await fetchRemoteProjects(); 
        refreshDashboard(); 
        toggleLoading(false);
        showToast("✅ දත්ත සාර්ථකව යාවත්කාලීන කරන ලදී!"); 
    }

    function editTransaction(id) {
    const db = getData();
    const entry = db.find(r => r.id === id);
    if(!entry) return;

    showSec('entry');

    if(entry.type === 'IN') {
        document.getElementById('edit-id-in').value = entry.id;
        document.getElementById('inDate').value = entry.date.split('T')[0];
        document.getElementById('inRef').value = entry.ref;
        document.getElementById('inCodeSelect').value = entry.code;
        document.getElementById('inAmt').value = entry.amt.toFixed(2);
        document.getElementById('inProjSelect').value = entry.proj;
        document.getElementById('inDesc').value = entry.desc;
        document.getElementById('btn-save-in').innerText = "යාවත්කාලීන කරන්න (Update)";
        
        // EX පෝරමයේ ID හිස් කරන්න
        document.getElementById('edit-id-ex').value = '';
    } else {
        document.getElementById('edit-id-ex').value = entry.id;
        document.getElementById('exDate').value = entry.date.split('T')[0];
        document.getElementById('exVoucher').value = entry.vouch;
        document.getElementById('exRef').value = entry.ref;
        document.getElementById('exAmt').value = entry.amt.toFixed(2);
        document.getElementById('exCodeSelect').value = entry.code;
        document.getElementById('exSourceSelect').value = entry.source;
        document.getElementById('exProjSelect').value = entry.proj;
        document.getElementById('exDesc').value = entry.desc;
        document.getElementById('btn-save-ex').innerText = "යාවත්කාලීන කරන්න (Update)";
        
        // IN පෝරමයේ ID හිස් කරන්න
        document.getElementById('edit-id-in').value = '';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
    async function fetchRemoteData() {
        try {
            const response = await fetch(SCRIPT_URL + "?action=read&t=" + Date.now());
            const remoteData = await response.json();
            
            let localDB = JSON.parse(localStorage.getItem('sch_db') || '[]');
            let unsynced = localDB.filter(item => item.synced === false);
            
            const merged = [...remoteData.map(d => ({...d, synced: true})), ...unsynced];
            localStorage.setItem('sch_db', JSON.stringify(merged));
            loadRecentTable();
            return merged;
        } catch (e) {
            return JSON.parse(localStorage.getItem('sch_db') || '[]');
        }
    }

    async function fetchRemoteProjects() {
        try {
            const response = await fetch(SCRIPT_URL + "?action=read_projects&t=" + Date.now());
            const projects = await response.json();
            localStorage.setItem('sch_projs', JSON.stringify(projects));
            renderProjectList();
            updateProjectSelects();
        } catch (e) {}
    }

    function toggleLoading(show) {
        document.getElementById('loading-overlay').style.display = show ? 'flex' : 'none';
    }

    function getData() { return JSON.parse(localStorage.getItem('sch_db') || '[]'); }
    function getProjects() { return JSON.parse(localStorage.getItem('sch_projs') || '[]'); }

    function populateOptions() {
        const selects = ['inCodeSelect', 'exSourceSelect', 'opCodeSelect'];
        selects.forEach(sId => {
            const el = document.getElementById(sId);
            if(el) {
                el.innerHTML = '';
                S_CODES.forEach(c => el.innerHTML += `<option value="${c}">${c} - ${CODE_INFO[c]}</option>`);
            }
        });
        const exCodeSelects = ['exCodeSelect', 'allocCodeSelect'];
        exCodeSelects.forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                el.innerHTML = '';
                EX_CODES.forEach(c => el.innerHTML += `<option value="${c}">${c} - ${CODE_INFO[c]}</option>`);
            }
        });
    }

    function renderCodesList() {
        document.getElementById('codes-s').innerHTML = S_CODES.map(c => `<div class="code-tag"><span class="code-num">${c}</span>${CODE_INFO[c]}</div>`).join('');
        document.getElementById('codes-ex').innerHTML = EX_CODES.map(c => `<div class="code-tag"><span class="code-num" style="background:var(--danger); color:white;">${c}</span>${CODE_INFO[c]}</div>`).join('');
    }

    function validateForm(type) {
        const prefix = type === 'IN' ? 'in' : 'ex';
        const date = document.getElementById(prefix + 'Date').value;
        const amt = document.getElementById(prefix + 'Amt').value;
        const code = document.getElementById(prefix + 'CodeSelect').value;
        const desc = document.getElementById(prefix + 'Desc').value;
        
        if(!date) {
            showToast("⚠️ කරුණාකර දිනය ඇතුළත් කරන්න");
            document.getElementById(prefix + 'Date').focus();
            return false;
        }
        if(!amt || parseAmount(amt) <= 0) {
            showToast("⚠️ කරුණාකර වලංගු මුදලක් ඇතුළත් කරන්න");
            document.getElementById(prefix + 'Amt').focus();
            return false;
        }
        if(!code || code === "") {
            showToast("⚠️ කරුණාකර " + (type === 'IN' ? 'ලැබීම්' : 'ගෙවීම්') + " කේතය තෝරන්න");
            document.getElementById(prefix + 'CodeSelect').focus();
            return false;
        }
        if(!desc.trim()) {
            showToast("⚠️ කරුණාකර විස්තරය ඇතුළත් කරන්න");
            document.getElementById(prefix + 'Desc').focus();
            return false;
        }
        
        if(type === 'IN') {
            const ref = document.getElementById('inRef').value;
            if(!ref.trim()) {
                showToast("⚠️ කරුණාකර ලදුපත් අංකය ඇතුළත් කරන්න");
                document.getElementById('inRef').focus();
                return false;
            }
        } else {
            const voucher = document.getElementById('exVoucher').value;
            const source = document.getElementById('exSourceSelect').value;
            
            if(!voucher.trim()) {
                showToast("⚠️ කරුණාකර වවුචර් අංකය ඇතුළත් කරන්න");
                document.getElementById('exVoucher').focus();
                return false;
            }
            if(!source || source === "") {
                showToast("⚠️ කරුණාකර මූලාශ්‍ර අරමුදල තෝරන්න");
                document.getElementById('exSourceSelect').focus();
                return false;
            }
        }
        
        return true;
    }

async function saveData(type) {
    if(!validateForm(type)) return;
    
    const prefix = type === 'IN' ? 'in' : 'ex';
    const existingId = document.getElementById('edit-id-' + prefix).value;
    
    // යාවත්කාලීනයද නැතහොත් නව ගනුදෙනුවක්ද යන්න හඳුනාගන්න
    const isEdit = existingId && existingId !== '';
    
    // ID සැකසීම - පැරණි ID භාවිතා කරන්න හෝ නව ID එකක් සාදන්න
    const currentId = isEdit ? parseInt(existingId) : (Date.now() + Math.floor(Math.random()*1000));
    
    const data = { 
        action: 'save_transaction',
        id: currentId,
        date: document.getElementById(prefix + 'Date').value, 
        ref: document.getElementById(prefix + 'Ref').value, 
        vouch: type === 'EX' ? document.getElementById('exVoucher').value : '', 
        code: document.getElementById(prefix + 'CodeSelect').value, 
        amt: parseAmount(document.getElementById(prefix + 'Amt').value || 0), 
        desc: document.getElementById(prefix + 'Desc').value, 
        type: type, 
        source: type === 'EX' ? document.getElementById('exSourceSelect').value : document.getElementById('inCodeSelect').value,
        proj: document.getElementById(prefix + 'ProjSelect').value,
        status: true,
        isOp: false,
        synced: false
    };
    
    let db = getData();
    
    if (isEdit) {
        // පැරණි ගනුදෙනුව සොයා යාවත්කාලීන කරන්න
        const existingIndex = db.findIndex(item => item.id === currentId);
        if (existingIndex !== -1) {
            db[existingIndex] = data;
            showToast("✅ ගනුදෙනුව සාර්ථකව යාවත්කාලීන කරන ලදී!");
        } else {
            // ID හමු නොවුනහොත් නව ගනුදෙනුවක් ලෙස එකතු කරන්න
            db.push(data);
            showToast("✅ නව ගනුදෙනුව සාර්ථකව ගිණුම්ගත කරන ලදී!");
        }
    } else {
        // නව ගනුදෙනුවක්
        db.push(data);
        showToast("✅ නව ගනුදෙනුව සාර්ථකව ගිණුම්ගත කරන ලදී!");
    }
    
    localStorage.setItem('sch_db', JSON.stringify(db));
    
    offlineQueue.push(data);
    localStorage.setItem('sch_offline_queue', JSON.stringify(offlineQueue));

    refreshDashboard();
    loadRecentTable();
    resetForms();
    
    // බොත්තම් පෙළ නැවත සකසන්න
    document.getElementById('btn-save-' + prefix).innerText = type === 'IN' ? "ලැබීම ගිණුම්ගත කරන්න" : "ගෙවීම ගිණුම්ගත කරන්න";
    
    syncOfflineData();
}
    async function syncOfflineData() {
        if (!navigator.onLine || offlineQueue.length === 0) return;
        
        console.log("සමමුහුර්ත කිරීම ආරම්භ විය...");
        const itemsToSync = [...offlineQueue];
        
        for (let item of itemsToSync) {
            try {
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify(item)
                });
                
                if (response.ok) {
                    let db = getData();
                    let dbItem = db.find(d => d.id === item.id);
                    if (dbItem) dbItem.synced = true;
                    localStorage.setItem('sch_db', JSON.stringify(db));
                    
                    offlineQueue = offlineQueue.filter(q => q.id !== item.id);
                    localStorage.setItem('sch_offline_queue', JSON.stringify(offlineQueue));
                }
            } catch (e) {
                console.error("Sync error for ID: " + item.id);
                break;
            }
        }
        loadRecentTable();
    }

    async function saveOpening() {
        const code = document.getElementById('opCodeSelect').value;
        const amt = parseAmount(document.getElementById('opAmt').value || 0);
        if(amt <= 0) {
            showToast("⚠️ මුදල ඇතුළත් කරන්න");
            return;
        }
        
        const data = { 
            action: 'save_transaction', 
            id: Date.now(), 
            date: "2024-01-01", 
            ref: 'OPENING', 
            vouch: '', 
            code: code, 
            amt: amt, 
            desc: 'ආරම්භක ශේෂය', 
            type: 'IN', 
            source: code, 
            isOp: true, 
            status: true,
            synced: false
        };
        
        let db = getData();
        db.push(data);
        localStorage.setItem('sch_db', JSON.stringify(db));
        offlineQueue.push(data);
        localStorage.setItem('sch_offline_queue', JSON.stringify(offlineQueue));
        
        showToast("✅ ආරම්භක ශේෂය ගිණුම්ගත කෙරිණි!");
        refreshDashboard();
        syncOfflineData();
        
        document.getElementById('opAmt').value = '';
    }

    // Existing code unchanged...

async function saveAllocation() {
    const code = document.getElementById('allocCodeSelect').value;
    const amt = parseAmount(document.getElementById('allocAmt').value || 0);
    
    if(!code || code === "") {
        showToast("⚠️ කරුණාකර ගෙවීම් කේතය තෝරන්න");
        document.getElementById('allocCodeSelect').focus();
        return;
    }
    
    if(amt <= 0) {
        showToast("⚠️ වලංගු මුදලක් ඇතුළත් කරන්න");
        document.getElementById('allocAmt').focus();
        return;
    }
    
    toggleLoading(true);
    
    const data = {
        action: 'save_allocation',
        allocCode: code,
        allocAmt: amt
    };
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Only update localStorage after successful server save
            allocations[code] = amt; 
            localStorage.setItem('sch_allocations', JSON.stringify(allocations));
            showToast("✅ ප්‍රතිපාදන ගිණුම්ගත කරන ලදී!");
        } else {
            throw new Error(result.message || 'Unknown server error');
        }
    } catch (error) {
        console.error("Allocation save error:", error);
        
        if (navigator.onLine) {
            // Online but server error - add to offline queue
            offlineQueue.push(data);
            localStorage.setItem('sch_offline_queue', JSON.stringify(offlineQueue));
            allocations[code] = amt; 
            localStorage.setItem('sch_allocations', JSON.stringify(allocations));
            showToast("⚠️ දත්ත දොෂයකින් ගබඩා කළා. අන්තර්ජාලය සමඟ සමමුහුර්ත වනු ඇත.");
        } else {
            // Offline - store locally and add to queue
            offlineQueue.push(data);
            localStorage.setItem('sch_offline_queue', JSON.stringify(offlineQueue));
            allocations[code] = amt; 
            localStorage.setItem('sch_allocations', JSON.stringify(allocations));
            showToast("✅ ප්‍රතිපාදන දත්ත නොසම්බන්ධිතව ගබඩා කරන ලදී!");
        }
    } finally {
        toggleLoading(false);
        document.getElementById('allocAmt').value = '';
    }
}

// Offline sync function should also handle allocation data
async function syncOfflineData() {
    if (!navigator.onLine || offlineQueue.length === 0) return;
    
    console.log("සමමුහුර්ත කිරීම ආරම්භ විය...");
    const itemsToSync = [...offlineQueue];
    
    for (let item of itemsToSync) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(item)
            });
            
            if (response.ok) {
                const result = await response.json();
                
                if (result.status === 'success') {
                    // Remove from queue
                    offlineQueue = offlineQueue.filter(q => {
                        // Compare based on action and data
                        return !(q.action === item.action && 
                               q.allocCode === item.allocCode && 
                               q.allocAmt === item.allocAmt);
                    });
                    localStorage.setItem('sch_offline_queue', JSON.stringify(offlineQueue));
                    
                    // If it's an allocation, ensure local storage is updated
                    if (item.action === 'save_allocation') {
                        allocations[item.allocCode] = item.allocAmt;
                        localStorage.setItem('sch_allocations', JSON.stringify(allocations));
                    }
                    
                    console.log("Synced item:", item);
                }
            }
        } catch (e) {
            console.error("Sync error for item:", item, e);
            break; // Stop sync if error occurs
        }
    }
    
    // Also sync transaction data
    let db = getData();
    let unSynced = db.filter(r => !r.synced);
    
    for (let item of unSynced) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(item)
            });
            
            if (response.ok) {
                item.synced = true;
            }
        } catch (e) {
            console.error("Transaction sync error:", e);
            break;
        }
    }
    
    localStorage.setItem('sch_db', JSON.stringify(db));
    loadRecentTable();
}

// Rest of the code remains unchanged...

    function openReport(type) {
        currentReport = type;
        showSec('report');
        
        const filterBox = document.getElementById('filter-box');
        if(type === 'IN' || type === 'EX') {
            filterBox.style.display = 'block';
            populateReportFilter(type);
        } else {
            filterBox.style.display = 'none';
        }
        
        const bankBalBox = document.getElementById('bank-bal-box');
        if(type === 'BANK') {
            bankBalBox.style.display = 'block';
        } else {
            bankBalBox.style.display = 'none';
        }
        
        generateReport();
    }

    function populateReportFilter(type) {
        const filterSelect = document.getElementById('repFilter');
        filterSelect.innerHTML = '<option value="ALL">සියලුම කේතයන්</option>';
        
        const codes = (type === 'IN') ? S_CODES : EX_CODES;
        codes.forEach(c => {
            filterSelect.innerHTML += `<option value="${c}">${c} - ${CODE_INFO[c]}</option>`;
        });
    }

function viewCodeDetails(code, type) {
    const db = getData();
    const from = document.getElementById('repFrom').value;
    const to = document.getElementById('repTo').value;
    
    // ලැබීම් ගනුදෙනු
    const incomeTransactions = db.filter(r => 
        r.code === code && 
        r.type === 'IN' && 
        (!from || r.date >= from) && 
        (!to || r.date <= to)
    );
    
    // ගෙවීම් ගනුදෙනු
    const expenseTransactions = db.filter(r => 
        r.code === code && 
        r.type === 'EX' && 
        (!from || r.date >= from) && 
        (!to || r.date <= to)
    );
    
    // මුලු ලැබීම්
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amt, 0);
    
    // මුලු ගෙවීම්
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amt, 0);
    
    // ශේෂය
    const balance = totalIncome - totalExpense;
    
    document.getElementById('modalCodeTitle').innerText = `${code} - ${CODE_INFO[code]} (${type === 'IN' ? 'ලැබීම්' : 'ගෙවීම්'})`;
    
    let html = `
    <div style="margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #d4edda; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 14px; color: #155724;">මුළු ලැබීම්</div>
                <div style="font-size: 24px; font-weight: bold; color: green;"> ${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 14px; color: #721c24;">මුළු ගෙවීම්</div>
                <div style="font-size: 24px; font-weight: bold; color: red;">${totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 14px; color: #0c5460;">ශේෂය</div>
                <div style="font-size: 24px; font-weight: bold; color: ${balance >= 0 ? 'blue' : 'orange'};">${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
        </div>
        
        <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <div style="flex: 1; background: #e2e3e5; padding: 10px; border-radius: 8px; text-align: center;">
                <div style="font-size: 14px; color: #383d41;">ලැබීම් ගනුදෙනු</div>
                <div style="font-size: 20px; font-weight: bold; color: #383d41;">${incomeTransactions.length}</div>
            </div>
            <div style="flex: 1; background: #e2e3e5; padding: 10px; border-radius: 8px; text-align: center;">
                <div style="font-size: 14px; color: #383d41;">ගෙවීම් ගනුදෙනු</div>
                <div style="font-size: 20px; font-weight: bold; color: #383d41;">${expenseTransactions.length}</div>
            </div>
        </div>`;
    
    // ලැබීම් ගනුදෙනු ලැයිස්තුව (සැමවිටම පෙන්වන්න)
    html += `
        <h4 style="color: green; border-bottom: 2px solid #28a745; padding-bottom: 5px; margin-top: 20px;">
            <span style="background: #28a745; color: white; padding: 3px 8px; border-radius: 4px; margin-right: 10px;">✔</span>
            ලැබීම් ගනුදෙනු
        </h4>`;
    
    if (incomeTransactions.length === 0) {
        html += `<p style="text-align: center; color: #666; padding: 20px; background: #f8f9fa; border-radius: 8px;">ලැබීම් ගනුදෙනු කිසිවක් නැත</p>`;
    } else {
        html += `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="background: #d4edda;">
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">දිනය</th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">විස්තරය</th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">ලදුපත් අංකය</th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">ව්‍යාපෘතිය</th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">මුදල (රු.)</th>
                </tr>
            </thead>
            <tbody>`;
        
        incomeTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(tr => {
            html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; border: 1px solid #ddd;">${tr.date}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${tr.desc}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${tr.ref || '-'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${tr.proj || '-'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: green;">${tr.amt.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            </tr>`;
        });
        
        html += `
            </tbody>
            <tfoot>
                <tr style="background: #c3e6cb; font-weight: bold;">
                    <td colspan="4" style="padding: 10px; border: 1px solid #ddd; text-align: right;">ලැබීම් මුළු එකතුව:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
            </tfoot>
        </table>`;
    }
    
    // ගෙවීම් ගනුදෙනු ලැයිස්තුව (සැමවිටම පෙන්වන්න)
    html += `
        <h4 style="color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 5px; margin-top: 30px;">
            <span style="background: #dc3545; color: white; padding: 3px 8px; border-radius: 4px; margin-right: 10px;">✗</span>
            ගෙවීම් ගනුදෙනු
        </h4>`;
    
    if (expenseTransactions.length === 0) {
        html += `<p style="text-align: center; color: #666; padding: 20px; background: #f8f9fa; border-radius: 8px;">ගෙවීම් ගනුදෙනු කිසිවක් නැත</p>`;
    } else {
        html += `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="background: #f8d7da;">
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">දිනය</th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">විස්තරය</th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">වවුචර් අංකය</th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">ව්‍යාපෘතිය</th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">මුදල (රු.)</th>
                </tr>
            </thead>
            <tbody>`;
        
        expenseTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(tr => {
            html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; border: 1px solid #ddd;">${tr.date}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${tr.desc}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${tr.vouch || tr.ref || '-'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${tr.proj || '-'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: red;">${tr.amt.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            </tr>`;
        });
        
        html += `
            </tbody>
            <tfoot>
                <tr style="background: #f5c6cb; font-weight: bold;">
                    <td colspan="4" style="padding: 10px; border: 1px solid #ddd; text-align: right;">ගෙවීම් මුළු එකතුව:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: red;">${totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
            </tfoot>
        </table>`;
    }
    
    html += `
        <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin-top: 30px; border-left: 5px solid #17a2b8;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 14px; color: #0c5460;">කේතය: <strong>${code}</strong></div>
                    <div style="font-size: 14px; color: #0c5460; margin-top: 5px;">${CODE_INFO[code]}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 18px; font-weight: bold; color: ${balance >= 0 ? 'blue' : 'orange'};">
                        අවසාන ශේෂය: ${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        (ලැබීම් ${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})} - ගෙවීම් ${totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2})})
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    document.getElementById('codeDetailsContent').innerHTML = html;
    document.getElementById('codeDetailsModal').style.display = 'flex';
}
    function closeCodeDetails() {
        document.getElementById('codeDetailsModal').style.display = 'none';
    }

    function generateReport() {
        const db = getData();
        const from = document.getElementById('repFrom').value;
        const to = document.getElementById('repTo').value;
        const selectedCode = document.getElementById('repFilter').value; 
        let html = '';
        
        let filtered = db.filter(r => !r.isOp && (!from || r.date >= from) && (!to || r.date <= to));

	if (currentReport === 'CASHBOOK') {
    document.getElementById('report-header-title').innerText = "මුදල් පොත (Cash Book)";
    let bal = db.filter(r => r.isOp).reduce((a, c) => a + c.amt, 0);
    
    if (from) { 
        db.filter(r => !r.isOp && r.date < from).forEach(r => bal += (r.type === 'IN' ? r.amt : -r.amt)); 
    }

    // නව තීරු අනුපිළිවෙල: දිනය, විස්තරය, ලදුපත්/වවුචර්, චෙක්පත්, ලැබීම්, ගෙවීම්, ශේෂය
    html = `<table><thead><tr>
                <th>දිනය</th>
                <th>විස්තරය</th>
                <th>ලදුපත්/වවුචර්</th>
                <th>චෙක්පත් අංකය</th>
                <th>ලැබීම් (+)</th>
                <th>ගෙවීම් (-)</th>
                <th>ශේෂය</th>
            </tr></thead>
            <tbody>
            <tr style="background:#f0f0f0; font-weight:bold;">
                <td colspan="6" style="text-align:right">ආරම්භක ශේෂය:</td>
                <td style="text-align:right"> ${bal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            </tr>`;

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(r => {
        bal += (r.type === 'IN' ? r.amt : -r.amt);
        
        html += `<tr>
                    <td>${r.date ? r.date.split('T')[0] : ''}</td>
                    <td>${r.desc}</td>
                    <td>${r.type === 'IN' ? (r.ref || '-') : (r.vouch || '-')}</td>
                    <td>${r.type === 'EX' ? (r.ref || '-') : '-'}</td>
                    <td style="text-align:right; color:green;">${r.type === 'IN' ? (r.amt > 0 ? r.amt.toLocaleString(undefined, {minimumFractionDigits: 2}) : '-') : '-'}</td>
                    <td style="text-align:right; color:red;">${r.type === 'EX' ? (r.amt > 0 ? r.amt.toLocaleString(undefined, {minimumFractionDigits: 2}) : '-') : '-'}</td>
                    <td style="text-align:right; font-weight:bold">${bal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('report-content').innerHTML = html;
}
else if(currentReport === 'IN' || currentReport === 'EX') {
    document.getElementById('report-header-title').innerText = 
        (currentReport === 'IN' ? "ලැබීම් විශ්ලේෂණ වාර්තාව" : "ගෙවීම් විශ්ලේෂණ වාර්තාව") + 
        (selectedCode !== 'ALL' ? ` - ${selectedCode}` : "");
 
    const codes = (selectedCode === 'ALL') ? 
        (currentReport === 'IN' ? S_CODES : EX_CODES) : 
        [selectedCode];
 
    const openingBalances = {};
    codes.forEach(code => {
        const openingAmt = db.filter(r => r.isOp && r.source === code)
            .reduce((sum, r) => sum + r.amt, 0);
        openingBalances[code] = openingAmt;
    });
  
    html += `
    <table style="width: 100%; border-collapse: collapse; border: 2px solid ${currentReport === 'IN' ? '#28a745' : '#dc3545'}; margin-bottom: 30px;">
        <thead>
            <tr style="background: ${currentReport === 'IN' ? '#28a745' : '#dc3545'}; color: white;">
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">කේතය</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">විස්තරය</th>
                ${currentReport === 'IN' ? '<th style="padding: 12px; border: 1px solid #ddd; text-align: right;">ආරම්භක ශේෂය (රු.)</th>' : ''}
                <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">ගනුදෙනු ගණන</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">මුළු ${currentReport === 'IN' ? 'ලැබීම්' : 'ගෙවීම්'} (රු.)</th>
                ${currentReport === 'IN' ? '<th style="padding: 12px; border: 1px solid #ddd; text-align: right;">මුළු එකතුව (රු.)</th>' : ''}
                <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">ක්‍රියා</th>
            </tr>
        </thead>
        <tbody>`;
    
    let grandTotal = 0;
    let totalTransactions = 0;
    let totalOpening = 0;
    
    codes.forEach(code => {
        const transactions = db.filter(r => 
            r.type === currentReport && 
            r.code === code && 
            (!from || r.date >= from) && 
            (!to || r.date <= to)
        );
        
        const codeTotal = transactions.reduce((sum, t) => sum + t.amt, 0);
        const transactionCount = transactions.length;
        const openingAmt = openingBalances[code] || 0;
        const grandTotalForCode = currentReport === 'IN' ? (openingAmt + codeTotal) : codeTotal;
        
        grandTotal += currentReport === 'IN' ? grandTotalForCode : codeTotal;
        totalTransactions += transactionCount;
        totalOpening += openingAmt;
        
        html += `
        <tr style="border-bottom: 1px solid #eee; ${transactionCount > 0 ? 'background: #f9f9f9;' : ''}">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: var(--primary);">${code}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${CODE_INFO[code]}</td>
            ${currentReport === 'IN' ? 
                `<td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #006400; font-weight: bold;">
                    ${openingAmt > 0 ? openingAmt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
                </td>` : ''}
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                <span style="display: inline-block; background: ${transactionCount > 0 ? (currentReport === 'IN' ? '#28a745' : '#dc3545') : '#6c757d'}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">
                    ${transactionCount}
                </span>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: ${currentReport === 'IN' ? 'green' : 'red'};">${codeTotal > 0 ? codeTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
            ${currentReport === 'IN' ? 
                `<td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #1b5e20; background: #e8f5e9;">
                    ${grandTotalForCode > 0 ? grandTotalForCode.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
                </td>` : ''}
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                <button onclick="viewCodeDetails('${code}', '${currentReport}')" 
                    style="background: ${currentReport === 'IN' ? 'var(--success)' : 'var(--danger)'}; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 8px; margin: 0 auto; height: 36px; min-width: 100px; transition: all 0.3s;"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 3px 10px rgba(0,0,0,0.15)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <span>🔍</span> විස්තර
                </button>
            </td>
        </tr>`;
    });
    
    const colspan = currentReport === 'IN' ? 2 : 2;
    const totalColspan = currentReport === 'IN' ? 3 : 2;
    
    html += `
        </tbody>
        <tfoot>
            <tr style="background: ${currentReport === 'IN' ? '#d4edda' : '#f8d7da'}; font-weight: bold;">
                <td colspan="${colspan}" style="padding: 12px; border: 1px solid #ddd; text-align: right;">මුළු එකතුව:</td>
                ${currentReport === 'IN' ? 
                    `<td style="padding: 12px; border: 1px solid #ddd; text-align: right; color: #006400;">
                         ${totalOpening > 0 ? totalOpening.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
                    </td>` : ''}
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                    <span style="display: inline-block; background: #343a40; color: white; padding: 4px 10px; border-radius: 12px;">
                        ${totalTransactions}
                    </span>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right; color: ${currentReport === 'IN' ? 'green' : 'red'};">
                     ${(grandTotal - (currentReport === 'IN' ? totalOpening : 0)) > 0 ? (grandTotal - (currentReport === 'IN' ? totalOpening : 0)).toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
                </td>
                ${currentReport === 'IN' ? 
                    `<td style="padding: 12px; border: 1px solid #ddd; text-align: right; color: #1b5e20; font-size: 18px; background: #c8e6c9;">
                         ${grandTotal > 0 ? grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
                    </td>` : ''}
                <td style="padding: 12px; border: 1px solid #ddd;"></td>
            </tr>
        </tfoot>
    </table>`;
    
    if (selectedCode === 'ALL') {
        html += `<h3 style="color: var(--primary); border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">කේත අනුව විස්තරාත්මක වාර්තා</h3>`;
        
        codes.forEach(code => {
            const transactions = db.filter(r => 
                r.type === currentReport && 
                r.code === code && 
                (!from || r.date >= from) && 
                (!to || r.date <= to)
            );
            
            if (transactions.length > 0) {
                const codeTotal = transactions.reduce((sum, t) => sum + t.amt, 0);
                const openingAmt = openingBalances[code] || 0;
                const codeGrandTotal = currentReport === 'IN' ? (openingAmt + codeTotal) : codeTotal;
                
                html += `
                <div style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background: ${currentReport === 'IN' ? '#e8f5e9' : '#fdeaea'}; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                        <div>
                            <strong style="color: var(--primary);">${code}</strong> - ${CODE_INFO[code]}
                            <span style="margin-left: 15px; font-size: 12px; color: #666;">
                                ගනුදෙනු: ${transactions.length} | 
                                ${currentReport === 'IN' ? `ආරම්භක:  ${openingAmt > 0 ? openingAmt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '} | ` : ''}
                                ${currentReport === 'IN' ? 'ලැබීම්' : 'ගෙවීම්'}:  ${codeTotal > 0 ? codeTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
                                ${currentReport === 'IN' ? ` | මුළු:  ${codeGrandTotal > 0 ? codeGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}` : ''}
                            </span>
                        </div>
                        <span style="font-size: 18px;">▼</span>
                    </div>
                    <div style="padding: 15px; display: none;">
                        ${currentReport === 'IN' && openingAmt > 0 ? `
                        <div style="background: #e8f5e9; padding: 10px; border-radius: 5px; margin-bottom: 10px; border-left: 4px solid #28a745;">
                            <strong>ආරම්භක ශේෂය:</strong>  ${openingAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>` : ''}
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: ${currentReport === 'IN' ? '#c8e6c9' : '#f5c6cb'};">
                                    <th style="padding: 8px; border: 1px solid #ddd;">දිනය</th>
                                    <th style="padding: 8px; border: 1px solid #ddd;">විස්තරය</th>
                                    <th style="padding: 8px; border: 1px solid #ddd;">${currentReport === 'IN' ? 'ලදුපත් අංකය' : 'වවුචර් අංකය'}</th>
                                    <th style="padding: 8px; border: 1px solid #ddd;">ව්‍යාපෘතිය</th>
                                    <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">මුදල (රු.)</th>
                                </tr>
                            </thead>
                            <tbody>`;
                
                transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(tr => {
                    html += `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px; border: 1px solid #ddd;">${tr.date}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${tr.desc}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${currentReport === 'IN' ? tr.ref : (tr.vouch || tr.ref)}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${tr.proj || '-'}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: ${currentReport === 'IN' ? 'green' : 'red'};">${tr.amt.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        </tr>`;
                });
                
                html += `
                            </tbody>
                            <tfoot>
                                <tr style="background: ${currentReport === 'IN' ? '#a5d6a7' : '#f1b0b7'}; font-weight: bold;">
                                    <td colspan="4" style="padding: 8px; border: 1px solid #ddd; text-align: right;">${currentReport === 'IN' ? 'ලැබීම් මුළු එකතුව:' : 'ගෙවීම් මුළු එකතුව:'}</td>
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: ${currentReport === 'IN' ? 'green' : 'red'};">${codeTotal > 0 ? codeTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                                </tr>
                                ${currentReport === 'IN' ? `
                                <tr style="background: #d4edda; font-weight: bold; border-top: 2px solid #28a745;">
                                    <td colspan="4" style="padding: 8px; border: 1px solid #ddd; text-align: right;">මුළු එකතුව (ආරම්භක + ලැබීම්):</td>
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: #1b5e20; font-size: 16px;"> ${codeGrandTotal > 0 ? codeGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                                </tr>` : ''}
                            </tfoot>
                        </table>
                    </div>
                </div>`;
            }
        });
    }
    
    document.getElementById('report-content').innerHTML = html;
}
        else if(currentReport === 'BANK') {
            document.getElementById('report-header-title').innerText = "බැංකු සැසඳුම් ප්‍රකාශය";
            let bankStmtBal = parseAmount(document.getElementById('bankStmtInput').value || 0);
            let filteredDb = db.filter(r => (!from || r.date >= from) && (!to || r.date <= to));

            let unpresentedList = filteredDb.filter(r => r.type === 'EX' && (clearedStatus[r.id] || 'Pending') === 'Pending');
            let totalUnpresented = unpresentedList.reduce((a, b) => a + b.amt, 0);

            let uncreditedList = filteredDb.filter(r => r.type === 'IN' && (clearedStatus[r.id] || 'Pending') === 'Pending');
            let totalUncredited = uncreditedList.reduce((a, b) => a + b.amt, 0);

            let adjustedBalance = bankStmtBal + totalUncredited - totalUnpresented;

            html = `
                <div style="background: #ffffff; padding: 20px; border: 2px solid #333; border-radius: 5px; color: #000;">
                    <h3 style="text-align:center; text-decoration: underline;">බැංකු සැසඳුම් ප්‍රකාශය - ${to || 'අද දිනට'}</h3>
                    <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
                        <tr><td style="padding: 8px;"><b>බැංකු ප්‍රකාශය අනුව ශේෂය</b></td><td style="text-align:right; padding: 8px;"><b> ${bankStmtBal > 0 ? bankStmtBal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</b></td></tr>
                        
                        <tr><td colspan="2" style="padding: 8px; color: #1b5e20;"><b>එකතු කිරීම:</b> තැන්පත් කළ නමුත් නිශ්කාෂණය නොවූ චෙක්පත් (Uncredited)</td></tr>`;
            
            uncreditedList.forEach(r => {
                html += `<tr><td style="padding-left:40px; font-size: 0.9em;">${r.date.split('T')[0]} - ${r.desc}</td><td style="text-align:right; padding-right: 20px;"> ${r.amt > 0 ? r.amt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td></tr>`;
            });

            html += `<tr><td style="padding-left:80px;"><b>මුළු නිශ්කාෂණය නොවූ චෙක්පත් එකතුව</b></td><td style="text-align:right; border-top:1px solid #000; padding: 8px;"> ${totalUncredited > 0 ? totalUncredited.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td></tr>
                        <tr style="background:#f0f0f0;"><td style="padding: 8px;"><b>උප එකතුව</b></td><td style="text-align:right; padding: 8px;"><b> ${(bankStmtBal + totalUncredited) > 0 ? (bankStmtBal + totalUncredited).toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</b></td></tr>
                        
                        <tr><td colspan="2" style="padding: 8px; color: #b71c1c;"><b>අඩු කිරීම:</b> නිකුත් කළ නමුත් බැංකුවට ඉදිරිපත් නොවූ චෙක්පත් (Unpresented)</td></tr>`;

            unpresentedList.forEach(r => {
                html += `<tr><td style="padding-left:40px; font-size: 0.9em;">${r.ref || '-'} (${r.date.split('T')[0]}) - ${r.desc}</td><td style="text-align:right; padding-right: 20px;">( ${r.amt > 0 ? r.amt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '})</td></tr>`;
            });

            html += `<tr><td style="padding-left:80px;"><b>මුළු ඉදිරිපත් නොකළ චෙක්පත් එකතුව</b></td><td style="text-align:right; border-top:1px solid #000; padding: 8px;">( ${totalUnpresented > 0 ? totalUnpresented.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '})</td></tr>
                        <tr style="border-bottom: 4px double #000; background: #fff8e1;">
                            <td style="padding: 10px;"><b style="font-size:1.1em;">මුදල් පොතේ ශේෂය (Cash Book Balance)</b></td>
                            <td style="text-align:right; padding: 10px;"><b style="font-size:1.1em;"> ${adjustedBalance > 0 ? adjustedBalance.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</b></td>
                        </tr>
                    </table>
                </div>

                <div class="no-print" style="margin-top:40px;">
                    <hr>
                    <h4>චෙක්පත් සහ ලැබීම් තත්ත්වය යාවත්කාලීන කරන්න (Pending/Cleared)</h4>
                    <p style="font-size: 0.9em; color: #666;">*මෙහි Pending ලෙස ඇති දත්ත පමණක් ඉහත සැසඳුම් ප්‍රකාශයට ඇතුළත් වේ.</p>
                    <table class="q-table">
                        <thead><tr><th>දිනය</th><th>විස්තරය</th><th>අංකය</th><th>මුදල (රු.)</th><th>වර්ගය</th><th>තත්ත්වය</th></tr></thead><tbody>`;

            filteredDb.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(r => {
                let status = clearedStatus[r.id] || 'Pending';
                html += `<tr>
                    <td>${r.date.split('T')[0]}</td>
                    <td>${r.desc}</td>
                    <td>${r.ref || (r.vouch || '-')}</td>
                    <td class="val-col"> ${r.amt > 0 ? r.amt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                    <td>${r.type === 'IN' ? 'ලැබීම' : 'ගෙවීම'}</td>
                    <td>
                        <select class="status-select ${status === 'Cleared' ? 'status-cleared' : 'status-pending'}" onchange="updateClearedStatus('${r.id}', this.value)">
                            <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Cleared" ${status === 'Cleared' ? 'selected' : ''}>Cleared</option>
                        </select>
                    </td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
        }	
        else if(currentReport === 'VARIANCE') {
            document.getElementById('report-header-title').innerText = "ප්‍රතිපාදන සහ වියදම් සැසඳුම";
            html = `<table><tr><th>වියදම් කේතය</th><th>ප්‍රතිපාදන</th><th> වියදම</th><th>ශේෂය</th><th>භාවිතය %</th></tr>`;
            EX_CODES.forEach(c => {
                const actual = db.filter(r => r.type === 'EX' && r.code === c && (!from || r.date >= from) && (!to || r.date <= to)).reduce((a,b) => a+b.amt, 0);
                const budget = allocations[c] || 0;
                const balance = budget - actual;
                const perc = budget > 0 ? ((actual / budget) * 100).toFixed(1) : 0;
                html += `<tr><td><b>${c}</b> - ${CODE_INFO[c]}</td><td class="val-col">${budget > 0 ? budget.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td><td class="val-col">${actual > 0 ? actual.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td><td class="val-col">${balance !== 0 ? balance.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td><td style="text-align:center">${budget > 0 ? perc + '%' : ' - '}</td></tr>`;
            });
            html += '</table>';
        } 
        else if(currentReport === 'QUARTER') {
            document.getElementById('report-header-title').innerText = "සිව්මස් ගිණුම් වාර්තාව";
            
            const fromDate = new Date(document.getElementById('repFrom').value);
            const toDate = new Date(document.getElementById('repTo').value);
            const yearStart = new Date(fromDate.getFullYear(), 0, 1); 

            let opBalTotal = db.filter(r => r.isOp).reduce((a, b) => a + b.amt, 0);
            let tinTotal = opBalTotal, texTotal = 0;

            html = `<table class="q-table">
                <thead>
                    <tr>
                        <th colspan="5" class="q-header">ලැබීම් (හර)</th>
                        <th colspan="5" class="q-header">ගෙවීම් (බැර)</th>
                    </tr>
                    <tr>
                        <th>කේතය</th>
                        <th>වාර්ෂික ඇස්තමේන්තුව</th>
                        <th>පෙර සිව්මස දක්වා</th>
                        <th>මෙම සිව්මස</th>
                        <th>මුළු එකතුව</th>
                        <th>කේතය</th>
                        <th>වාර්ෂික ප්‍රතිපාදන</th>
                        <th>පෙර සිව්මස දක්වා</th>
                        <th>මෙම සිව්මස</th>
                        <th>මුළු එකතුව</th>
                    </tr>
                </thead>
                <tbody>`;

            const maxLength = Math.max(S_CODES.length, EX_CODES.length);

            for (let i = 0; i < maxLength; i++) {
                let s = S_CODES[i] || '';
                let ex = EX_CODES[i] || '';
                let sOp = s ? db.filter(r => r.isOp && r.source === s).reduce((a, b) => a + b.amt, 0) : 0;
                let sPrev = s ? db.filter(r => r.type === 'IN' && !r.isOp && r.source === s && new Date(r.date) < fromDate).reduce((a, b) => a + b.amt, 0) : 0;
                let sCurr = s ? db.filter(r => r.type === 'IN' && r.source === s && new Date(r.date) >= fromDate && new Date(r.date) <= toDate).reduce((a, b) => a + b.amt, 0) : 0;
                let sTotalPrev = sOp + sPrev;
                let exPrev = ex ? db.filter(r => r.type === 'EX' && r.code === ex && new Date(r.date) < fromDate && new Date(r.date) >= yearStart).reduce((a, b) => a + b.amt, 0) : 0;
                let exCurr = ex ? db.filter(r => r.type === 'EX' && r.code === ex && new Date(r.date) >= fromDate && new Date(r.date) <= toDate).reduce((a, b) => a + b.amt, 0) : 0;
                tinTotal += (sPrev + sCurr); 
                texTotal += (exPrev + exCurr);
                html += `<tr>
                    <td>${s}</td>
                    <td class="val-col"> - </td>
                    <td class="val-col">${sTotalPrev > 0 ? sTotalPrev.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                    <td class="val-col">${sCurr > 0 ? sCurr.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                    <td class="val-col" style="background:#f9f9f9">${(sTotalPrev + sCurr) > 0 ? (sTotalPrev + sCurr).toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                    
                    <td>${ex}</td>
                    <td class="val-col">${(allocations[ex] || 0) > 0 ? allocations[ex].toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                    <td class="val-col">${exPrev > 0 ? exPrev.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                    <td class="val-col">${exCurr > 0 ? exCurr.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                    <td class="val-col" style="background:#f9f9f9">${(exPrev + exCurr) > 0 ? (exPrev + exCurr).toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                </tr>`;
            } 

            html += `<tr class="q-total-row">
                <td colspan="4">මුළු ලැබීම් එකතුව (ආරම්භක ශේෂය සහිතව)</td>
                <td class="val-col">${tinTotal > 0 ? tinTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                <td colspan="4">මුළු ගෙවීම් එකතුව</td>
                <td class="val-col">${texTotal > 0 ? texTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
            </tr>
            <tr class="q-total-row">
                <td colspan="9" style="text-align:right">අතැති ශේෂය (Balance)</td>
                <td class="val-col" style="background:var(--gold)">${(tinTotal - texTotal) > 0 ? (tinTotal - texTotal).toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
            </tr>
            </tbody></table>`;
        } 
        else {
            document.getElementById('report-header-title').innerText = currentReport === 'IN' ? "ලැබීම් විශ්ලේෂණ වාර්තාව" : "ගෙවීම් විශ්ලේෂණ වාර්තාව";
            const codes = selectedCode === 'ALL' ? (currentReport === 'IN' ? S_CODES : EX_CODES) : [selectedCode];
            
            if (currentReport === 'IN') {
                html = '<table><tr><th>කේතය</th><th>විස්තරය</th><th style="text-align:right;">මුළු ලැබීම් (රු.)</th><th style="text-align:right;">වැය කළ වියදම (රු.)</th><th style="text-align:right;">ශේෂය (රු.)</th></tr>';
            } else {
                html = '<table><tr><th>කේතය</th><th>විස්තරය</th><th style="text-align:right;">මුදල (රු.)</th></tr>';
            }

            let totalIn = 0, totalEx = 0;

            codes.forEach(c => { 
                const incomeAmt = db.filter(r => {
                    const isCorrectType = r.type === 'IN';
                    const isCorrectCode = (r.code === c || r.source === c);
                    const isWithinDate = (!from || r.date >= from) && (!to || r.date <= to);
                    return isCorrectType && isCorrectCode && (isWithinDate || r.isOp === true);
                }).reduce((a, b) => a + b.amt, 0);

                if (currentReport === 'IN') {
                    const expenseAmt = db.filter(r => r.type === 'EX' && r.source === c && (!from || r.date >= from) && (!to || r.date <= to)).reduce((a, b) => a + b.amt, 0);
                    const balance = incomeAmt - expenseAmt;
                    html += `<tr><td><b>${c}</b></td><td>${CODE_INFO[c]}</td><td class="val-col">${incomeAmt > 0 ? incomeAmt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td><td class="val-col" style="color:red;">${expenseAmt > 0 ? expenseAmt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td><td class="val-col" style="font-weight:bold;">${balance > 0 ? balance.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td></tr>`;
                    totalIn += incomeAmt;
                    totalEx += expenseAmt;
                } else {
                    html += `<tr><td><b>${c}</b></td><td>${CODE_INFO[c]}</td><td class="val-col">${incomeAmt > 0 ? incomeAmt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td></tr>`;
                    totalIn += incomeAmt;
                }
            });

            if (currentReport === 'IN') {
                html += `<tr style="background:#f1f2f6; font-weight:bold;"><td colspan="2">මුළු එකතුව</td><td class="val-col"> ${totalIn > 0 ? totalIn.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td><td class="val-col" style="color:red;">රු. ${totalEx > 0 ? totalEx.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td><td class="val-col">රු. ${(totalIn - totalEx) > 0 ? (totalIn - totalEx).toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td></tr></table>`;
            } else {
                html += `<tr style="background:#f1f2f6; font-weight:bold;"><td colspan="2">මුළු එකතුව</td><td class="val-col"> ${totalIn > 0 ? totalIn.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td></tr></table>`;
            }
        }

        html += `<div class="print-signatures"><div style="width: 33%;"><p>...</p><p><b>පරීක්ෂා කළේ</b></p></div><div style="width: 33%;"><p>...</p><p><b>භාණ්ඩාගාරික</b></p></div><div style="width: 33%;"><p>...</p><p><b>විදුහල්පති</b></p></div></div>`;
        document.getElementById('report-content').innerHTML = html;
        document.getElementById('report-date-range').innerText = `කාලසීමාව: ${(from || "ආරම්භයේ")} සිට ${(to || "අද")} දක්වා`;
    }

    function updateClearedStatus(id, val) {
        clearedStatus[id] = val;
        localStorage.setItem('sch_cleared', JSON.stringify(clearedStatus));
        generateReport();
    }

    async function refreshDashboard() {
    const db = getData();
    const tin = db.filter(r => r.type === 'IN').reduce((a,b) => a + b.amt, 0);
    const tex = db.filter(r => r.type === 'EX').reduce((a,b) => a + b.amt, 0);
	document.getElementById('dash-in').innerText = tin.toLocaleString(undefined, {minimumFractionDigits:2});
	document.getElementById('dash-ex').innerText = tex.toLocaleString(undefined, {minimumFractionDigits:2});
	document.getElementById('dash-bal').innerText = (tin-tex).toLocaleString(undefined, {minimumFractionDigits:2});
    let fundHtml = '';
    S_CODES.forEach((s, i) => {
        const bal = db.filter(r => r.source === s).reduce((a,b) => a + (b.type==='IN'?b.amt:-b.amt), 0);
        
        const balanceText = bal.toLocaleString(undefined, {
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2
        });
        
        fundHtml += `
            <div class="fund-box" style="background:${COLORS[i%COLORS.length]}">
                <div>${s}</div>
                <div style="font-size:18px; font-weight:bold;">${balanceText}</div>
                <small>${CODE_INFO[s]}</small>
            </div>`;
    });
    document.getElementById('dash-funds').innerHTML = fundHtml;
}

    async function loadRecentTable() {
        const db = await getData();
        let html = '<table><tr><th>දිනය</th><th>විස්තරය</th><th>වවුචර්/ලදුපත්</th><th>මුදල (රු.)</th><th>Sync</th><th>ක්‍රියා</th></tr>';
        
        db.sort((a,b) => b.id - a.id).slice(0,5).forEach(r => {
            const syncStatus = r.synced ? '<span class="sync-done">✅ Synced</span>' : '<span class="sync-pending">⏳ Pending</span>';
            
            let actions = [];
            if(userRole === 'ADMIN' || userRole === 'STAFF') {
                actions.push(`<button onclick="editTransaction(${r.id})" class="table-btn" style="background:var(--deep-blue); color:white;">Edit</button>`);
            }
            if(userRole === 'ADMIN') {
                actions.push(`<button onclick="deleteData(${r.id})" class="table-btn" style="background:var(--danger); color:white;">Delete</button>`);
            }
            const actionHtml = actions.length > 0 ? actions.join(' ') : '-';

            html += `<tr>
                <td>${r.date.split('T')[0]}</td>
                <td>${r.desc}</td>
                <td>${r.vouch || r.ref}</td>
                <td style="color:${r.type==='IN'?'green':'red'}"> ${r.amt > 0 ? r.amt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
                <td>${syncStatus}</td> <td>${actionHtml}</td>
            </tr>`;
        });
        document.getElementById('recent-transactions-table').innerHTML = html + '</table>';
    }

    async function saveProject() {
        const name = document.getElementById('projName').value, est = parseAmount(document.getElementById('projEst').value);
        if(!name || !est) {
            showToast("⚠️ කරුණාකර ව්‍යාපෘතියේ නම සහ ඇස්තමේන්තුගත මුදල ඇතුළත් කරන්න");
            return;
        }
        toggleLoading(true);
        try { 
            await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({action:'saveProject', projectName:name, est:est}) }); 
            showToast("✅ ව්‍යාපෘතිය සුරැකිණි!"); 
            await fetchRemoteProjects(); 
        } catch(e) {
            showToast("❌ දෝෂයක් ඇතිවිය!");
        }
        toggleLoading(false);
        
        document.getElementById('projName').value = '';
        document.getElementById('projEst').value = '';
    }

    function renderProjectList() {
        const projs = getProjects(), db = getData();
        let html = '<table><tr><th>ව්‍යාපෘතිය</th><th>ඇස්තමේන්තුව</th><th>ආදායම</th><th>වියදම</th><th>ශේෂය</th></tr>';
        projs.forEach(p => {
            const pin = db.filter(r => r.proj === p.projectName && r.type === 'IN').reduce((a,b)=>a+b.amt,0);
            const pex = db.filter(r => r.proj === p.projectName && r.type === 'EX').reduce((a,b)=>a+b.amt,0);
            const projectBalance = (p.est + pin) - pex;
            html += `<tr><td>${p.projectName}</td><td>${p.est > 0 ? p.est.toFixed(2) : ' - '}</td><td> ${pin > 0 ? pin.toFixed(2) : ' - '}</td><td>${pex > 0 ? pex.toFixed(2) : ' - '}</td><td><b>${(p.est + pin - pex) > 0 ? (p.est + pin - pex).toFixed(2) : ' - '}</b></td></tr>`;
        });
        document.getElementById('project-list-table').innerHTML = html + '</table>';
    }

    function updateProjectSelects() {
        const projs = getProjects();
        ['inProjSelect', 'exProjSelect'].forEach(id => {
            const el = document.getElementById(id);
            el.innerHTML = '<option value="">නොමැත</option>';
            projs.forEach(p => el.innerHTML += `<option value="${p.projectName}">${p.projectName}</option>`);
        });
    }

    async function deleteData(id) {
        const result = await showConfirmDialog(
            "🗑️ දත්ත මැකීම",
            "ඔබට මෙම ගනුදෙනුව ස්ථිරවම මකා දැමීමට අවශ්‍යද?",
            "ඔව්, මකන්න",
            "අවලංගු කරන්න"
        );
        
        if(!result) return;
        
        toggleLoading(true);
        try {
            const response = await fetch(SCRIPT_URL + "?action=delete&id=" + id);
            let localDB = JSON.parse(localStorage.getItem('sch_db') || '[]');
            localDB = localDB.filter(item => item.id !== id);
            localStorage.setItem('sch_db', JSON.stringify(localDB));
            loadRecentTable();
            refreshDashboard();
            showToast("✅ දත්ත සාර්ථකව මකා දැමුවා!");
        } catch(e) {
            console.error("Server delete failed", e);
            showToast("❌ සර්වර් එක සමඟ සම්බන්ධ වීමට නොහැකි විය");
        } finally {
            toggleLoading(false);
        }
    }

    function showSec(id) {
        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.getElementById('sec-' + id).style.display = 'block';
        document.getElementById('nav-' + id)?.classList.add('active');
        if(id === 'entry') loadRecentTable();
        if(id === 'proj') renderProjectList();
        if(id === 'dash') refreshDashboard();
    }

    async function manualRefresh() { 
        toggleLoading(true);
        await fetchRemoteData(); 
        await fetchRemoteProjects(); 
        refreshDashboard(); 
        toggleLoading(false);
        showToast("✅ දත්ත අලුත් කරන ලදී!"); 
    }

    function resetForms() {
    // සියලුම edit ID ක්ෂේත්‍ර හිස් කරන්න
    document.getElementById('edit-id-in').value = '';
    document.getElementById('edit-id-ex').value = '';
    
    // පෝරම ප්‍රධාන ක්ෂේත්‍ර හිස් කරන්න
    document.querySelectorAll('input:not([type="hidden"]):not([type="date"]), textarea').forEach(i => i.value = '');
    
    // දිනයන් නැවත සකසන්න
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('inDate').value = today; 
    document.getElementById('exDate').value = today;
    
    // තේරීම් ක්ෂේත්‍ර නැවත සකසන්න
    document.getElementById('inCodeSelect').selectedIndex = 0;
    document.getElementById('exCodeSelect').selectedIndex = 0;
    document.getElementById('exSourceSelect').selectedIndex = 0;
    document.getElementById('inProjSelect').selectedIndex = 0;
    document.getElementById('exProjSelect').selectedIndex = 0;
 
    // බොත්තම් පෙළ නැවත සකසන්න
    document.getElementById('btn-save-in').innerText = "ලැබීම ගිණුම්ගත කරන්න";
    document.getElementById('btn-save-ex').innerText = "ගෙවීම ගිණුම්ගත කරන්න";
}

    function downloadBackupJSON() {
        const db = getData();
        const blob = new Blob([JSON.stringify(db, null, 2)], {type: 'application/json'});
        const a = document.createElement('a'); 
        a.href = URL.createObjectURL(blob); 
        a.download = 'backup.json'; 
        a.click();
        showToast("✅ JSON බැකප් ලබා ගන්නා ලදී!");
    }

    function downloadBackupCSV() {
        const db = getData();
        let csv = 'දිනය,විස්තරය,ලදුපත්/වවුචර්,මුදල,වර්ගය,කේතය,ව්‍යාපෘතිය\n' + 
                 db.map(r => `${r.date},"${r.desc}",${r.ref || r.vouch},${r.amt},${r.type},${r.code},"${r.proj || ''}"`).join('\n');
        const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
        const a = document.createElement('a'); 
        a.href = URL.createObjectURL(blob); 
        a.download = 'data.csv'; 
        a.click();
        showToast("✅ CSV ගොනුව බාගත කරන ලදී!");
    }

    function showToast(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.style.display = 'block';
        setTimeout(() => { t.style.display = 'none'; }, 3000);
    }

    async function syncOfflineData() {
        if (!navigator.onLine) return;
        let db = getData();
        let unSynced = db.filter(r => !r.synced);
        
        for (let item of unSynced) {
            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', 
                    body: JSON.stringify(item)
                });
                item.synced = true; 
            } catch (e) { console.error(e); }
        }
        localStorage.setItem('sch_db', JSON.stringify(db));
        loadRecentTable();
    }

    // PDF Export Function
    async function exportToPDF() {
        // Check if user is Guest
        if(userRole === 'GUEST') {
            showToast("❌ PDF බාගත කිරීමට අවසර නැත!");
            return;
        }
        
        toggleLoading(true);
        
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Capture the printable area
            const element = document.getElementById('printable-area');
            
            // Use html2canvas to capture the element
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Save the PDF
            pdf.save(`වාර්තා_${currentReport}_${new Date().toISOString().slice(0,10)}.pdf`);
            
            showToast("✅ PDF වාර්තාව බාගත කරන ලදී!");
        } catch (error) {
            console.error("PDF generation error:", error);
            showToast("❌ PDF ජනනය කිරීමේ දෝෂයක්!");
        } finally {
            toggleLoading(false);
        }
    }
