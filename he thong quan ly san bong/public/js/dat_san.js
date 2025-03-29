// Tải dữ liệu đặt sân
async function loadBookingsData() {
    const bookingsTable = document.querySelector('#bookings-table tbody');
    if (!bookingsTable) return;
    
    // Xóa dữ liệu cũ
    bookingsTable.innerHTML = '';
    
    try {
        // Lấy ngày được chọn để lọc
        const dateFilter = document.getElementById('date-filter');
        const filterDate = dateFilter ? dateFilter.value : getCurrentDate();
        
        // Gọi API lấy danh sách đặt sân
        let endpoint = '/bookings';
        if (filterDate) {
            endpoint += `?date=${filterDate}`;
        }
        
        const bookings = await fetchAPI(endpoint);
        
        // Tải danh sách sân để hiển thị tên
        const fields = await fetchAPI('/fields');
        
        if (bookings && bookings.length > 0) {
            // Hiển thị dữ liệu
            bookings.forEach(booking => {
                const row = document.createElement('tr');
                
                // Tìm tên sân từ ID
                let fieldName = 'Không xác định';
                const field = fields.find(f => f.id.toString() === booking.fieldId.toString());
                if (field) {
                    fieldName = field.name;
                }
                
                // Tạo style cho trạng thái
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
                
                row.innerHTML = `
                    <td>${booking.id}</td>
                    <td>${fieldName}</td>
                    <td>${booking.customerName}</td>
                    <td>${booking.customerPhone}</td>
                    <td>${formatDate(booking.date)}</td>
                    <td>${booking.startTime}</td>
                    <td>${booking.endTime}</td>
                    <td>${formatCurrency(booking.price)}</td>
                    <td><span class="field-status-badge ${statusClass}">${statusText}</span></td>
                    <td class="table-actions">
                        <button class="view-btn" data-id="${booking.id}">Xem</button>
                        <button class="complete-btn" data-id="${booking.id}" ${booking.status !== 'confirmed' ? 'disabled' : ''}>Hoàn thành</button>
                        <button class="cancel-btn" data-id="${booking.id}" ${booking.status !== 'confirmed' ? 'disabled' : ''}>Hủy</button>
                    </td>
                `;
                
                bookingsTable.appendChild(row);
            });
            
            // Thêm event listeners cho các nút
            addBookingButtonListeners();
        } else {
            bookingsTable.innerHTML = '<tr><td colspan="10" class="no-data">Không có đặt sân nào</td></tr>';
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsTable.innerHTML = '<tr><td colspan="10" class="error-data">Lỗi khi tải dữ liệu</td></tr>';
    }
}

// Thêm event listeners cho các nút trong bảng đặt sân
function addBookingButtonListeners() {
    // Xử lý nút xem chi tiết
    const viewButtons = document.querySelectorAll('#bookings-table .view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const bookingId = button.dataset.id;
            await loadBookingDetails(bookingId);
        });
    });
    
    // Xử lý nút hoàn thành
    const completeButtons = document.querySelectorAll('#bookings-table .complete-btn');
    completeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const bookingId = button.dataset.id;
            if (confirm('Xác nhận đánh dấu lượt đặt sân này là đã hoàn thành?')) {
                await updateBookingStatus(bookingId, 'completed');
            }
        });
    });
    
    // Xử lý nút hủy
    const cancelButtons = document.querySelectorAll('#bookings-table .cancel-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const bookingId = button.dataset.id;
            if (confirm('Bạn có chắc chắn muốn hủy lượt đặt sân này?')) {
                await updateBookingStatus(bookingId, 'cancelled');
            }
        });
    });
}

// Tải chi tiết đặt sân
async function loadBookingDetails(bookingId) {
    try {
        // Gọi API lấy chi tiết đặt sân
        const bookings = await fetchAPI('/bookings');
        const booking = bookings.find(b => b.id.toString() === bookingId);
        
        if (booking) {
            // Hiển thị modal hoặc chi tiết
            alert(`Chi tiết đặt sân #${booking.id}:
                Khách hàng: ${booking.customerName}
                Điện thoại: ${booking.customerPhone}
                Ngày: ${formatDate(booking.date)}
                Thời gian: ${booking.startTime} - ${booking.endTime}
                Giá: ${formatCurrency(booking.price)}
                Trạng thái: ${booking.status}
            `);
        } else {
            showNotification('Không tìm thấy thông tin đặt sân', 'error');
        }
    } catch (error) {
        console.error('Error loading booking details:', error);
        showNotification('Lỗi khi tải chi tiết đặt sân', 'error');
    }
}

