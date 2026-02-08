const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzaVBE_NqOMUS8wQtDWWKw4gsjx-N2KHw4cyzEUDXYctGYo0rx8mq9ZVo2Nyjrt0u27pA/exec";

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
    let allocations = JSON.parse(sessionStorage.getItem('sch_allocations') || '{}');
    let clearedStatus = JSON.parse(sessionStorage.getItem('sch_cleared') || '{}');
    let initialized = false;
    let isLoading = false;

    $(document).ready(function() {
        updateOnlineStatus();
        populateOptions();
        initializeSelect2();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('inDate').value = today;
        document.getElementById('exDate').value = today;
        document.getElementById('repFrom').value = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
        document.getElementById('repTo').value = today;
    });

    function updateOnlineStatus() {
        const statusDiv = document.getElementById('connection-status');
        if (navigator.onLine) {
            statusDiv.innerHTML = "🟢 ONLINE";
            statusDiv.className = "status-glow-online";
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
        if(pass === "Bunny") {
            userRole = 'ADMIN';
        } else if(pass === "gkvstaff") {
            userRole = 'STAFF';
        } else if(pass === "Guest") {
            userRole = 'GUEST';
        } else { 
            alert("මුරපදය වැරදියි!"); 
            return; 
        }
        showToast("🔄 පද්ධතියට ඇතුළු වෙමින්...");
        document.getElementById('login-overlay').innerHTML = `
            <div class="card" style="text-align:center; width: 280px; padding: 20px; background: linear-gradient(145deg, #1b5e20, #0a3d0e); border-radius: 15px; box-shadow: 0 8px 25px rgba(10, 61, 14, 0.4), inset 0 1px 0 rgba(255,255,255,0.1); position: relative; overflow: hidden;">
    <!-- Decorative corner accent -->
    <div style="position: absolute; top: -20px; right: -20px; width: 60px; height: 60px; background: var(--gold); transform: rotate(45deg); opacity: 0.2;"></div>
    
    <h2 style="color:white; margin-bottom: 8px; font-size: 20px; position: relative; z-index: 1;">මූල්‍ය කළමනාකරණ පද්ධතිය</h2>
    <p style="color: #dcedc8; margin-bottom: 15px; font-size: 12px; position: relative; z-index: 1;">මො/ගම්පංගුව කනිෂ්ඨ විද්‍යාලය</p>
    
    <div style="margin: 15px 0; position: relative; z-index: 1;">
        <div style="display: inline-block; padding: 10px; background: rgba(255, 235, 59, 0.1); border-radius: 50%; border: 2px solid rgba(255, 235, 59, 0.3);">
            <i class="fas fa-spinner fa-spin" style="color: var(--gold); font-size: 22px;"></i>
        </div>
    </div>
    
    <h3 style="color: white; font-size: 15px; margin-bottom: 5px; position: relative; z-index: 1; font-weight: 600;">දත්ත යාවත්කාලීන කරමින්...</h3>
    <p style="color: #a5d6a7; font-size: 10px; position: relative; z-index: 1;">කරුණාකර රැඳී සිටින්න</p>
</div>
        `;
        
        try {
            await fetchRemoteData();
            await fetchRemoteProjects();
            refreshDashboard();
            loadRecentTable();
            renderCodesList();
            updateProjectSelects();
            renderProjectList();
            updateOnlineStatus();
            applyPermissions();
            showToast("✅ පද්ධතියට සාර්ථකව ඇතුළු විය!");
            
        } catch (error) {
            console.error("දත්ත යාවත්කාලීන දෝෂය:", error);
            showToast("⚠️ දත්ත යාවත්කාලීන දෝෂයක්. නැවත උත්සාහ කරන්න.");
        }
        document.getElementById('login-overlay').style.display = 'none';
        showSec('dash');
        setTimeout(() => {
            initializeSelect2();
        }, 100);
        
        initialized = true;
    }

    function applyPermissions() {
    // Hide data entry sections for Guest
    if(userRole === 'GUEST') {
        document.querySelectorAll('.staff-only').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        
        // Hide print and PDF buttons for Guest users
        document.getElementById('print-btn').style.display = 'none';
        document.getElementById('pdf-btn').style.display = 'none';
        
        // Hide entry buttons in recent transactions table
        document.querySelectorAll('.table-btn').forEach(btn => btn.style.display = 'none');
        
        // Hide entry forms completely
        document.getElementById('sec-entry').style.display = 'none';
        
        // Remove entry tab from navigation
        const entryNav = document.getElementById('nav-entry');
        if(entryNav) {
            entryNav.style.display = 'none';
        }
        
        // Hide project management
        const projNav = document.getElementById('nav-proj');
        if(projNav) {
            projNav.style.display = 'none';
        }
    } 
    else if(userRole === 'ADMIN' || userRole === 'STAFF') {
        document.querySelectorAll('.staff-only').forEach(el => el.style.display = 'block');
        document.getElementById('print-btn').style.display = 'flex';
        document.getElementById('pdf-btn').style.display = 'flex';
        
        // Show entry buttons for staff and admin
        document.querySelectorAll('.table-btn').forEach(btn => btn.style.display = 'inline-flex');
        
        // Show entry tab in navigation
        const entryNav = document.getElementById('nav-entry');
        if(entryNav) {
            entryNav.style.display = 'block';
        }
        
        // Show project management tab
        const projNav = document.getElementById('nav-proj');
        if(projNav) {
            projNav.style.display = 'block';
        }
    }
    
    if(userRole === 'ADMIN') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    }
}
    function initializeSelect2() {
        $('#inCodeSelect, #exCodeSelect, #exSourceSelect, #opCodeSelect, #allocCodeSelect').select2({
            placeholder: "තෝරන්න...",
            allowClear: true,
            width: '100%'
        }).on('select2:open', function() {
            $(this).data('select2').$dropdown.find(':input.select2-search__field').focus();
        });
    }

    async function manualRefresh() { 
        if (isLoading) return;
        
        toggleLoading(true);
        isLoading = true;
        
        try {
            await fetchRemoteData(); 
            await fetchRemoteProjects(); 
            refreshDashboard();
            loadRecentTable();
            showToast("✅ දත්ත අලුත් කරන ලදී!"); 
        } catch (error) {
            console.error("Manual refresh error:", error);
            showToast("⚠️ දත්ත අලුත් කිරීමේ දෝෂයක්");
        } finally {
            toggleLoading(false);
            isLoading = false;
        }
    }

    function editTransaction(id) {
		 if(userRole === 'GUEST') {
        showToast("❌ ගනුදෙනු සංස්කරණය කිරීමට ඔබට අවසර නැත.");
        return;
    }
    
        const db = getData();
        const entry = db.find(r => r.id === id);
        if(!entry) return;

        showSec('entry');

        if(entry.type === 'IN') {
            document.getElementById('edit-id-in').value = entry.id;
            document.getElementById('inDate').value = entry.date.split('T')[0];
            document.getElementById('inRef').value = entry.ref;
            $('#inCodeSelect').val(entry.code).trigger('change');
            document.getElementById('inAmt').value = entry.amt.toFixed(2);
            $('#inProjSelect').val(entry.proj).trigger('change');
            document.getElementById('inDesc').value = entry.desc;
            document.getElementById('btn-save-in').innerText = "යාවත්කාලීන කරන්න (Update)";
            document.getElementById('edit-id-ex').value = '';
        } else {
            document.getElementById('edit-id-ex').value = entry.id;
            document.getElementById('exDate').value = entry.date.split('T')[0];
            document.getElementById('exVoucher').value = entry.vouch;
            document.getElementById('exRef').value = entry.ref;
            document.getElementById('exAmt').value = entry.amt.toFixed(2);
            $('#exCodeSelect').val(entry.code).trigger('change');
            $('#exSourceSelect').val(entry.source).trigger('change');
            $('#exProjSelect').val(entry.proj).trigger('change');
            document.getElementById('exDesc').value = entry.desc;
            document.getElementById('btn-save-ex').innerText = "යාවත්කාලීන කරන්න (Update)";
            document.getElementById('edit-id-in').value = '';
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function fetchRemoteData() {
        try {
            const response = await fetch(SCRIPT_URL + "?action=read&t=" + Date.now());
            const remoteData = await response.json();
            
            // Store fetched data in localStorage as cache
            sessionStorage.setItem('sch_db', JSON.stringify(remoteData));
            return remoteData;
        } catch (e) {
            console.error("Remote data fetch error:", e);
            // If remote fetch fails, use cached data from localStorage
            return JSON.parse(sessionStorage.getItem('sch_db') || '[]');
        }
    }

    async function fetchRemoteProjects() {
        try {
            const response = await fetch(SCRIPT_URL + "?action=read_projects&t=" + Date.now());
            const projects = await response.json();
            sessionStorage.setItem('sch_projs', JSON.stringify(projects));
        } catch (e) {
            console.error("Remote projects fetch error:", e);
            // Use cached projects if available
        }
    }

    function toggleLoading(show) {
        if (show) {
            document.getElementById('loading-overlay').style.display = 'flex';
        } else {
            document.getElementById('loading-overlay').style.display = 'none';
        }
    }

    function getData() { 
        // Always get from localStorage (which is now our cache of Google Sheets data)
        return JSON.parse(sessionStorage.getItem('sch_db') || '[]'); 
    }
    
    function getProjects() { 
        return JSON.parse(sessionStorage.getItem('sch_projs') || '[]'); 
    }
    function populateOptions() {
        const sCodeOptions = S_CODES.map(c => `<option value="${c}">${c} - ${CODE_INFO[c]}</option>`).join('');
        const exCodeOptions = EX_CODES.map(c => `<option value="${c}">${c} - ${CODE_INFO[c]}</option>`).join('');
        ['inCodeSelect', 'exSourceSelect', 'opCodeSelect'].forEach(sId => {
            const el = document.getElementById(sId);
            if(el) {
                el.innerHTML = `<option value=""></option>` + sCodeOptions;
            }
        });
        ['exCodeSelect', 'allocCodeSelect'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                el.innerHTML = `<option value=""></option>` + exCodeOptions;
            }
        });
        const repFilter = document.getElementById('repFilter');
        if (repFilter) {
            repFilter.innerHTML = '<option value="ALL">සියලුම කේතයන්</option>' + 
                                  sCodeOptions + exCodeOptions;
        }
    }

    function renderCodesList() {
        document.getElementById('codes-s').innerHTML = S_CODES.map(c => 
            `<div class="code-tag"><span class="code-num">${c}</span>${CODE_INFO[c]}</div>`
        ).join('');
        
        document.getElementById('codes-ex').innerHTML = EX_CODES.map(c => 
            `<div class="code-tag"><span class="code-num" style="background:var(--danger); color:white;">${c}</span>${CODE_INFO[c]}</div>`
        ).join('');
    }

    function validateForm(type) {
        const prefix = type === 'IN' ? 'in' : 'ex';
        const date = document.getElementById(prefix + 'Date').value;
        const amt = document.getElementById(prefix + 'Amt').value;
        const code = $(`#${prefix}CodeSelect`).val();
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
            $(`#${prefix}CodeSelect`).select2('open');
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
            const source = $('#exSourceSelect').val();
            
            if(!voucher.trim()) {
                showToast("⚠️ කරුණාකර වවුචර් අංකය ඇතුළත් කරන්න");
                document.getElementById('exVoucher').focus();
                return false;
            }
            if(!source || source === "") {
                showToast("⚠️ කරුණාකර මූලාශ්‍ර අරමුදල තෝරන්න");
                $('#exSourceSelect').select2('open');
                return false;
            }
        }
        
        return true;
    }

    async function saveData(type) {
        // Check if user is Guest
        if(userRole === 'GUEST') {
            showToast("❌ ගනුදෙනු ඇතුළත් කිරීමට ඔබට අවසර නැත.");
            return;
        }
        
        if(!validateForm(type)) return;
        
        const prefix = type === 'IN' ? 'in' : 'ex';
        const existingId = document.getElementById('edit-id-' + prefix).value;
        const isEdit = existingId && existingId !== '';
        const currentId = isEdit ? parseInt(existingId) : (Date.now() + Math.floor(Math.random()*1000));
        
        const action = isEdit ? 'update_transaction' : 'save_transaction';
        
        const data = { 
            action: action,
            id: currentId,
            date: document.getElementById(prefix + 'Date').value, 
            ref: document.getElementById(prefix + 'Ref').value, 
            vouch: type === 'EX' ? document.getElementById('exVoucher').value : '', 
            code: $(`#${prefix}CodeSelect`).val(), 
            amt: parseAmount(document.getElementById(prefix + 'Amt')?.value || 0), 
            desc: document.getElementById(prefix + 'Desc').value, 
            type: type, 
            source: type === 'EX' ? $('#exSourceSelect').val() : $('#inCodeSelect').val(),
            proj: $(`#${prefix}ProjSelect`).val(),
            status: true,
            isOp: false
        };
        
        toggleLoading(true);
        
        try {
            // First try to save to Google Sheets
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                // Successfully saved to Google Sheets, now update local cache
                let db = getData();
                
                if (isEdit) {
                    const existingIndex = db.findIndex(item => item.id === currentId);
                    if (existingIndex !== -1) {
                        db[existingIndex] = data;
                    }
                } else {
                    db.push(data);
                }
                
                sessionStorage.setItem('sch_db', JSON.stringify(db));
                showToast(isEdit ? "✅ ගනුදෙනුව සාර්ථකව යාවත්කාලීන කරන ලදී!" : "✅ නව ගනුදෙනුව සාර්ථකව ගිණුම්ගත කරන ලදී!");
            } else {
                throw new Error(result.message || 'Save failed');
            }
        } catch (error) {
            console.error("Save error:", error);
            
            if (navigator.onLine) {
                // Online but server error - show error
                showToast("❌ දත්ත පරික්ෂා කර බලා නැවත උත්සාහ කරන්න.");
            } else {
                // Offline mode - store in localStorage temporarily
                let db = getData();
                
                if (isEdit) {
                    const existingIndex = db.findIndex(item => item.id === currentId);
                    if (existingIndex !== -1) {
                        db[existingIndex] = { ...data, offline: true };
                    }
                } else {
                    db.push({ ...data, offline: true });
                }
                
                sessionStorage.setItem('sch_db', JSON.stringify(db));
                showToast("⚠️ දත්ත පරිගණකය තුළ ගබඩා කරන ලදී! අන්තර්ජාලයට සම්බන්ධ වූ විට සමමුහුර්ත වේ.");
            }
        } finally {
            toggleLoading(false);
        }
        
        refreshDashboard();
        loadRecentTable();
        resetForms();
        document.getElementById('btn-save-' + prefix).innerText = 
            type === 'IN' ? "ලැබීම ගිණුම්ගත කරන්න" : "ගෙවීම ගිණුම්ගත කරන්න";
    }

    async function saveOpening() {
        // Check if user is Guest
        if(userRole === 'GUEST') {
            showToast("❌ ආරම්භක ශේෂයන් වෙනස් කිරීමට ඔබට අවසර නැත.");
            return;
        }
        
        const code = $('#opCodeSelect').val();
        const amt = parseAmount(document.getElementById('opAmt').value || 0);
        
        if(!code || code === "") {
            showToast("⚠️ කරුණාකර අරමුදල් කේතය තෝරන්න");
            $('#opCodeSelect').select2('open');
            return;
        }
        
        if(amt <= 0) {
            showToast("⚠️ මුදල ඇතුළත් කරන්න");
            document.getElementById('opAmt').focus();
            return;
        }
        
        toggleLoading(true);
        
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
            status: true
        };
        
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                // Update local cache
                let db = getData();
                db.push(data);
                sessionStorage.setItem('sch_db', JSON.stringify(db));
                showToast("✅ ආරම්භක ශේෂය ගිණුම්ගත කෙරිණි!");
            } else {
                throw new Error(result.message || 'Save failed');
            }
        } catch (error) {
            console.error("Opening save error:", error);
            showToast("❌ දත්ත සුරැකීමේ දෝෂයක්!");
        } finally {
            toggleLoading(false);
        }
        
        refreshDashboard();
        document.getElementById('opAmt').value = '';
    }

    async function saveAllocation() {
        // Check if user is Guest
        if(userRole === 'GUEST') {
            showToast("❌ ප්‍රතිපාදන ගිණුම්ගත කිරීමට ඔබට අවසර නැත.");
            return;
        }
        
        const code = $('#allocCodeSelect').val();
        const amt = parseAmount(document.getElementById('allocAmt').value || 0);
        
        if(!code || code === "") {
            showToast("⚠️ කරුණාකර ගෙවීම් කේතය තෝරන්න");
            $('#allocCodeSelect').select2('open');
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
            
            const result = await response.json();
            
            if (result.status === 'success') {
                allocations[code] = amt; 
                sessionStorage.setItem('sch_allocations', JSON.stringify(allocations));
                showToast("✅ ප්‍රතිපාදන ගිණුම්ගත කරන ලදී!");
            } else {
                throw new Error(result.message || 'Save failed');
            }
        } catch (error) {
            console.error("Allocation save error:", error);
            showToast("❌ ප්‍රතිපාදන සුරැකීමේ දෝෂයක්!");
        } finally {
            toggleLoading(false);
            document.getElementById('allocAmt').value = '';
        }
    }

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
    
    let incomeTransactions = [];
    let sourceCodesUsed = {};
    let expenseCodesUsed = {};
    
    let openingBalance = 0;
    let openingTransactions = [];
    
    if (type === 'IN') {
        openingTransactions = db.filter(r => r.isOp && (r.code === code || r.source === code));
        openingBalance = openingTransactions.reduce((sum, r) => sum + r.amt, 0);
    }
    
    const currentIncomeTransactions = db.filter(r => {
        if (type === 'IN') {
            return !r.isOp && 
                   r.type === 'IN' && 
                   (r.code === code || r.source === code) && 
                   (!from || r.date >= from) && 
                   (!to || r.date <= to);
        } else {
            return r.code === code && 
                   r.type === 'IN' && 
                   (!from || r.date >= from) && 
                   (!to || r.date <= to);
        }
    });
    
    const expenseTransactions = db.filter(r => {
        if (type === 'EX') {
            return r.code === code && 
                   r.type === 'EX' && 
                   (!from || r.date >= from) && 
                   (!to || r.date <= to);
        } else {
            return r.source === code && 
                   r.type === 'EX' && 
                   (!from || r.date >= from) && 
                   (!to || r.date <= to);
        }
    });
    
    const currentIncomeTotal = currentIncomeTransactions.reduce((sum, t) => sum + t.amt, 0);
    const totalIncome = openingBalance + currentIncomeTotal;
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amt, 0);
    const balance = totalIncome - totalExpense;
    
    if (type === 'EX') {
        expenseTransactions.forEach(tr => {
            if (tr.source && CODE_INFO[tr.source]) {
                if (!sourceCodesUsed[tr.source]) {
                    sourceCodesUsed[tr.source] = {
                        code: tr.source,
                        name: CODE_INFO[tr.source],
                        total: 0,
                        transactions: []
                    };
                }
                sourceCodesUsed[tr.source].total += tr.amt;
                sourceCodesUsed[tr.source].transactions.push(tr);
            }
        });
    }
    
    if (type === 'IN') {
        expenseTransactions.forEach(tr => {
            if (tr.code && CODE_INFO[tr.code]) {
                if (!expenseCodesUsed[tr.code]) {
                    expenseCodesUsed[tr.code] = {
                        code: tr.code,
                        name: CODE_INFO[tr.code],
                        total: 0,
                        transactions: []
                    };
                }
                expenseCodesUsed[tr.code].total += tr.amt;
                expenseCodesUsed[tr.code].transactions.push(tr);
            }
        });
        
        incomeTransactions = [...openingTransactions, ...currentIncomeTransactions];
    }
    
    document.getElementById('modalCodeTitle').innerHTML = 
    '<span style="font-size: 15px; font-weight: bold;">' + 
    code + ' - ' + CODE_INFO[code] + 
    ' <span style="font-size: 10px; color: #666;">(' + (type === 'IN' ? 'ලැබීම්' : 'ගෙවීම්') + ')</span>' + 
    '</span>';
    
    let html = '<div style="margin-bottom: 20px;">';
    html += '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">';
    html += '<div style="background: #d4edda; padding: 12px; border-radius: 8px; text-align: center;">';
    html += '<div style="font-size: 12px; color: #155724;">මුළු ලැබීම්</div>';
    html += '<div style="font-size: 20px; font-weight: bold; color: green;">' + totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2}) + '</div>';
    html += '</div>';
    html += '<div style="background: #f8d7da; padding: 12px; border-radius: 8px; text-align: center;">';
    html += '<div style="font-size: 12px; color: #721c24;">මුළු ගෙවීම්</div>';
    html += '<div style="font-size: 20px; font-weight: bold; color: red;">' + totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2}) + '</div>';
    html += '</div>';
    html += '<div style="background: #d1ecf1; padding: 12px; border-radius: 8px; text-align: center;">';
    html += '<div style="font-size: 12px; color: #0c5460;">ශේෂය</div>';
    html += '<div style="font-size: 20px; font-weight: bold; color: ' + (balance >= 0 ? 'blue' : 'orange') + ';">' + balance.toLocaleString(undefined, {minimumFractionDigits: 2}) + '</div>';
    html += '</div>';
    html += '</div>';
    
    if (type === 'EX' && Object.keys(sourceCodesUsed).length > 0) {
        html += '<h4 style="color: var(--primary); border-bottom: 1px solid var(--primary); padding-bottom: 3px; margin-top: 15px; font-size: 14px;">';
        html += '<span style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 3px; margin-right: 8px; font-size: 6px;">💰</span>';
        html += 'වියදම් දරා ඇති ලැබීම් කේත (S Codes)';
        html += '</h4>';
        html += '<table style="width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 15px; font-size: 12px;">';
        html += '<thead><tr style="background: #e8f5e9;">';
        html += '<th style="padding: 6px; border: 1px solid #ddd; text-align: left; font-size: 11px;">ලැබීම් කේතය</th>';
        html += '<th style="padding: 6px; border: 1px solid #ddd; text-align: left; font-size: 11px;">විස්තරය</th>';
        html += '<th style="padding: 6px; border: 1px solid #ddd; text-align: right; font-size: 11px;">මුළු වියදම (රු.)</th>';
        html += '<th style="padding: 6px; border: 1px solid #ddd; text-align: center; font-size: 11px;">ගනුදෙනු</th>';
        html += '</tr></thead><tbody>';
        
        const sortedSourceCodes = Object.values(sourceCodesUsed).sort((a, b) => {
            return S_CODES.indexOf(a.code) - S_CODES.indexOf(b.code);
        });
        
        sortedSourceCodes.forEach(source => {
            html += '<tr style="border-bottom: 1px solid #eee;">';
            html += '<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #2e7d32;">' + source.code + '</td>';
            html += '<td style="padding: 8px; border: 1px solid #ddd;">' + source.name + '</td>';
            html += '<td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #c62828;">';
            html += source.total.toLocaleString(undefined, {minimumFractionDigits: 2});
            html += '</td>';
            html += '<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">';
            html += '<span style="background: #6c757d; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">';
            html += source.transactions.length;
            html += '</span></td></tr>';
        });
        
        html += '</tbody><tfoot>';
        html += '<tr style="background: #d4edda; font-weight: bold;">';
        html += '<td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: right;">මුළු වියදම:</td>';
        html += '<td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #c62828; font-size: 1px;">';
        html += Object.values(sourceCodesUsed).reduce((sum, s) => sum + s.total, 0).toLocaleString(undefined, {minimumFractionDigits: 2});
        html += '</td>';
        html += '<td style="padding: 10px; border: 1px solid #ddd; text-align: center;">';
        html += expenseTransactions.length;
        html += '</td></tr></tfoot></table>';
    }
    
    if (type === 'IN' && Object.keys(expenseCodesUsed).length > 0) {
        html += '<h4 style="color: var(--primary); border-bottom: 1px solid var(--primary); padding-bottom: 3px; margin-top: 15px;font-size: 14px;">';
        html += '<span style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 3px; margin-right: 8px;font-size: 12px;">💸</span>';
        html += 'මෙම ලැබීම් කේතයෙන් ගෙවා ඇති වියදම් කේත (EX Codes)';
        html += '</h4>';
        html += '<table style="width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 15px;font-size: 12px;">';
        html += '<thead><tr style="background: #fdeaea;">';
        html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;font-size: 11px;">ගෙවීම් කේතය</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;font-size: 11px;">විස්තරය</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: right;font-size: 11px;">මුළු වියදම (රු.)</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: center;font-size: 11px;">ගනුදෙනු</th>';
        html += '</tr></thead><tbody>';
        
        const sortedExpenseCodes = Object.values(expenseCodesUsed).sort((a, b) => {
            return EX_CODES.indexOf(a.code) - EX_CODES.indexOf(b.code);
        });
        
        sortedExpenseCodes.forEach(expCode => {
            html += '<tr style="border-bottom: 1px solid #eee;">';
            html += '<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #b71c1c;">' + expCode.code + '</td>';
            html += '<td style="padding: 8px; border: 1px solid #ddd;">' + expCode.name + '</td>';
            html += '<td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #c62828;">';
            html += expCode.total.toLocaleString(undefined, {minimumFractionDigits: 2});
            html += '</td>';
            html += '<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">';
            html += '<span style="background: #6c757d; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">';
            html += expCode.transactions.length;
            html += '</span></td></tr>';
        });
        
        html += '</tbody><tfoot>';
        html += '<tr style="background: #f5c6cb; font-weight: bold;">';
        html += '<td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: right;">මුළු වියදම:</td>';
        html += '<td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #c62828; font-size: 16px;">';
        html += Object.values(expenseCodesUsed).reduce((sum, e) => sum + e.total, 0).toLocaleString(undefined, {minimumFractionDigits: 2});
        html += '</td>';
        html += '<td style="padding: 10px; border: 1px solid #ddd; text-align: center;">';
        html += expenseTransactions.length;
        html += '</td></tr></tfoot></table>';
    }
    
    if (type === 'IN') {
        html += '<h4 style="font-size: 13px;color: green; border-bottom: 2px solid #28a745; padding-bottom: 5px; margin-top: 20px;">';
        html += '<span style="background: #28a745; color: white; padding: 3px 8px; border-radius: 4px; margin-right: 10px;">✔</span>';
        html += 'ලැබීම් ගනුදෙනු';
        html += '</h4>';
        
        if (incomeTransactions.length === 0) {
            html += '<p style="text-align: center; color: #666; padding: 20px; background: #f8f9fa; border-radius: 8px;">ලැබීම් ගනුදෙනු කිසිවක් නැත</p>';
        } else {
            html += '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
            html += '<thead><tr style="background: #d4edda;">';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">දිනය</th>';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">විස්තරය</th>';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">ලදුපත් අංකය</th>';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">ව්‍යාපෘතිය</th>';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: right;">මුදල (රු.)</th>';
            html += '</tr></thead><tbody>';
            
            incomeTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(tr => {
                html += '<tr style="border-bottom: 1px solid #eee;">';
                html += '<td style="padding: 8px; border: 1px solid #ddd;">' + tr.date + '</td>';
                html += '<td style="padding: 8px; border: 1px solid #ddd;">' + tr.desc + '</td>';
                html += '<td style="padding: 8px; border: 1px solid #ddd;">' + (tr.ref || '-') + '</td>';
                html += '<td style="padding: 8px; border: 1px solid #ddd;">' + (tr.proj || '-') + '</td>';
                html += '<td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: green;">' + tr.amt.toLocaleString(undefined, {minimumFractionDigits: 2}) + '</td>';
                html += '</tr>';
            });
            
            html += '</tbody><tfoot>';
            html += '<tr style="background: #c3e6cb; font-weight: bold;">';
            html += '<td colspan="4" style="padding: 10px; border: 1px solid #ddd; text-align: right;">ලැබීම් මුළු එකතුව:</td>';
            html += '<td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">' + totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2}) + '</td>';
            html += '</tr></tfoot></table>';
        }
    }
    
    if (type === 'EX') {
        html += '<h4 style="font-size: 13px;color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 5px; margin-top: 20px;">';
        html += '<span style="background: #dc3545; color: white; padding: 3px 8px; border-radius: 4px; margin-right: 10px;">✗</span>';
        html += 'ගෙවීම් ගනුදෙනු';
        html += '</h4>';
        
        if (expenseTransactions.length === 0) {
            html += '<p style="text-align: center; color: #666; padding: 20px; background: #f8f9fa; border-radius: 8px;">ගෙවීම් ගනුදෙනු කිසිවක් නැත</p>';
        } else {
            html += '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
            html += '<thead><tr style="background: #f8d7da;">';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">දිනය</th>';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">විස්තරය</th>';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">වවුචර් අංකය</th>';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">ව්‍යාපෘතිය</th>';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: left;">මූලාශ්‍ර (S Code)</th>';
            html += '<th style="padding: 10px; border: 1px solid #ddd; text-align: right;">මුදල (රු.)</th>';
            html += '</tr></thead><tbody>';
            
            expenseTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(tr => {
                html += '<tr style="border-bottom: 1px solid #eee;">';
                html += '<td style="padding: 8px; border: 1px solid #ddd;">' + tr.date + '</td>';
                html += '<td style="padding: 8px; border: 1px solid #ddd;">' + tr.desc + '</td>';
                html += '<td style="padding: 8px; border: 1px solid #ddd;">' + (tr.vouch || tr.ref || '-') + '</td>';
                html += '<td style="padding: 8px; border: 1px solid #ddd;">' + (tr.proj || '-') + '</td>';
                html += '<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #2e7d32;">';
                html += (tr.source || '-');
                if (tr.source && CODE_INFO[tr.source]) {
                    html += '<br><small style="color: #666;">' + CODE_INFO[tr.source] + '</small>';
                }
                html += '</td>';
                html += '<td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: red;">' + tr.amt.toLocaleString(undefined, {minimumFractionDigits: 2}) + '</td>';
                html += '</tr>';
            });
            
            html += '</tbody><tfoot>';
            html += '<tr style="background: #f5c6cb; font-weight: bold;">';
            html += '<td colspan="5" style="padding: 10px; border: 1px solid #ddd; text-align: right;">ගෙවීම් මුළු එකතුව:</td>';
            html += '<td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: red;">' + totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2}) + '</td>';
            html += '</tr></tfoot></table>';
        }
    }
    
    html += '<div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin-top: 30px; border-left: 5px solid #17a2b8;">';
    html += '<div style="display: flex; justify-content: space-between; align-items: center;">';
    html += '<div>';
    html += '<div style="font-size: 14px; color: #0c5460;">කේතය: <strong>' + code + '</strong></div>';
    html += '<div style="font-size: 14px; color: #0c5460; margin-top: 5px;">' + CODE_INFO[code] + '</div>';
    html += '</div>';
    html += '<div style="text-align: right;">';
    html += '<div style="font-size: 18px; font-weight: bold; color: ' + (balance >= 0 ? 'blue' : 'orange') + ';">';
    html += 'අවසාන ශේෂය: ' + balance.toLocaleString(undefined, {minimumFractionDigits: 2});
    html += '</div>';
    html += '<div style="font-size: 12px; color: #666; margin-top: 5px;">';
    html += '(ලැබීම් ' + totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2}) + ' - ගෙවීම් ' + totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2}) + ')';
    html += '</div>';
    html += '</div></div></div></div>';
    
    document.getElementById('codeDetailsContent').innerHTML = html;
    document.getElementById('codeDetailsModal').style.display = 'flex';
}
    function closeCodeDetails() {
        document.getElementById('codeDetailsModal').style.display = 'none';}

    function generateReport() {
        const db = getData();
        const from = document.getElementById('repFrom').value;
        const to = document.getElementById('repTo').value;
        const selectedCode = document.getElementById('repFilter').value; 
        let html = '';
        
        let filtered = db.filter(r => !r.isOp && (!from || r.date >= from) && (!to || r.date <= to));

        if (currentReport === 'CASHBOOK') {
           document.getElementById('report-header-title').innerText = "මුදල් පොත";
		   document.getElementById('report-header-title').style.fontSize = "24px";
		   document.getElementById('report-header-title').style.fontWeight = "bold";
		   document.getElementById('report-header-title').style.color = "#0984e3"; // නිල් වර්ණය
            let bal = db.filter(r => r.isOp).reduce((a, c) => a + c.amt, 0);
            
            if (from) { 
                db.filter(r => !r.isOp && r.date < from).forEach(r => bal += (r.type === 'IN' ? r.amt : -r.amt)); 
            }

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
        else if (currentReport === 'IN' || currentReport === 'EX') {
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
                <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">ආරම්භක ශේෂය (රු.)</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">ගනුදෙනු ගණන</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">මුළු ${currentReport === 'IN' ? 'ලැබීම්' : 'ගෙවීම්'} (රු.)</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">මුළු එකතුව (රු.)</th>
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
        
        // For expenses, opening balance is not applicable, but we show it as 0
        const effectiveOpeningAmt = currentReport === 'IN' ? openingAmt : 0;
        const grandTotalForCode = currentReport === 'IN' ? (effectiveOpeningAmt + codeTotal) : codeTotal;
        
        grandTotal += grandTotalForCode;
        totalTransactions += transactionCount;
        totalOpening += effectiveOpeningAmt;
        
        html += `
        <tr style="border-bottom: 1px solid #eee; ${transactionCount > 0 ? 'background: #f9f9f9;' : ''}">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: var(--primary);">${code}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${CODE_INFO[code]}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #006400; font-weight: bold;">
                ${effectiveOpeningAmt > 0 ? effectiveOpeningAmt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
            </td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                <span style="display: inline-block; background: ${transactionCount > 0 ? (currentReport === 'IN' ? '#28a745' : '#dc3545') : '#6c757d'}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">
                    ${transactionCount}
                </span>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: ${currentReport === 'IN' ? 'green' : 'red'};">${codeTotal > 0 ? codeTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #1b5e20; background: #e8f5e9;">
                ${grandTotalForCode > 0 ? grandTotalForCode.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
            </td>
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
    
    html += `
        </tbody>
        <tfoot>
            <tr style="background: ${currentReport === 'IN' ? '#d4edda' : '#f8d7da'}; font-weight: bold;">
                <td colspan="2" style="padding: 12px; border: 1px solid #ddd; text-align: right;">මුළු එකතුව:</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right; color: #006400;">
                    ${totalOpening > 0 ? totalOpening.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
                </td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                    <span style="display: inline-block; background: #343a40; color: white; padding: 4px 10px; border-radius: 12px;">
                        ${totalTransactions}
                    </span>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right; color: ${currentReport === 'IN' ? 'green' : 'red'};">
                    ${(grandTotal - totalOpening) > 0 ? (grandTotal - totalOpening).toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
                </td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right; color: #1b5e20; font-size: 18px; background: #c8e6c9;">
                    ${grandTotal > 0 ? grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}
                </td>
                <td style="padding: 12px; border: 1px solid #ddd;"></td>
            </tr>
        </tfoot>
    </table>`;
            
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
        </div>`;

    // Show status update section only for ADMIN and STAFF
    if(userRole === 'ADMIN' || userRole === 'STAFF') {
        html += `
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
    else {
        // For GUEST users, show read-only version
        html += `
        <div style="margin-top:40px;">
            <hr>
            <h4>චෙක්පත් සහ ලැබීම් තත්ත්වය</h4>
            <p style="font-size: 0.9em; color: #666;">(පෙන්වනු ලබන්නේ පෙරදසුනක් ලෙස පමණි - යාවත්කාලීන කිරීමට අවසර නැත)</p>
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
                    <span class="status-badge ${status === 'Cleared' ? 'status-cleared' : 'status-pending'}" style="padding: 3px 8px; border-radius: 4px;">
                        ${status}
                    </span>
                </td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
    }
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
    // Check user permissions
    if(userRole === 'GUEST') {
        showToast("❌ චෙක්පත් තත්ත්වය වෙනස් කිරීමට ඔබට අවසර නැත.");
        return;
    }
    
    clearedStatus[id] = val;
    sessionStorage.setItem('sch_cleared', JSON.stringify(clearedStatus));
    generateReport();
    showToast("✅ චෙක්පත් තත්ත්වය යාවත්කාලීන කරන ලදී!");
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
                <div class="fund-box" style="background:${COLORS[i]}; position:relative;">
                    <span class="fund-index">${i+1}</span>
                    <div class="fund-code">
                        ${s}
                    </div>
                    <div class="fund-amount ${bal >= 0 ? 'positive' : 'negative'}">
                        ${balanceText}
                    </div>
                    <div class="fund-description">
                        ${CODE_INFO[s]}
                    </div>
                </div>`;
        });
        
        document.getElementById('dash-funds').innerHTML = fundHtml;
    }

async function loadRecentTable() {
    const db = await getData();
    let html = '<table><tr><th>දිනය</th><th>විස්තරය</th><th>වවුචර්/ලදුපත්</th><th>මුදල (රු.)</th><th>Status</th><th>ක්‍රියා</th></tr>';
    
    db.sort((a,b) => b.id - a.id).slice(0,5).forEach(r => {
        const syncStatus = r.offline ? '<span class="sync-pending">⏳ Offline</span>' : '<span class="sync-done">✅ Online</span>';
        
        let actions = [];
        // Only show actions for ADMIN and STAFF
        if(userRole === 'ADMIN' || userRole === 'STAFF') {
            actions.push(`<button onclick="editTransaction(${r.id})" class="table-btn" style="background:var(--deep-blue); color:white;">Edit</button>`);
            
            if(userRole === 'ADMIN') {
                actions.push(`<button onclick="deleteData(${r.id})" class="table-btn" style="background:var(--danger); color:white;">Delete</button>`);
            }
        }
        const actionHtml = actions.length > 0 ? actions.join(' ') : '<span style="color: #999; font-size: 12px;">-</span>';

        html += `<tr>
            <td>${r.date.split('T')[0]}</td>
            <td>${r.desc}</td>
            <td>${r.vouch || r.ref}</td>
            <td style="color:${r.type==='IN'?'green':'red'}"> ${r.amt > 0 ? r.amt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ' - '}</td>
            <td>${syncStatus}</td> 
            <td>${actionHtml}</td>
        </tr>`;
    });
    document.getElementById('recent-transactions-table').innerHTML = html + '</table>';
}

    async function saveProject() {
        // Check if user is Guest
        if(userRole === 'GUEST') {
            showToast("❌ ව්‍යාපෘති ඇතුළත් කිරීමට ඔබට අවසර නැත.");
            return;
        }
        
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
            updateProjectSelects();
            renderProjectList();
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
        // Check if user is Guest
        if(userRole === 'GUEST') {
            showToast("❌ දත්ත මැකීමට ඔබට අවසර නැත.");
            return;
        }
        
        if(userRole === 'STAFF') {
            showToast("❌ මැකීමට පරිපාලක අවසරය අවශ්‍යයි.");
            return;
        }
        
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
            let localDB = JSON.parse(sessionStorage.getItem('sch_db') || '[]');
            localDB = localDB.filter(item => item.id !== id);
            sessionStorage.setItem('sch_db', JSON.stringify(localDB));
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
        if(id === 'codes') renderCodesList();
    }

    function resetForms() {
        document.getElementById('edit-id-in').value = '';
        document.getElementById('edit-id-ex').value = '';
        ['inRef', 'inAmt', 'inDesc', 'exVoucher', 'exRef', 'exAmt', 'exDesc'].forEach(id => {
            if (document.getElementById(id)) {
                document.getElementById(id).value = '';
            }
        });
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('inDate').value = today; 
        document.getElementById('exDate').value = today;
        $('#inCodeSelect, #exCodeSelect, #exSourceSelect, #inProjSelect, #exProjSelect').val('').trigger('change');
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
    try {
        const db = getData(); // getData() ශ්‍රිතය භාවිතා කරන්න
        if (db.length === 0) {
            showToast("⚠️ බාගත කිරීමට දත්ත කිසිවක් නැත!");
            return;
        }
        let csvContent = "ID,දිනය,වර්ගය,කේතය,මූලාශ්‍ර,මුදල,විස්තරය,වවුචර්,ලදුපත්,ව්‍යාපෘතිය,Status\n";

        db.forEach(t => {
            const row = [
                t.id,
                t.date,
                t.type,
                t.code,
                t.source || '',
                t.amt,
                `"${t.desc.replace(/"/g, '""')}"`,
                t.vouch || '',
                t.ref || '',
                t.proj || '',
                t.offline ? 'Offline' : 'Online'
            ].join(",");
            csvContent += row + "\n";
        });

        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.setAttribute("href", url);
        link.setAttribute("download", `පාසල්_ගිණුම්_දත්ත_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast("✅ CSV දත්ත පිටපත බාගත කරන ලදී!");
    } catch (error) {
        console.error("CSV Download Error:", error);
        showToast("❌ දත්ත බාගත කිරීමේදී දෝෂයක් සිදු විය!");
    }
}
// Add to app.js
function initResponsiveFeatures() {
    // Mobile menu toggle
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.onclick = toggleMobileMenu;
    document.body.appendChild(mobileMenuBtn);
    
    // Touch device detection
    const isTouchDevice = ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0) || 
                         (navigator.msMaxTouchPoints > 0);
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
    
    // Window resize handling
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleResize();
        }, 250);
    });
    
    // Orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(refreshLayout, 100);
    });
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay') || 
                   createOverlay();
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = toggleMobileMenu;
    document.body.appendChild(overlay);
    return overlay;
}

function handleResize() {
    // Adjust layout based on screen size
    const width = window.innerWidth;
    
    if (width < 769) {
        // Mobile optimizations
        document.querySelectorAll('.fund-box').forEach(box => {
            box.style.minHeight = '100px';
        });
    }
    
    // Re-initialize any layout-dependent plugins
    if (typeof $ !== 'undefined' && $.fn.select2) {
        $('.select2').select2('destroy').select2();
    }
}

function refreshLayout() {
    // Refresh charts, tables, etc.
    refreshDashboard();
    generateReport();
}

// Initialize on load
$(document).ready(function() {
    initResponsiveFeatures();
    handleResize(); // Initial call
});
    function showToast(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.style.display = 'block';
        setTimeout(() => { t.style.display = 'none'; }, 6000);
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