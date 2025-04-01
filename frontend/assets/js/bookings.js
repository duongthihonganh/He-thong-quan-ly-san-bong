document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const bookingsTable = document.querySelector('#bookingsTable tbody');
  const newBookingBtn = document.getElementById('newBookingBtn');
  const bookingModal = document.getElementById('bookingModal');
  const viewBookingModal = document.getElementById('viewBookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingFilterBtn = document.getElementById('bookingFilterBtn');
  
  // Initialize date picker with today's date if element exists
  const datePicker = document.getElementById('bookingDateFilter');
  if (datePicker) {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    datePicker.value = formattedDate;
  }
  
  // Fetch fields for dropdown
  fetchFields();
  
  // Fetch customers for dropdown
  fetchCustomers();
  
  // Fetch bookings data
  fetchBookings();
  
  // Initialize event listeners
  if (newBookingBtn) {
    newBookingBtn.addEventListener('click', function() {
      openAddBookingModal();
    });
  }
  
  if (bookingFilterBtn) {
    bookingFilterBtn.addEventListener('click', function() {
      const dateFilter = document.getElementById('bookingDateFilter').value;
      const fieldFilter = document.getElementById('bookingFieldFilter').value;
      const statusFilter = document.getElementById('bookingStatusFilter').value;
      fetchBookings(dateFilter, fieldFilter, statusFilter);
    });
  }
  
  // Close modals when clicking on X button
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.remove('show');
      }
    });
  });
  
  // Close view modal when clicking on X button
  const closeViewModalBtn = document.getElementById('closeViewModalBtn');
  if (closeViewModalBtn) {
    closeViewModalBtn.addEventListener('click', function() {
      viewBookingModal.classList.remove('show');
    });
  }
  
  // If time selection exists, add event listener to update end time based on start time
  const startTimeSelect = document.getElementById('startTime');
  const endTimeSelect = document.getElementById('endTime');
  
  if (startTimeSelect && endTimeSelect) {
    startTimeSelect.addEventListener('change', function() {
      updateEndTimeOptions();
    });
  }
  
  // Add event listeners for customer selection
  const customerSelect = document.getElementById('customerId');
  if (customerSelect) {
    customerSelect.addEventListener('change', function() {
      const newCustomerFields = document.getElementById('newCustomerFields');
      if (this.value === 'new') {
        newCustomerFields.style.display = 'block';
      } else {
        newCustomerFields.style.display = 'none';
      }
    });
  }
  
  // Add event listeners for booking action buttons
  document.addEventListener('click', function(e) {
    // View booking button clicked
    if (e.target.closest('.view-booking')) {
      const button = e.target.closest('.view-booking');
      const bookingId = button.getAttribute('data-id');
      viewBooking(bookingId);
      e.preventDefault();
    }
    
    // Delete booking button clicked
    if (e.target.closest('.delete-booking')) {
      const button = e.target.closest('.delete-booking');
      const bookingId = button.getAttribute('data-id');
      deleteBooking(bookingId);
      e.preventDefault();
    }
  });
  
  // Thêm sự kiện cho nút sửa trong modal xem chi tiết
  const editBookingFromViewBtn = document.getElementById('editBookingFromViewBtn');
  if (editBookingFromViewBtn) {
    editBookingFromViewBtn.addEventListener('click', function() {
      // Lấy ID đặt sân từ modal xem chi tiết
      const bookingId = document.getElementById('viewBookingId').textContent;
      console.log("Edit requested from view modal for booking ID:", bookingId);
      
      // Đóng modal xem chi tiết
      const viewBookingModal = document.getElementById('viewBookingModal');
      if (viewBookingModal) {
        viewBookingModal.classList.remove('show');
      }
      
      // Hiển thị console log để debug
      console.log("Getting booking modal element for editing");
      console.log("Booking modal element:", document.getElementById('bookingModal'));
      
      // Gọi hàm edit với ID đặt sân
      editBookingFromView(bookingId);
    });
  }
  
  // Save booking form
  const saveBookingBtn = document.getElementById('saveBookingBtn');
  if (saveBookingBtn) {
    saveBookingBtn.addEventListener('click', saveBooking);
  }
  
  // Cancel booking form
  const cancelBookingBtn = document.getElementById('cancelBookingBtn');
  if (cancelBookingBtn) {
    cancelBookingBtn.addEventListener('click', function() {
      bookingModal.classList.remove('show');
    });
  }
  
  // Close view booking modal
  const closeViewBookingBtn = document.getElementById('closeViewBookingBtn');
  if (closeViewBookingBtn) {
    closeViewBookingBtn.addEventListener('click', function() {
      viewBookingModal.classList.remove('show');
    });
  }
});