// Cập nhật trạng thái đặt sân
async function updateBookingStatus(bookingId, status) {
    try {
        // Gọi API cập nhật trạng thái
        await fetchAPI(`/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        showNotification(`Cập nhật trạng thái đặt sân thành công`);
        
        // Tải lại dữ liệu
        await loadBookingsData();
        
        // Nếu đang ở trang dashboard, cập nhật thông tin đó
        if (currentPage === 'dashboard') {
            await loadDashboardData();
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        showNotification('Lỗi khi cập nhật trạng thái đặt sân', 'error');
    }
}

// Xử lý submit form đặt sân
async function handleBookingSubmit() {
    const bookingId = document.getElementById('booking-id').value;
    const fieldId = document.getElementById('booking-field').value;
    const customerName = document.getElementById('booking-customer').value;
    const customerPhone = document.getElementById('booking-phone').value;
    const date = document.getElementById('booking-date').value;
    const startTime = document.getElementById('booking-start').value;
    const endTime = document.getElementById('booking-end').value;
    const price = document.getElementById('booking-price').value;
    
    if (!fieldId || !customerName || !customerPhone || !date || !startTime || !endTime || !price) {
        showNotification('Vui lòng điền đầy đủ thông tin đặt sân', 'error');
        return;
    }
    
    try {
        // Kiểm tra xem thời gian đặt sân có bị trùng không
        const bookings = await fetchAPI(`/bookings?date=${date}`);
        
        // Kiểm tra thời gian
        const newStart = new Date(`${date}T${startTime}`);
        const newEnd = new Date(`${date}T${endTime}`);
        
        if (newEnd <= newStart) {
            showNotification('Thời gian kết thúc phải sau thời gian bắt đầu', 'error');
            return;
        }
        
        const existingBooking = bookings.find(booking => {
            // Bỏ qua booking hiện tại nếu đang sửa
            if (bookingId && booking.id.toString() === bookingId.toString()) {
                return false;
            }
            
            // Chỉ kiểm tra các booking của cùng một sân
            if (booking.fieldId.toString() !== fieldId.toString()) {
                return false;
            }
            
            // Kiểm tra xem booking có trạng thái hợp lệ không 
            if (booking.status === 'cancelled') {
                return false;
            }
            
            // Kiểm tra xem thời gian có trùng không
            const bookingStart = new Date(`${booking.date}T${booking.startTime}`);
            const bookingEnd = new Date(`${booking.date}T${booking.endTime}`);
            
            // Kiểm tra xem có trùng thời gian không
            return (
                (newStart >= bookingStart && newStart < bookingEnd) || // Thời gian bắt đầu nằm trong khoảng thời gian đã đặt
                (newEnd > bookingStart && newEnd <= bookingEnd) || // Thời gian kết thúc nằm trong khoảng thời gian đã đặt
                (newStart <= bookingStart && newEnd >= bookingEnd) // Khoảng thời gian mới bao trùm khoảng thời gian đã đặt
            );
        });
        
        if (existingBooking) {
            showNotification('Thời gian này đã có người đặt sân. Vui lòng chọn thời gian khác.', 'error');
            return;
        }
        
        // Tạo đối tượng dữ liệu
        const bookingData = {
            fieldId,
            customerName,
            customerPhone,
            date,
            startTime,
            endTime,
            price: parseFloat(price),
            status: 'confirmed'
        };
        
        let response;
        
        if (bookingId) {
            // Cập nhật đặt sân
            response = await fetchAPI(`/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            
            showNotification('Cập nhật đặt sân thành công');
        } else {
            // Thêm mới đặt sân
            response = await fetchAPI('/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            
            showNotification('Đặt sân thành công');
        }
        
        // Đóng modal
        closeAllModals();
        
        // Tải lại dữ liệu
        await loadBookingsData();
        
        // Nếu đang ở trang dashboard, cập nhật thông tin đó
        if (currentPage === 'dashboard') {
            await loadDashboardData();
        }
        
    } catch (error) {
        console.error('Error submitting booking form:', error);
        showNotification('Lỗi khi lưu thông tin đặt sân', 'error');
    }
}