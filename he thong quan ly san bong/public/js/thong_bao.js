// Chức năng hiển thị thông báo
function showNotification(type, message, duration = 3000) {
    const container = document.getElementById('notification-container');
    
    // Tạo phần tử thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Chọn biểu tượng dựa trên loại thông báo
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-bell"></i>';
    }
    
    // Thiết lập nội dung thông báo
    notification.innerHTML = `
        ${icon}
        <span class="notification-message">${message}</span>
        <span class="notification-close">&times;</span>
    `;
    
    // Thêm thông báo vào container
    container.appendChild(notification);
    
    // Xử lý nút đóng thông báo
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        container.removeChild(notification);
    });
    
    // Tự động đóng sau thời gian nhất định
    setTimeout(() => {
        if (notification.parentNode === container) {
            container.removeChild(notification);
        }
    }, duration);
}