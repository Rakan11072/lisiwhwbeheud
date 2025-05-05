document.addEventListener('DOMContentLoaded', function() {
    const macForm = document.getElementById('macForm');
    const devicesList = document.getElementById('devicesList');
    const screenViewer = document.getElementById('screenViewer');
    
    let devices = JSON.parse(localStorage.getItem('macDevices')) || [];
    
    // عرض الأجهزة المحفوظة
    renderDevicesList();
    
    // معالجة إضافة عنوان MAC جديد
    macForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const deviceName = document.getElementById('deviceName').value;
        const macAddress = document.getElementById('macAddress').value;
        const screenUrl = document.getElementById('screenUrl').value;
        
        // التحقق من صحة عنوان MAC
        if (!isValidMacAddress(macAddress)) {
            alert('الرجاء إدخال عنوان MAC صحيح (مثال: 00:1A:2B:3C:4D:5E)');
            return;
        }
        
        // إضافة الجهاز إلى القائمة
        devices.push({
            id: Date.now(),
            name: deviceName,
            mac: macAddress,
            screenUrl: screenUrl
        });
        
        // حفظ في localStorage
        localStorage.setItem('macDevices', JSON.stringify(devices));
        
        // تحديث القائمة
        renderDevicesList();
        
        // تفريغ النموذج
        macForm.reset();
    });
    
    // عرض شاشة الجهاز عند النقر عليه
    devicesList.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-screen-btn')) {
            const deviceId = parseInt(e.target.dataset.id);
            const device = devices.find(d => d.id === deviceId);
            
            if (device && device.screenUrl) {
                screenViewer.innerHTML = `
                    <div class="w-100">
                        <h4>${device.name}</h4>
                        <p>${device.mac}</p>
                        <iframe src="${device.screenUrl}" class="device-screen w-100" height="500" frameborder="0"></iframe>
                    </div>
                `;
            } else {
                screenViewer.innerHTML = `
                    <div class="alert alert-warning">
                        لا يوجد رابط شاشة متاح لهذا الجهاز
                    </div>
                `;
            }
        }
        
        // حذف الجهاز
        if (e.target.classList.contains('delete-btn')) {
            const deviceId = parseInt(e.target.dataset.id);
            devices = devices.filter(d => d.id !== deviceId);
            localStorage.setItem('macDevices', JSON.stringify(devices));
            renderDevicesList();
            screenViewer.innerHTML = '<p class="text-muted">اختر جهازاً لعرض شاشته</p>';
        }
    });
    
    // دالة لعرض قائمة الأجهزة
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
    
    // دالة للتحقق من صحة عنوان MAC
    function isValidMacAddress(mac) {
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        return macRegex.test(mac);
    }
});