// Open add booking modal
function openAddBookingModal() {
  const bookingForm = document.getElementById('bookingForm');
  const bookingModal = document.getElementById('bookingModal');
  const modalTitle = bookingModal.querySelector('.modal-title');
  
  if (bookingForm) bookingForm.reset();
  document.getElementById('bookingId').value = ''; // Clear hidden ID field
  
  // Set default values
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  document.getElementById('bookingDate').value = formattedDate;
  document.getElementById('bookingStatus').value = 'confirmed';
  
  // Set modal title
  if (modalTitle) modalTitle.textContent = 'Đặt sân mới';
  
  // Reset new customer fields
  document.getElementById('newCustomerFields').style.display = 'none';
  
  // Show modal
  bookingModal.classList.add('show');
}

// Fetch fields for dropdown
function fetchFields() {
  const fieldSelect = document.getElementById('fieldId');
  const fieldFilter = document.getElementById('bookingFieldFilter');
  
  if (!fieldSelect && !fieldFilter) return;
  
  // Simulate API call to get fields
  // In a real app, we would fetch from API
  const fieldsList = [
    { id: 1, name: 'Sân mini 1', type: 'mini' },
    { id: 2, name: 'Sân mini 2', type: 'mini' },
    { id: 3, name: 'Sân 7 người 1', type: 'medium' },
    { id: 4, name: 'Sân 11 người', type: 'full' }
  ];
  
  // Populate field select if it exists
  if (fieldSelect) {
    fieldSelect.innerHTML = '<option value="">Chọn sân</option>';
    
    fieldsList.forEach(field => {
      const option = document.createElement('option');
      option.value = field.id;
      option.textContent = field.name;
      fieldSelect.appendChild(option);
    });
  }
  
  // Populate field filter if it exists
  if (fieldFilter) {
    fieldFilter.innerHTML = '<option value="">Tất cả sân</option>';
    
    fieldsList.forEach(field => {
      const option = document.createElement('option');
      option.value = field.id;
      option.textContent = field.name;
      fieldFilter.appendChild(option);
    });
  }
}

// Fetch customers for dropdown
function fetchCustomers() {
  const customerSelect = document.getElementById('customerId');
  
  if (!customerSelect) return;
  
  // Simulate API call to get customers
  // In a real app, we would fetch from API
  const customersList = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0901234567' },
    { id: 2, name: 'Trần Thị B', phone: '0912345678' },
    { id: 3, name: 'Lê Văn C', phone: '0923456789' }
  ];
  
  // Populate customer select
  customerSelect.innerHTML = '<option value="">Chọn khách hàng</option>';
  
  customersList.forEach(customer => {
    const option = document.createElement('option');
    option.value = customer.id;
    option.textContent = `${customer.name} (${customer.phone})`;
    customerSelect.appendChild(option);
  });
  
  // Add new customer option
  const newCustomerOption = document.createElement('option');
  newCustomerOption.value = 'new';
  newCustomerOption.textContent = '+ Thêm khách hàng mới';
  customerSelect.appendChild(newCustomerOption);
}

// Update end time options based on selected start time
function updateEndTimeOptions() {
  const startTimeSelect = document.getElementById('startTime');
  const endTimeSelect = document.getElementById('endTime');
  
  if (!startTimeSelect || !endTimeSelect) return;
  
  const selectedStartTime = startTimeSelect.value;
  if (!selectedStartTime) {
    endTimeSelect.innerHTML = '<option value="">-- Chọn giờ --</option>';
    endTimeSelect.disabled = true;
    return;
  }
  
  endTimeSelect.disabled = false;
  const startHour = parseInt(selectedStartTime.split(':')[0]);
  
  // Clear existing options
  endTimeSelect.innerHTML = '<option value="">-- Chọn giờ --</option>';
  
  // Generate end time options (from start time + 1 hour to 23:00)
  for (let hour = startHour + 1; hour <= 23; hour++) {
    const endOption = document.createElement('option');
    endOption.value = `${hour.toString().padStart(2, '0')}:00`;
    endOption.textContent = `${hour}:00`;
    endTimeSelect.appendChild(endOption);
  }
}

