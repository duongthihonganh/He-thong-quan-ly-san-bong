// Biến lưu trữ đối tượng biểu đồ
let revenueChart = null;

// Tải dữ liệu doanh thu
async function loadRevenueData() {
    try {
        // Lấy tháng được chọn để lọc
        const monthFilter = document.getElementById('month-filter');
        const filterMonth = monthFilter ? monthFilter.value : getCurrentMonth();
        const [year, month] = filterMonth.split('-');
        
        // Lấy tất cả các đặt sân
        const bookings = await fetchAPI('/bookings');
        
        // Lọc các đặt sân theo tháng và chỉ lấy các đặt sân đã hoàn thành hoặc xác nhận
        const monthlyBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return (
                bookingDate.getFullYear() === parseInt(year) &&
                bookingDate.getMonth() + 1 === parseInt(month) &&
                (booking.status === 'completed' || booking.status === 'confirmed')
            );
        });
        
        // Tính tổng doanh thu
        const totalRevenue = monthlyBookings.reduce((sum, booking) => sum + parseFloat(booking.price), 0);
        
        // Tính số ngày trong tháng
        const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
        
        // Tính doanh thu trung bình mỗi ngày
        const avgDailyRevenue = monthlyBookings.length > 0 ? totalRevenue / daysInMonth : 0;
        
        // Cập nhật giao diện
        document.getElementById('monthly-revenue').textContent = formatCurrency(totalRevenue);
        document.getElementById('avg-daily-revenue').textContent = formatCurrency(avgDailyRevenue);
        document.getElementById('booking-count').textContent = monthlyBookings.length;
        
        // Tạo bảng doanh thu theo ngày
        createRevenueTable(monthlyBookings, year, month);
        
        // Tạo biểu đồ doanh thu
        createRevenueChart(monthlyBookings, year, month);
        
    } catch (error) {
        console.error('Error loading revenue data:', error);
        showNotification('Lỗi khi tải dữ liệu doanh thu', 'error');
    }
}

// Tạo bảng doanh thu theo ngày
function createRevenueTable(bookings, year, month) {
    const revenueTable = document.querySelector('#revenue-table tbody');
    if (!revenueTable) return;
    
    // Xóa dữ liệu cũ
    revenueTable.innerHTML = '';
    
    // Tạo bản đồ doanh thu theo ngày
    const dailyRevenue = new Map();
    const dailyBookingCount = new Map();
    
    // Khởi tạo tất cả các ngày trong tháng
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dailyRevenue.set(dateStr, 0);
        dailyBookingCount.set(dateStr, 0);
    }
    
    // Tính toán doanh thu cho mỗi ngày
    bookings.forEach(booking => {
        const date = booking.date;
        const revenue = parseFloat(booking.price);
        
        dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + revenue);
        dailyBookingCount.set(date, (dailyBookingCount.get(date) || 0) + 1);
    });
    
    // Tạo mảng các ngày và sắp xếp theo thứ tự
    const days = Array.from(dailyRevenue.keys()).sort();
    
    // Hiển thị dữ liệu
    days.forEach(day => {
        const revenue = dailyRevenue.get(day);
        const bookingCount = dailyBookingCount.get(day);
        
        // Chỉ hiển thị ngày có doanh thu hoặc đặt sân
        if (revenue > 0 || bookingCount > 0) {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${formatDate(day)}</td>
                <td>${bookingCount}</td>
                <td>${formatCurrency(revenue)}</td>
            `;
            
            revenueTable.appendChild(row);
        }
    });
    
    // Nếu không có dữ liệu nào
    if (revenueTable.children.length === 0) {
        revenueTable.innerHTML = '<tr><td colspan="3" class="no-data">Không có dữ liệu doanh thu trong tháng này</td></tr>';
    }
}

// Tạo biểu đồ doanh thu
function createRevenueChart(bookings, year, month) {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) return;
    
    // Tạo bản đồ doanh thu theo ngày
    const dailyRevenue = new Map();
    
    // Khởi tạo tất cả các ngày trong tháng
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dailyRevenue.set(dateStr, 0);
    }
    
    // Tính toán doanh thu cho mỗi ngày
    bookings.forEach(booking => {
        const date = booking.date;
        const revenue = parseFloat(booking.price);
        dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + revenue);
    });
    
    // Tạo mảng các ngày và sắp xếp theo thứ tự
    const days = Array.from(dailyRevenue.keys()).sort();
    
    // Chuẩn bị dữ liệu cho biểu đồ
    const labels = days.map(day => formatDate(day));
    const data = days.map(day => dailyRevenue.get(day));
    
    // Nếu đã có biểu đồ, hủy nó để tạo mới
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    // Tạo biểu đồ mới
    revenueChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: data,
                backgroundColor: 'rgba(54, 162, 101, 0.7)',
                borderColor: 'rgba(54, 162, 101, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Lấy tháng hiện tại dưới dạng YYYY-MM
function getCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}