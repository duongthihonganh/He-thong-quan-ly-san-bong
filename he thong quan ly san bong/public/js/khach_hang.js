// Load customer data
async function loadCustomersData() {
    // In this simplified version, we'll create customer data based on the booking information
    const customersTable = document.querySelector('#customers-table tbody');
    if (!customersTable) return;
    
    // Clear existing data
    customersTable.innerHTML = '';
    
    try {
        // Get all bookings to extract customer information
        const bookings = await fetchAPI('/bookings');
        
        if (bookings && bookings.length > 0) {
            // Create a map to group bookings by customer phone number
            const customerMap = new Map();
            
            bookings.forEach(booking => {
                const phone = booking.customerPhone;
                
                if (!customerMap.has(phone)) {
                    customerMap.set(phone, {
                        id: customerMap.size + 1,
                        name: booking.customerName,
                        phone: phone,
                        email: '', // Not included in basic booking info
                        bookingCount: 1,
                        totalSpent: booking.price
                    });
                } else {
                    const customer = customerMap.get(phone);
                    customer.bookingCount += 1;
                    customer.totalSpent += booking.price;
                }
            });
            
            // Convert map to array and display
            const customers = Array.from(customerMap.values());
            
            customers.forEach(customer => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email || 'N/A'}</td>
                    <td>${customer.bookingCount}</td>
                    <td>${formatCurrency(customer.totalSpent)}</td>
                    <td class="table-actions">
                        <button class="view-btn" data-phone="${customer.phone}">Xem</button>
                    </td>
                `;
                
                customersTable.appendChild(row);
            });
            
            // Add event listeners for buttons
            addCustomerButtonListeners();
        } else {
            customersTable.innerHTML = '<tr><td colspan="7" class="no-data">Không có dữ liệu khách hàng</td></tr>';
        }
    } catch (error) {
        console.error('Error loading customers:', error);
        customersTable.innerHTML = '<tr><td colspan="7" class="error-data">Lỗi khi tải dữ liệu</td></tr>';
    }
}

// Add event listeners for customer table buttons
function addCustomerButtonListeners() {
    // Handle view buttons
    const viewButtons = document.querySelectorAll('#customers-table .view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const phone = button.dataset.phone;
            await viewCustomerBookings(phone);
        });
    });
}

// View customer booking history
async function viewCustomerBookings(phone) {
    try {
        // Get all bookings for this customer
        const bookings = await fetchAPI('/bookings');
        const customerBookings = bookings.filter(booking => booking.customerPhone === phone);
        
        if (customerBookings.length > 0) {
            // Get customer name from the first booking
            const customerName = customerBookings[0].customerName;
            
            // Format the booking history
            let bookingHistory = customerBookings.map(booking => 
                `- Ngày: ${formatDate(booking.date)}, Giờ: ${booking.startTime}-${booking.endTime}, 
                 Giá: ${formatCurrency(booking.price)}, Trạng thái: ${getStatusText(booking.status)}`
            ).join('\n');
            
            // Display the information
            alert(`Lịch sử đặt sân của khách hàng ${customerName} (${phone}):\n\n${bookingHistory}`);
        } else {
            showNotification('Không tìm thấy lịch sử đặt sân của khách hàng này', 'error');
        }
    } catch (error) {
        console.error('Error viewing customer bookings:', error);
        showNotification('Lỗi khi tải lịch sử đặt sân', 'error');
    }
}

// Get readable status text
function getStatusText(status) {
    switch (status) {
        case 'confirmed':
            return 'Đã xác nhận';
        case 'completed':
            return 'Hoàn thành';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return status;
    }
}