// Fetch bookings
function fetchBookings(dateFilter = '', fieldFilter = '', statusFilter = '') {
  const bookingsTable = document.querySelector('#bookingsTable tbody');
  
  if (!bookingsTable) return;
  
  // Show loading indicator
  bookingsTable.innerHTML = '<tr><td colspan="8" class="text-center">Đang tải dữ liệu...</td></tr>';
  
  // Get today's date for sample data
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Format dates for display
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const todayFormatted = formatDate(today);
  const yesterdayFormatted = formatDate(yesterday);
  const tomorrowFormatted = formatDate(tomorrow);
  
  // Simulate data (in a real app, this would come from the API)
  const bookingsList = [
    { 
      id: 101, 
      fieldId: 1, 
      fieldName: 'Sân mini 1', 
      customerId: 1, 
      customerName: 'Nguyễn Văn A', 
      customerPhone: '0901234567',
      date: todayFormatted, 
      startTime: '17:00', 
      endTime: '18:00', 
      status: 'confirmed', 
      totalAmount: 250000,
      paidAmount: 125000,
      paymentMethod: 'cash',
      notes: 'Khách hàng thường xuyên'
    },
    { 
      id: 102, 
      fieldId: 2, 
      fieldName: 'Sân mini 2', 
      customerId: 2, 
      customerName: 'Trần Thị B', 
      customerPhone: '0912345678',
      date: todayFormatted, 
      startTime: '18:00', 
      endTime: '19:00', 
      status: 'confirmed', 
      totalAmount: 250000,
      paidAmount: 250000,
      paymentMethod: 'transfer',
      notes: ''
    },
    { 
      id: 103, 
      fieldId: 3, 
      fieldName: 'Sân 7 người 1', 
      customerId: 3, 
      customerName: 'Lê Văn C', 
      customerPhone: '0923456789',
      date: tomorrowFormatted, 
      startTime: '19:00', 
      endTime: '21:00', 
      status: 'pending', 
      totalAmount: 800000,
      paidAmount: 0,
      paymentMethod: 'cash',
      notes: 'Đặt sân đá giao lưu'
    },
    { 
      id: 104, 
      fieldId: 4, 
      fieldName: 'Sân 11 người', 
      customerId: 1, 
      customerName: 'Nguyễn Văn A', 
      customerPhone: '0901234567',
      date: yesterdayFormatted, 
      startTime: '16:00', 
      endTime: '18:00', 
      status: 'completed', 
      totalAmount: 1600000,
      paidAmount: 1600000,
      paymentMethod: 'card',
      notes: 'Đã thanh toán'
    }
  ];
  
  // Filter bookings if filters are provided
  let filteredBookings = [...bookingsList];
  
  if (dateFilter) {
    filteredBookings = filteredBookings.filter(booking => booking.date === dateFilter);
  }
  
  if (fieldFilter) {
    filteredBookings = filteredBookings.filter(booking => booking.fieldId.toString() === fieldFilter);
  }
  
  if (statusFilter) {
    filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
  }
  
  // Populate table
  if (filteredBookings.length === 0) {
    bookingsTable.innerHTML = '<tr><td colspan="8" class="text-center">Không tìm thấy dữ liệu phù hợp</td></tr>';
    return;
  }
  
  let html = '';
  filteredBookings.forEach(booking => {
    html += `
      <tr 
        data-paid="${booking.paidAmount}" 
        data-notes="${booking.notes || ''}" 
        data-payment="${booking.paymentMethod}"
        data-start="${booking.startTime}"
        data-end="${booking.endTime}"
        data-field-id="${booking.fieldId}"
        data-customer-id="${booking.customerId}"
        data-status="${booking.status}"
      >
        <td>${booking.id}</td>
        <td>${booking.fieldName}</td>
        <td>${booking.customerName}<br><small>${booking.customerPhone}</small></td>
        <td>${formatDateDisplay(booking.date)}</td>
        <td>${booking.startTime} - ${booking.endTime}</td>
        <td><span class="status ${getStatusClass(booking.status)}">${getStatusText(booking.status)}</span></td>
        <td>${formatCurrency(booking.totalAmount)}</td>
        <td>
          <button class="action-btn view-booking" data-id="${booking.id}" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn delete-booking" data-id="${booking.id}" title="Xóa">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `;
  });
  
  bookingsTable.innerHTML = html;
}

