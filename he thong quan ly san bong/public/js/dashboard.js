// Tải dữ liệu dashboard
async function loadDashboardData() {
    try {
        // Lấy dữ liệu từ các API
        const fields = await fetchAPI('/fields');
        const bookings = await fetchAPI('/bookings');
        
        // Tính toán số liệu thống kê
        const today = getCurrentDate();
        
        // Đặt sân hôm nay
        const todayBookings = bookings.filter(booking => booking.date === today);
        
        // Doanh thu hôm nay
        const todayRevenue = todayBookings.reduce((total, booking) => {
            return total + parseFloat(booking.price);
        }, 0);
        
        // Số sân trống
        const availableFields = fields.filter(field => field.status === 'available');
        
        // Tổng khách hàng (dựa trên số điện thoại duy nhất)
        const uniqueCustomers = new Set(bookings.map(booking => booking.customerPhone));
        
        // Cập nhật giao diện
        document.getElementById('today-bookings').textContent = todayBookings.length;
        document.getElementById('available-fields').textContent = availableFields.length;
        document.getElementById('today-revenue').textContent = formatCurrency(todayRevenue);
        document.getElementById('total-customers').textContent = uniqueCustomers.size;
        
        // Tải trạng thái sân bóng
        await loadFieldStatus(fields, bookings);
        
        // Tải đặt sân gần đây
        loadRecentBookings(bookings);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Tải trạng thái sân bóng
async function loadFieldStatus(fields, bookings) {
    const fieldStatusContainer = document.getElementById('field-status-container');
    if (!fieldStatusContainer) return;
    
    // Xóa dữ liệu cũ
    fieldStatusContainer.innerHTML = '';
    
    // Lấy ngày hiện tại
    const today = getCurrentDate();
    
    // Lọc các lượt đặt sân hôm nay
    const todayBookings = bookings.filter(booking => booking.date === today);
    
    // Kiểm tra từng sân
    fields.forEach(field => {
        const fieldItem = document.createElement('div');
        fieldItem.className = 'field-item';
        
        // Xác định trạng thái sân
        let status = field.status;
        let statusText = '';
        let statusClass = '';
        let timeInfo = '';
        
        if (status === 'maintenance') {
            statusText = 'Bảo trì';
            statusClass = 'maintenance';
            timeInfo = 'Không khả dụng';
        } else if (status === 'closed') {
            statusText = 'Đóng cửa';
            statusClass = 'maintenance';
            timeInfo = 'Không khả dụng';
        } else {
            // Nếu sân đang khả dụng, kiểm tra xem có đang được đặt không
            const currentBooking = findCurrentBooking(todayBookings, field.id);
            
            if (currentBooking) {
                status = 'booked';
                statusText = 'Đang sử dụng';
                statusClass = 'booked';
                timeInfo = `${currentBooking.startTime} - ${currentBooking.endTime}`;
            } else {
                // Tìm lượt đặt sân tiếp theo
                const nextBooking = findNextBooking(todayBookings, field.id);
                
                if (nextBooking) {
                    status = 'available';
                    statusText = 'Trống';
                    statusClass = 'available';
                    timeInfo = `Đặt tiếp theo: ${nextBooking.startTime}`;
                } else {
                    status = 'available';
                    statusText = 'Trống';
                    statusClass = 'available';
                    timeInfo = 'Cả ngày';
                }
            }
        }
        
        // Thêm class tương ứng với trạng thái
        fieldItem.classList.add(statusClass);
        
        // Hiển thị thông tin sân
        fieldItem.innerHTML = `
            <div class="field-name">${field.name}</div>
            <div class="field-time">${timeInfo}</div>
            <div class="field-status-badge status-${status}">${statusText}</div>
        `;
        
        fieldStatusContainer.appendChild(fieldItem);
    });
}

// Tìm lượt đặt sân hiện tại
function findCurrentBooking(bookings, fieldId) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    
    return bookings.find(booking => {
        return (
            booking.fieldId.toString() === fieldId.toString() &&
            booking.status === 'confirmed' &&
            booking.startTime <= currentTime &&
            booking.endTime > currentTime
        );
    });
}

// Tìm lượt đặt sân tiếp theo
function findNextBooking(bookings, fieldId) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    
    // Lọc các lượt đặt sân của sân này, chưa bắt đầu và sắp xếp theo thời gian bắt đầu
    const futureBookings = bookings
        .filter(booking => {
            return (
                booking.fieldId.toString() === fieldId.toString() &&
                booking.status === 'confirmed' &&
                booking.startTime > currentTime
            );
        })
        .sort((a, b) => {
            if (a.startTime < b.startTime) return -1;
            if (a.startTime > b.startTime) return 1;
            return 0;
        });
    
    return futureBookings.length > 0 ? futureBookings[0] : null;
}

// Hiển thị danh sách đặt sân gần đây
function loadRecentBookings(bookings) {
    const recentBookingsContainer = document.getElementById('recent-bookings');
    if (!recentBookingsContainer) return;
    
    // Xóa dữ liệu cũ
    recentBookingsContainer.innerHTML = '';
    
    // Sắp xếp theo ngày và thời gian gần đây nhất
    const sortedBookings = [...bookings].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateB - dateA; // Sắp xếp giảm dần
    });
    
    // Lấy 5 lượt đặt sân gần đây nhất
    const recentBookings = sortedBookings.slice(0, 5);
    
    if (recentBookings.length > 0) {
        // Hiển thị từng lượt đặt sân
        recentBookings.forEach(booking => {
            const item = document.createElement('div');
            item.className = 'recent-item';
            
            // Xác định class cho trạng thái
            let statusClass = '';
            let statusText = '';
            
            switch (booking.status) {
                case 'confirmed':
                    statusClass = 'status-booked';
                    statusText = 'Đã xác nhận';
                    break;
                case 'completed':
                    statusClass = 'status-available';
                    statusText = 'Hoàn thành';
                    break;
                case 'cancelled':
                    statusClass = 'status-maintenance';
                    statusText = 'Đã hủy';
                    break;
                default:
                    statusClass = '';
                    statusText = booking.status;
            }
            
            item.innerHTML = `
                <div class="recent-info">
                    <h4>${booking.customerName}</h4>
                    <div class="recent-meta">
                        ${formatDate(booking.date)} | ${booking.startTime} - ${booking.endTime} | ${formatCurrency(booking.price)}
                    </div>
                </div>
                <div class="recent-status">
                    <span class="field-status-badge ${statusClass}">${statusText}</span>
                </div>
            `;
            
            recentBookingsContainer.appendChild(item);
        });
    } else {
        recentBookingsContainer.innerHTML = '<div class="no-data">Không có đặt sân gần đây</div>';
    }
}