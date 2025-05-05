document.addEventListener('DOMContentLoaded', function() {
    const macForm = document.getElementById('macForm');
    const devicesList = document.getElementById('devicesList');
    const screenViewer = document.getElementById('screenViewer');
    
    let devices = JSON.parse(localStorage.getItem('macDevices')) || [];
    
    renderDevicesList();
    
    macForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const deviceName = document.getElementById('deviceName').value;
        const macAddress = document.getElementById('macAddress').value;
        
        if (!isValidMacAddress(macAddress)) {
            alert('الرجاء إدخال عنوان MAC صحيح (مثال: 00:1A:2B:3C:4D:5E)');
            return;
        }
        
        // إنشاء رابط شاشة افتراضي بناءً على عنوان MAC
        const screenUrl = generateScreenUrl(macAddress);
        
        devices.push({
            id: Date.now(),
            name: deviceName,
            mac: macAddress,
            screenUrl: screenUrl
        });
        
        localStorage.setItem('macDevices', JSON.stringify(devices));
        renderDevicesList();
        macForm.reset();
    });
    
    devicesList.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-screen-btn')) {
            const deviceId = parseInt(e.target.dataset.id);
            const device = devices.find(d => d.id === deviceId);
            
            showDeviceScreen(device);
        }
        
        if (e.target.classList.contains('delete-btn')) {
            const deviceId = parseInt(e.target.dataset.id);
            devices = devices.filter(d => d.id !== deviceId);
            localStorage.setItem('macDevices', JSON.stringify(devices));
            renderDevicesList();
            screenViewer.innerHTML = '<p class="text-muted">اختر جهازاً لعرض شاشته</p>';
        }
    });
    
    function renderDevicesList() {
        if (devices.length === 0) {
            devicesList.innerHTML = '<p class="text-muted">لا توجد أجهزة مضافة</p>';
            return;
        }
        
        devicesList.innerHTML = devices.map(device => `
            <div class="list-group-item">
                <div>
                    <strong>${device.name}</strong><br>
                    <small class="text-muted">${device.mac}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-primary view-screen-btn" data-id="${device.id}">عرض الشاشة</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${device.id}">حذف</button>
                </div>
            </div>
        `).join('');
    }
    
    function isValidMacAddress(mac) {
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        return macRegex.test(mac);
    }
    
    function generateScreenUrl(macAddress) {
        // هذه دالة افتراضية لإنشاء رابط الشاشة
        // في الواقع الفعلي، ستحتاج إلى تكوين خاص بخادمك
        return `screen-viewer.html?mac=${encodeURIComponent(macAddress)}`;
    }
    
    function showDeviceScreen(device) {
        // محاكاة عرض شاشة الجهاز
        const mac = device.mac;
        const color = '#' + mac.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6);
        
        screenViewer.innerHTML = `
            <div class="w-100">
                <h4>${device.name}</h4>
                <p>عنوان MAC: ${mac}</p>
                <div class="device-screen" style="
                    width: 100%; 
                    height: 500px; 
                    background: linear-gradient(135deg, ${color} 0%, #000000 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-family: monospace;
                    border-radius: 8px;
                ">
                    <div class="text-center">
                        <h3>شاشة الجهاز</h3>
                        <p>${device.name}</p>
                        <p>${mac}</p>
                        <small>هذه محاكاة للشاشة بناءً على عنوان MAC</small>
                    </div>
                </div>
                <div class="mt-3">
                    <button class="btn btn-sm btn-secondary" onclick="refreshScreen('${mac}')">تحديث الشاشة</button>
                </div>
            </div>
        `;
    }
});

// دالة لتحديث الشاشة
function refreshScreen(mac) {
    alert(`جارٍ تحديث شاشة الجهاز بعنوان MAC: ${mac}`);
    // هنا يمكنك إضافة كود التحديث الفعلي
}