// View booking details
function viewBooking(id) {
  console.log("View booking clicked with id:", id);
  const viewBookingModal = document.getElementById('viewBookingModal');
  if (!viewBookingModal) {
    console.error("View booking modal not found in the DOM");
    return;
  }
  
  // Lấy dữ liệu từ danh sách đặt sân
  // Lấy dữ liệu từ DOM thay vì sử dụng mảng tĩnh
  const bookingRow = document.querySelector(`#bookingsTable tbody tr td button.view-booking[data-id="${id}"]`).closest('tr');
  if (!bookingRow) {
    alert('Không tìm thấy thông tin đặt sân!');
    return;
  }
  
  try {
    // Thông tin đặt sân từ hàng hiện tại
    const booking = {
      id: id,
      fieldName: bookingRow.cells[1].textContent.trim(),
      customerName: bookingRow.cells[2].textContent.split('\n')[0].trim(),
      customerPhone: bookingRow.cells[2].querySelector('small') ? bookingRow.cells[2].querySelector('small').textContent.trim() : '',
      date: bookingRow.cells[3].textContent.trim(), // Đã được định dạng
      timeRange: bookingRow.cells[4].textContent.trim(),
      status: bookingRow.cells[5].querySelector('.status').textContent.trim(),
      statusClass: bookingRow.cells[5].querySelector('.status').className.split(' ')[1] || '',
      totalAmount: bookingRow.cells[6].textContent.trim(),
      // Thêm thông tin mặc định cho các trường không có trong bảng
      paidAmount: bookingRow.getAttribute('data-paid') || '0', 
      notes: bookingRow.getAttribute('data-notes') || 'Không có ghi chú',
      paymentMethod: bookingRow.getAttribute('data-payment') || 'cash'
    };

    // Phân tích thời gian
    const timeParts = booking.timeRange.split(' - ');
    booking.startTime = timeParts[0] || '';
    booking.endTime = timeParts[1] || '';
    
    console.log("Extracted booking data:", booking);
    
    // Hiển thị thông tin chi tiết
    document.getElementById('viewBookingId').textContent = booking.id;
    document.getElementById('viewFieldName').textContent = booking.fieldName;
    document.getElementById('viewBookingDate').textContent = booking.date;
    document.getElementById('viewBookingTime').textContent = booking.timeRange;
    document.getElementById('viewCustomerName').textContent = booking.customerName;
    document.getElementById('viewCustomerPhone').textContent = booking.customerPhone;
    
    // Trạng thái đặt sân
    const statusClass = booking.statusClass.replace('status-', 'badge-');
    document.getElementById('viewBookingStatus').innerHTML = 
      `<span class="badge ${statusClass}">${booking.status}</span>`;
    
    // Xử lý trạng thái thanh toán
    let paymentStatus = 'Chưa thanh toán';
    let paymentClass = 'badge-secondary';
    
    if (booking.paidAmount && parseInt(booking.paidAmount) > 0) {
      const total = parseInt(booking.totalAmount.replace(/[^0-9]/g, ''));
      const paid = parseInt(booking.paidAmount.replace(/[^0-9]/g, ''));
      
      if (paid >= total) {
        paymentStatus = 'Đã thanh toán';
        paymentClass = 'badge-success';
      } else {
        paymentStatus = 'Thanh toán một phần';
        paymentClass = 'badge-warning';
      }
    }
    
    document.getElementById('viewPaymentStatus').innerHTML = 
      `<span class="badge ${paymentClass}">${paymentStatus}</span>`;
    
    // Phương thức thanh toán
    let paymentMethodText = 'Tiền mặt';
    if (booking.paymentMethod === 'transfer') {
      paymentMethodText = 'Chuyển khoản';
    } else if (booking.paymentMethod === 'card') {
      paymentMethodText = 'Thẻ';
    }
    document.getElementById('viewPaymentMethod').textContent = paymentMethodText;
    
    // Tổng tiền và đã thanh toán
    document.getElementById('viewTotalAmount').textContent = booking.totalAmount;
    
    // Giá trị mặc định nếu chưa có thông tin
    const paidAmount = booking.paidAmount || '0 ₫';
    document.getElementById('viewPaidAmount').textContent = paidAmount;
    
    // Tính số tiền còn lại
    const total = parseInt(booking.totalAmount.replace(/[^0-9]/g, '')) || 0;
    const paid = parseInt(paidAmount.replace(/[^0-9]/g, '')) || 0;
    const remaining = total - paid;
    document.getElementById('viewRemainingAmount').textContent = formatCurrency(remaining);
    
    // Ghi chú
    document.getElementById('viewNotes').textContent = booking.notes || 'Không có';
    
    console.log("All booking details populated successfully");
  } catch (error) {
    console.error("Error while populating modal fields:", error);
    alert('Đã xảy ra lỗi khi hiển thị thông tin đặt sân. Vui lòng thử lại!');
    return;
  }
  
  // Hiển thị modal
  console.log("About to show view booking modal");
  viewBookingModal.classList.add('show');
  console.log("View booking modal should be visible now");
}

// Edit booking
function editBooking(id) {
  console.log("Edit booking requested for id:", id);
  const bookingModal = document.getElementById('bookingModal');
  const modalTitle = bookingModal.querySelector('.modal-title');
  
  if (!bookingModal) {
    console.error("Booking modal not found in the DOM");
    return;
  }
  
  // Tìm hàng chứa đơn đặt sân cần chỉnh sửa
  const bookingRow = document.querySelector(`#bookingsTable tbody tr td button.edit-booking[data-id="${id}"]`).closest('tr');
  if (!bookingRow) {
    console.error("Cannot find booking row with id:", id);
    alert('Không tìm thấy thông tin đặt sân!');
    return;
  }
  
  try {
    // Lấy thông tin đặt sân từ DOM
    const statusText = bookingRow.cells[5].querySelector('.status').textContent.trim();
    let status = 'confirmed';
    
    // Xác định trạng thái từ chữ hiển thị
    if (statusText === 'Chờ xác nhận') status = 'pending';
    else if (statusText === 'Đã hủy') status = 'cancelled';
    else if (statusText === 'Đã hoàn thành') status = 'completed';
    
    // Lấy thời gian bắt đầu và kết thúc
    const timeRange = bookingRow.cells[4].textContent.trim();
    const timeParts = timeRange.split(' - ');
    const startTime = bookingRow.getAttribute('data-start') || timeParts[0].trim();
    const endTime = bookingRow.getAttribute('data-end') || timeParts[1].trim();
    
    // Lấy giá trị từ các thuộc tính dữ liệu
    const fieldId = bookingRow.getAttribute('data-field-id') || '1';
    const customerId = bookingRow.getAttribute('data-customer-id') || '1';
    const paymentMethod = bookingRow.getAttribute('data-payment') || 'cash';
    const notes = bookingRow.getAttribute('data-notes') || '';
    
    // Lấy số tiền
    const totalAmountText = bookingRow.cells[6].textContent.trim();
    const totalAmount = parseInt(totalAmountText.replace(/[^0-9]/g, '')) || 0;
    const paidAmount = parseInt(bookingRow.getAttribute('data-paid') || '0');
    
    // Lấy ngày đặt sân - cần chuyển định dạng phù hợp
    const displayDate = bookingRow.cells[3].textContent.trim();
    // Chuyển định dạng hiển thị (dd/mm/yyyy) thành định dạng HTML input (yyyy-mm-dd)
    const dateParts = displayDate.split('/');
    let formattedDate = '';
    
    if (dateParts.length === 3) {
      // Nếu ngày ở định dạng dd/mm/yyyy
      formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    } else {
      // Nếu không phân tích được, sử dụng ngày hôm nay
      const today = new Date();
      formattedDate = today.toISOString().split('T')[0];
    }
    
    console.log("Extracted booking data for edit:", {
      id, fieldId, customerId, formattedDate, status, startTime, endTime, totalAmount, paidAmount, notes, paymentMethod
    });
    
    // Cập nhật thông tin vào biểu mẫu
    document.getElementById('bookingId').value = id;
    document.getElementById('fieldId').value = fieldId;
    document.getElementById('customerId').value = customerId;
    document.getElementById('bookingDate').value = formattedDate;
    document.getElementById('bookingStatus').value = status;
    
    // Cập nhật thời gian
    document.getElementById('startTime').value = startTime;
    
    // Cập nhật các tùy chọn thời gian kết thúc dựa trên thời gian bắt đầu
    updateEndTimeOptions();
    document.getElementById('endTime').value = endTime;
    
    // Cập nhật thông tin thanh toán và ghi chú
    document.getElementById('paymentMethod').value = paymentMethod;
    document.getElementById('totalAmount').value = totalAmount;
    document.getElementById('paidAmount').value = paidAmount;
    document.getElementById('notes').value = notes;
    
    // Tính số tiền còn lại
    const remaining = totalAmount - paidAmount;
    document.getElementById('remainingAmount').textContent = formatCurrency(remaining);
    
    // Ẩn trường thông tin khách hàng mới
    document.getElementById('newCustomerFields').style.display = 'none';
    
    // Đặt tiêu đề modal
    if (modalTitle) modalTitle.textContent = 'Chỉnh sửa đặt sân';
    
    console.log("Form populated successfully for editing");
  } catch (error) {
    console.error("Error preparing booking for edit:", error);
    alert('Đã xảy ra lỗi khi chuẩn bị chỉnh sửa đơn đặt sân. Vui lòng thử lại!');
    return;
  }
  
  // Hiển thị modal
  bookingModal.classList.add('show');
}

// Hàm chỉnh sửa đơn đặt sân từ trang xem chi tiết
function editBookingFromView(id) {
  console.log("Edit booking from view for id:", id);
  
  // Lấy dữ liệu từ modal xem chi tiết thay vì tìm lại từ bảng
  // Lấy thông tin từ các phần tử trong modal xem chi tiết
  const fieldName = document.getElementById('viewFieldName').textContent.trim();
  const customerName = document.getElementById('viewCustomerName').textContent.trim();
  const customerPhone = document.getElementById('viewCustomerPhone').textContent.trim();
  const bookingDate = document.getElementById('viewBookingDate').textContent.trim();
  const timeRange = document.getElementById('viewBookingTime').textContent.trim();
  const totalAmount = document.getElementById('viewTotalAmount').textContent.trim();
  const paidAmount = document.getElementById('viewPaidAmount').textContent.trim();
  const notes = document.getElementById('viewNotes').textContent.trim();
  
  console.log("Extracted data from view modal:", {
    id, fieldName, customerName, customerPhone, bookingDate, timeRange, totalAmount, paidAmount, notes
  });
  
  // Tìm đơn đặt sân trong bảng để lấy thêm dữ liệu bổ sung
  const rows = document.querySelectorAll('#bookingsTable tbody tr');
  let row = null;
  
  // Tìm hàng có ID phù hợp
  for (let i = 0; i < rows.length; i++) {
    const firstCell = rows[i].cells[0];
    if (firstCell && firstCell.textContent.trim() === id) {
      row = rows[i];
      break;
    }
  }
  
  // Mở modal chỉnh sửa
  const bookingModal = document.getElementById('bookingModal');
  
  if (!bookingModal) {
    console.error("Booking modal not found in DOM");
    alert("Không thể mở cửa sổ chỉnh sửa. Vui lòng tải lại trang.");
    return;
  }
  
  const modalTitle = bookingModal.querySelector('.modal-title');
  
  // Phân tích thời gian từ chuỗi
  const timeParts = timeRange.split(' - ');
  const startTime = timeParts[0] || '';
  const endTime = timeParts[1] || '';
  
  // Lấy dữ liệu bổ sung từ thuộc tính data của hàng nếu có
  let fieldId = '1';
  let customerId = '1';
  let status = 'confirmed';
  let paymentMethod = 'cash';
  
  if (row) {
    fieldId = row.getAttribute('data-field-id') || '1';
    customerId = row.getAttribute('data-customer-id') || '1';
    status = row.getAttribute('data-status') || 'confirmed';
    paymentMethod = row.getAttribute('data-payment') || 'cash';
  }
  
  // Xử lý dữ liệu
  // Chuyển định dạng ngày từ dd/mm/yyyy thành yyyy-mm-dd
  const dateParts = bookingDate.split('/');
  let formattedDate = '';
  
  if (dateParts.length === 3) {
    formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
  } else {
    const today = new Date();
    formattedDate = today.toISOString().split('T')[0];
  }
  
  // Chuyển chuỗi tiền thành số
  const totalAmountValue = parseInt(totalAmount.replace(/[^0-9]/g, '')) || 0;
  const paidAmountValue = parseInt(paidAmount.replace(/[^0-9]/g, '')) || 0;
  
  // Reset form trước khi cập nhật
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) bookingForm.reset();
  
  console.log("Setting form fields for editing");
  
  // Cập nhật dữ liệu vào form
  document.getElementById('bookingId').value = id;
  document.getElementById('fieldId').value = fieldId;
  document.getElementById('customerId').value = customerId;
  document.getElementById('bookingDate').value = formattedDate;
  document.getElementById('bookingStatus').value = status;
  document.getElementById('startTime').value = startTime;
  
  // Cập nhật danh sách thời gian kết thúc
  updateEndTimeOptions();
  document.getElementById('endTime').value = endTime;
  
  // Cập nhật thông tin thanh toán và ghi chú
  const paymentMethodField = document.getElementById('paymentMethod');
  if (paymentMethodField) {
    paymentMethodField.value = paymentMethod;
  }
  
  const totalAmountField = document.getElementById('totalAmount');
  if (totalAmountField) {
    totalAmountField.value = totalAmountValue;
  }
  
  const paidAmountField = document.getElementById('paidAmount');
  if (paidAmountField) {
    paidAmountField.value = paidAmountValue;
  }
  
  const notesField = document.getElementById('notes');
  if (notesField) {
    notesField.value = notes === 'Không có' ? '' : notes;
  }
  
  // Tính tiền còn lại
  const remainingField = document.getElementById('remainingAmount');
  if (remainingField) {
    const remaining = totalAmountValue - paidAmountValue;
    remainingField.textContent = formatCurrency(remaining);
  }
  
  // Ẩn trường khách hàng mới
  const newCustomerFields = document.getElementById('newCustomerFields');
  if (newCustomerFields) {
    newCustomerFields.style.display = 'none';
  }
  
  // Cập nhật tiêu đề modal
  if (modalTitle) modalTitle.textContent = 'Chỉnh sửa đặt sân';
  
  // Hiển thị modal
  bookingModal.classList.add('show');
  
  console.log("Edit form populated successfully from view modal");
}

// Save booking
function saveBooking() {
  const bookingModal = document.getElementById('bookingModal');
  
  // Get form data
  const bookingId = document.getElementById('bookingId').value;
  const fieldId = document.getElementById('fieldId').value;
  const customerId = document.getElementById('customerId').value;
  const date = document.getElementById('bookingDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const status = document.getElementById('bookingStatus').value;
  const notes = document.getElementById('notes').value;
  const paymentMethod = document.getElementById('paymentMethod').value;
  const totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
  const paidAmount = parseFloat(document.getElementById('paidAmount').value) || 0;
  
  // Validate required fields
  if (!fieldId || !date || !startTime || !endTime || !customerId) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
    return;
  }
  
  // Handle new customer
  let customerName = '';
  let customerPhone = '';
  if (customerId === 'new') {
    customerName = document.getElementById('customerName').value;
    customerPhone = document.getElementById('customerPhone').value;
    
    if (!customerName || !customerPhone) {
      alert('Vui lòng nhập thông tin khách hàng mới!');
      return;
    }
  } else {
    // Lấy tên khách hàng từ dropdown
    const customerOption = document.querySelector(`#customerId option[value="${customerId}"]`);
    if (customerOption) {
      const customerText = customerOption.textContent;
      // Tách tên và số điện thoại từ chuỗi "Tên (SĐT)"
      const match = customerText.match(/(.*) \((.*)\)/);
      if (match) {
        customerName = match[1];
        customerPhone = match[2];
      }
    }
  }
  
  // Lấy tên sân từ dropdown
  let fieldName = '';
  const fieldOption = document.querySelector(`#fieldId option[value="${fieldId}"]`);
  if (fieldOption) {
    fieldName = fieldOption.textContent;
  }
  
  // Cập nhật DOM nếu đây là thao tác chỉnh sửa
  if (bookingId) {
    // Tìm hàng chứa đơn đặt sân cần cập nhật
    const rows = document.querySelectorAll('#bookingsTable tbody tr');
    for (let i = 0; i < rows.length; i++) {
      const firstCell = rows[i].cells[0];
      if (firstCell && firstCell.textContent.trim() === bookingId) {
        const row = rows[i];
        
        // Cập nhật thông tin vào các ô
        if (fieldName) row.cells[1].textContent = fieldName;
        
        // Cập nhật tên khách hàng và SĐT
        if (customerName) {
          let customerHtml = customerName;
          if (customerPhone) {
            customerHtml += `<br><small>${customerPhone}</small>`;
          }
          row.cells[2].innerHTML = customerHtml;
        }
        
        // Định dạng ngày để hiển thị
        const displayDate = new Date(date);
        row.cells[3].textContent = displayDate.toLocaleDateString('vi-VN');
        
        // Cập nhật thời gian
        row.cells[4].textContent = `${startTime} - ${endTime}`;
        
        // Cập nhật trạng thái
        row.cells[5].innerHTML = `<span class="status ${getStatusClass(status)}">${getStatusText(status)}</span>`;
        
        // Cập nhật số tiền
        row.cells[6].textContent = formatCurrency(totalAmount);
        
        // Cập nhật các thuộc tính data
        row.setAttribute('data-field-id', fieldId);
        row.setAttribute('data-customer-id', customerId);
        row.setAttribute('data-start', startTime);
        row.setAttribute('data-end', endTime);
        row.setAttribute('data-status', status);
        row.setAttribute('data-payment', paymentMethod);
        row.setAttribute('data-paid', paidAmount);
        row.setAttribute('data-notes', notes);
        
        console.log("Updated booking in DOM:", bookingId);
        break;
      }
    }
  }
  
  // Display success message based on whether this is a new booking or an edit
  const successMessage = bookingId ? 'Đã cập nhật thông tin đặt sân thành công!' : 'Đặt sân thành công!';
  
  // Close modal
  bookingModal.classList.remove('show');
  
  // Refresh the booking table nếu là đặt sân mới
  if (!bookingId) {
    fetchBookings();
  } else {
    // Lưu thay đổi vào localStorage
    saveBookingsToLocalStorage();
  }
  
  // Show success message
  alert(successMessage);
}

// Helper functions

// Get status class
function getStatusClass(status) {
  const statusMap = {
    'pending': 'status-warning',
    'confirmed': 'status-success',
    'cancelled': 'status-danger',
    'completed': 'status-info'
  };
  
  return statusMap[status] || '';
}

// Get status text
function getStatusText(status) {
  const statusMap = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'cancelled': 'Đã hủy',
    'completed': 'Đã hoàn thành'
  };
  
  return statusMap[status] || 'Không xác định';
}

// Format currency to VND
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Format date for display
function formatDateDisplay(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
}

// Delete booking
function deleteBooking(id) {
  console.log("Delete booking requested for id:", id);
  
  // Confirm deletion
  const confirmDelete = confirm('Bạn có chắc chắn muốn xóa đơn đặt sân này không?');
  
  if (!confirmDelete) return;
  
  try {
    // Tìm hàng chứa đơn đặt sân cần xóa
    const bookingRow = document.querySelector(`#bookingsTable tbody tr td button.delete-booking[data-id="${id}"]`).closest('tr');
    
    if (!bookingRow) {
      console.error("Cannot find booking row with id:", id);
      alert('Không tìm thấy đơn đặt sân cần xóa!');
      return;
    }
    
    // Xóa hàng khỏi bảng (xóa thật sự trong DOM)
    bookingRow.remove();
    console.log("Booking row removed from DOM");
    
    // Kiểm tra nếu bảng trống sau khi xóa
    const remainingRows = document.querySelectorAll('#bookingsTable tbody tr');
    if (remainingRows.length === 0) {
      // Nếu không còn đơn nào, hiển thị thông báo trống
      document.querySelector('#bookingsTable tbody').innerHTML = 
        '<tr><td colspan="8" class="text-center">Không có dữ liệu đặt sân</td></tr>';
      console.log("Table is now empty, showing empty message");
    }
    
    // Lưu thay đổi vào localStorage (để duy trì trạng thái sau khi tải lại trang)
    saveBookingsToLocalStorage();
    
    // Hiển thị thông báo thành công
    alert('Đã xóa đơn đặt sân thành công!');
  } catch (error) {
    console.error("Error when deleting booking:", error);
    alert('Đã xảy ra lỗi khi xóa đơn đặt sân. Vui lòng thử lại!');
  }
}

// Lưu danh sách đặt sân vào localStorage 
function saveBookingsToLocalStorage() {
  try {
    // Lấy tất cả các đơn đặt sân từ bảng
    const bookingRows = document.querySelectorAll('#bookingsTable tbody tr');
    const bookings = [];
    
    // Bỏ qua nếu không có dữ liệu hoặc hàng thông báo trống
    if (bookingRows.length === 0 || bookingRows[0].cells.length === 1) {
      localStorage.setItem('bookings', JSON.stringify([]));
      return;
    }
    
    // Lưu thông tin từng đơn
    bookingRows.forEach(row => {
      if (row.cells.length > 1) {  // Đảm bảo không phải hàng thông báo
        const bookingId = row.cells[0].textContent.trim();
        const fieldName = row.cells[1].textContent.trim();
        const customerInfo = row.cells[2].textContent.trim();
        const date = row.cells[3].textContent.trim();
        const timeRange = row.cells[4].textContent.trim();
        const status = row.cells[5].querySelector('.status').textContent.trim();
        const amount = row.cells[6].textContent.trim();
        
        bookings.push({
          id: bookingId,
          fieldName: fieldName,
          customerInfo: customerInfo,
          date: date,
          timeRange: timeRange,
          status: status,
          amount: amount
        });
      }
    });
    
    // Lưu vào localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings));
    console.log("Bookings saved to localStorage:", bookings.length, "items");
  } catch (error) {
    console.error("Error saving bookings to localStorage:", error);
  }
}
