document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const bookingsTable = document.querySelector('#bookingsTable tbody');
    const newBookingBtn = document.getElementById('newBookingBtn');
    const bookingModal = document.getElementById('bookingModal');
    const viewBookingModal = document.getElementById('viewBookingModal');
    const cancelBookingBtn = document.getElementById('cancelBookingBtn');
    const saveBookingBtn = document.getElementById('saveBookingBtn');
    const closeViewBookingBtn = document.getElementById('closeViewBookingBtn');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const bookingForm = document.getElementById('bookingForm');
    const bookingFilterBtn = document.getElementById('bookingFilterBtn');
    const datePicker = document.getElementById('bookingDatePicker');
    
    // Initialize date picker with today's date if element exists
    if (datePicker) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      datePicker.value = formattedDate;
    }
    
    // Fetch fields for dropdown
    fetchFields();
    
    // Fetch customers for dropdown
    fetchCustomers();
    
    // Fetch services for selection
    fetchServices();
    
    // Fetch bookings data
    fetchBookings();
    
    // Initialize event listeners
    if (newBookingBtn) {
      newBookingBtn.addEventListener('click', function() {
        openAddBookingModal();
      });
    }
    
    if (cancelBookingBtn) {
      cancelBookingBtn.addEventListener('click', function() {
        bookingModal.classList.remove('show');
      });
    }
    
    if (saveBookingBtn) {
      saveBookingBtn.addEventListener('click', function() {
        saveBooking();
      });
    }
    
    if (closeViewBookingBtn) {
      closeViewBookingBtn.addEventListener('click', function() {
        viewBookingModal.classList.remove('show');
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
    
    // Close modal when clicking on X button
    modalCloseBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          modal.classList.remove('show');
        }
      });
    });
    
    // If time selection exists, add event listener to update end time based on start time
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');
    
    if (startTimeSelect && endTimeSelect) {
      startTimeSelect.addEventListener('change', function() {
        updateEndTimeOptions();
      });
    }
  });
  
  // Open add booking modal
  function openAddBookingModal() {
    const bookingForm = document.getElementById('bookingForm');
    const bookingModal = document.getElementById('bookingModal');
    const modalTitle = bookingModal.querySelector('.modal-title');
    
    if (bookingForm) bookingForm.reset();
    
    // Set default values
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('date').value = formattedDate;
    document.getElementById('status').value = 'confirmed';
    
    // Set modal title
    if (modalTitle) modalTitle.textContent = 'Đặt sân mới';
    
    // Populate time options
    populateTimeOptions();
    
    // Reset services selection
    const servicesContainer = document.getElementById('servicesContainer');
    if (servicesContainer) {
      servicesContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
      
      servicesContainer.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = 1;
        input.disabled = true;
      });
    }
    
    // Show modal
    bookingModal.classList.add('show');
  }
  
  // Populate time options
  function populateTimeOptions() {
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');
    
    if (!startTimeSelect || !endTimeSelect) return;
    
    // Clear existing options
    startTimeSelect.innerHTML = '';
    endTimeSelect.innerHTML = '';
    
    // Generate time options (from 5:00 to 22:00)
    for (let hour = 5; hour <= 22; hour++) {
      const timeValue = `${hour.toString().padStart(2, '0')}:00`;
      const timeText = `${hour}:00`;
      
      const startOption = document.createElement('option');
      startOption.value = timeValue;
      startOption.textContent = timeText;
      startTimeSelect.appendChild(startOption);
      
      if (hour < 22) {
        const endOption = document.createElement('option');
        endOption.value = `${(hour + 1).toString().padStart(2, '0')}:00`;
        endOption.textContent = `${hour + 1}:00`;
        endTimeSelect.appendChild(endOption);
      }
    }
    
    // Default to the current hour
    const currentHour = new Date().getHours();
    let defaultStartHour = currentHour;
    
    // If current hour is before 5:00 or after 21:00, default to 5:00
    if (currentHour < 5 || currentHour >= 22) {
      defaultStartHour = 5;
    }
    
    startTimeSelect.value = `${defaultStartHour.toString().padStart(2, '0')}:00`;
    endTimeSelect.value = `${(defaultStartHour + 1).toString().padStart(2, '0')}:00`;
  }
  
  // Update end time options based on selected start time
  function updateEndTimeOptions() {
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');
    
    if (!startTimeSelect || !endTimeSelect) return;
    
    const selectedStartTime = startTimeSelect.value;
    const startHour = parseInt(selectedStartTime.split(':')[0]);
    
    // Clear existing options
    endTimeSelect.innerHTML = '';
    
    // Generate end time options (from start time + 1 hour to 23:00)
    for (let hour = startHour + 1; hour <= 23; hour++) {
      const endOption = document.createElement('option');
      endOption.value = `${hour.toString().padStart(2, '0')}:00`;
      endOption.textContent = `${hour}:00`;
      endTimeSelect.appendChild(endOption);
    }
    
    // Set default end time to start time + 1 hour
    endTimeSelect.value = `${(startHour + 1).toString().padStart(2, '0')}:00`;
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
    
    // Add event listener for "new customer" option
    customerSelect.addEventListener('change', function() {
      const selectedValue = this.value;
      const newCustomerFields = document.getElementById('newCustomerFields');
      
      if (selectedValue === 'new') {
        newCustomerFields.style.display = 'block';
      } else {
        newCustomerFields.style.display = 'none';
      }
    });
  }
  
  // Fetch services for selection
  function fetchServices() {
    const servicesContainer = document.getElementById('servicesContainer');
    
    if (!servicesContainer) return;
    
    // Simulate API call to get services
    // In a real app, we would fetch from API
    const servicesList = [
      { id: 1, name: 'Nước uống', price: 10000, description: 'Nước khoáng, nước ngọt, trà đá' },
      { id: 2, name: 'Áo thi đấu', price: 50000, description: 'Áo thi đấu cho đội bóng' },
      { id: 3, name: 'Trọng tài', price: 200000, description: 'Dịch vụ trọng tài cho trận đấu' },
      { id: 4, name: 'Quay video', price: 300000, description: 'Quay video trận đấu, chất lượng HD' }
    ];
    
    // Create service checkboxes
    let html = '';
    servicesList.forEach(service => {
      html += `
        <div class="service-item">
          <div class="service-checkbox">
            <input type="checkbox" id="service_${service.id}" value="${service.id}" onchange="toggleServiceQuantity(this)">
            <label for="service_${service.id}">${service.name} (${formatCurrency(service.price)})</label>
          </div>
          <div class="service-quantity">
            <input type="number" id="quantity_${service.id}" min="1" value="1" disabled class="form-control-sm">
          </div>
        </div>
      `;
    });
    
    servicesContainer.innerHTML = html;
  }
  
  // Toggle service quantity input
  function toggleServiceQuantity(checkbox) {
    const serviceId = checkbox.value;
    const quantityInput = document.getElementById(`quantity_${serviceId}`);
    
    if (checkbox.checked) {
      quantityInput.disabled = false;
    } else {
      quantityInput.disabled = true;
      quantityInput.value = 1;
    }
  }
  
  // Save booking
  function saveBooking() {
    const bookingForm = document.getElementById('bookingForm');
    const bookingModal = document.getElementById('bookingModal');
    
    // Get form data
    const fieldId = document.getElementById('fieldId').value;
    const customerId = document.getElementById('customerId').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value;
    
    // Basic validation
    if (!fieldId) {
      alert('Vui lòng chọn sân.');
      return;
    }
    
    if (!customerId) {
      alert('Vui lòng chọn khách hàng.');
      return;
    }
    
    if (!date) {
      alert('Vui lòng chọn ngày.');
      return;
    }
    
    if (!startTime || !endTime) {
      alert('Vui lòng chọn thời gian.');
      return;
    }
    
    // Handle new customer if selected
    let customer = {
      id: customerId
    };
    
    if (customerId === 'new') {
      const customerName = document.getElementById('customerName').value;
      const customerPhone = document.getElementById('customerPhone').value;
      
      if (!customerName) {
        alert('Vui lòng nhập tên khách hàng mới.');
        return;
      }
      
      if (!customerPhone) {
        alert('Vui lòng nhập số điện thoại khách hàng mới.');
        return;
      }
      
      // In a real app, we would create a new customer via API
      // and get back the ID
      customer = {
        id: 'new',
        name: customerName,
        phone: customerPhone
      };
    }
    
    // Get selected services
    const selectedServices = [];
    const serviceCheckboxes = document.querySelectorAll('#servicesContainer input[type="checkbox"]:checked');
    
    serviceCheckboxes.forEach(checkbox => {
      const serviceId = checkbox.value;
      const quantity = document.getElementById(`quantity_${serviceId}`).value;
      
      selectedServices.push({
        serviceId,
        quantity
      });
    });
    
    // In a real app, we would submit to API
    console.log('Saving booking...');
    console.log({
      fieldId,
      customer,
      date,
      startTime,
      endTime,
      status,
      notes,
      services: selectedServices
    });
    
    // Simulate successful save
    alert('Đã lưu thông tin đặt sân thành công!');
    bookingModal.classList.remove('show');
    
    // Refresh the booking table
    fetchBookings();
  }
  
  // Fetch bookings
  function fetchBookings(dateFilter = '', fieldFilter = '', statusFilter = '') {
    const bookingsTable = document.querySelector('#bookingsTable tbody');
    
    if (!bookingsTable) return;
    
    // Show loading indicator
    bookingsTable.innerHTML = '<tr><td colspan="7" class="text-center">Đang tải dữ liệu...</td></tr>';
    
    // In a real app, we would fetch from API with filters
    console.log('Fetching bookings with filters:', { dateFilter, fieldFilter, statusFilter });
    
    // Simulate API delay
    setTimeout(() => {
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
        bookingsTable.innerHTML = '<tr><td colspan="7" class="text-center">Không tìm thấy dữ liệu phù hợp</td></tr>';
        return;
      }
      
      let html = '';
      filteredBookings.forEach(booking => {
        html += `
          <tr>
            <td>${booking.id}</td>
            <td>${booking.fieldName}</td>
            <td>${booking.customerName}<br><small>${booking.customerPhone}</small></td>
            <td>${formatDateDisplay(booking.date)}</td>
            <td>${booking.startTime} - ${booking.endTime}</td>
            <td><span class="status ${getStatusClass(booking.status)}">${getStatusText(booking.status)}</span></td>
            <td>${formatCurrency(booking.totalAmount)}</td>
            <td>
              <a href="#" class="action-btn view-booking" data-id="${booking.id}"><i class="fas fa-eye"></i></a>
              <a href="#" class="action-btn edit-booking" data-id="${booking.id}"><i class="fas fa-edit"></i></a>
            </td>
          </tr>
        `;
      });
      
      bookingsTable.innerHTML = html;
      
      // Add event listeners to view/edit buttons
      document.querySelectorAll('.view-booking').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const id = parseInt(this.getAttribute('data-id'));
          viewBooking(id);
        });
      });
      
      document.querySelectorAll('.edit-booking').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const id = parseInt(this.getAttribute('data-id'));
          editBooking(id);
        });
      });
    }, 500); // Simulate network delay
  }
  
  // View booking details
  function viewBooking(id) {
    console.log('Viewing booking:', id);
    const viewBookingModal = document.getElementById('viewBookingModal');
    
    // In a real app, we would fetch booking details from API
    // Simulate fetching booking by ID
    const getBookingData = () => {
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
      
      // Sample bookings
      const bookings = {
        101: { 
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
          notes: 'Khách hàng thường xuyên',
          services: [
            { id: 1, name: 'Nước uống', quantity: 10, price: 10000, subtotal: 100000 }
          ],
          paymentStatus: 'pending'
        },
        102: { 
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
          notes: '',
          services: [],
          paymentStatus: 'pending'
        },
        103: { 
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
          notes: 'Đặt sân đá giao lưu',
          services: [
            { id: 2, name: 'Áo thi đấu', quantity: 7, price: 50000, subtotal: 350000 },
            { id: 3, name: 'Trọng tài', quantity: 1, price: 200000, subtotal: 200000 }
          ],
          paymentStatus: 'pending'
        },
        104: { 
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
          notes: 'Đã thanh toán',
          services: [
            { id: 4, name: 'Quay video', quantity: 1, price: 300000, subtotal: 300000 }
          ],
          paymentStatus: 'paid'
        }
      };
      
      return bookings[id] || null;
    };
    
    const booking = getBookingData();
    
    if (!booking) {
      alert('Không tìm thấy thông tin đặt sân!');
      return;
    }
    
    // Populate view modal with booking details
    document.getElementById('viewBookingId').textContent = booking.id;
    document.getElementById('viewFieldName').textContent = booking.fieldName;
    document.getElementById('viewCustomerName').textContent = booking.customerName;
    document.getElementById('viewCustomerPhone').textContent = booking.customerPhone;
    document.getElementById('viewDate').textContent = formatDateDisplay(booking.date);
    document.getElementById('viewTime').textContent = `${booking.startTime} - ${booking.endTime}`;
    document.getElementById('viewStatus').textContent = getStatusText(booking.status);
    document.getElementById('viewNotes').textContent = booking.notes || '(Không có ghi chú)';
    
    // Add status class
    document.getElementById('viewStatus').className = getStatusClass(booking.status);
    
    // Calculate field rental cost (simplified calculation)
    const startHour = parseInt(booking.startTime.split(':')[0]);
    const endHour = parseInt(booking.endTime.split(':')[0]);
    const hoursBooked = endHour - startHour;
    
    let fieldPricePerHour = 0;
    switch (booking.fieldId) {
      case 1:
      case 2:
        fieldPricePerHour = 250000;
        break;
      case 3:
        fieldPricePerHour = 400000;
        break;
      case 4:
        fieldPricePerHour = 800000;
        break;
    }
    
    const fieldRentalCost = fieldPricePerHour * hoursBooked;
    
    // Populate services details
    const servicesContainer = document.getElementById('viewServices');
    let servicesHtml = '';
    
    if (booking.services && booking.services.length > 0) {
      booking.services.forEach(service => {
        servicesHtml += `
          <div class="service-detail-item">
            <div class="service-name">${service.name} x ${service.quantity}</div>
            <div class="service-price">${formatCurrency(service.subtotal)}</div>
          </div>
        `;
      });
    } else {
      servicesHtml = '<div class="no-services">Không có dịch vụ đi kèm</div>';
    }
    
    servicesContainer.innerHTML = servicesHtml;
    
    // Populate payment details
    document.getElementById('viewFieldRentalCost').textContent = formatCurrency(fieldRentalCost);
    
    // Calculate services total
    let servicesTotal = 0;
    if (booking.services) {
      booking.services.forEach(service => {
        servicesTotal += service.subtotal;
      });
    }
    
    document.getElementById('viewServicesTotal').textContent = formatCurrency(servicesTotal);
    document.getElementById('viewTotalAmount').textContent = formatCurrency(booking.totalAmount);
    
    // Show payment status
    const paymentStatusElement = document.getElementById('viewPaymentStatus');
    if (paymentStatusElement) {
      paymentStatusElement.textContent = booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán';
      paymentStatusElement.className = booking.paymentStatus === 'paid' ? 'status-success' : 'status-warning';
    }
    
    // Show the modal
    viewBookingModal.classList.add('show');
  }
  
  // Edit booking
  function editBooking(id) {
    console.log('Editing booking:', id);
    const bookingModal = document.getElementById('bookingModal');
    const modalTitle = bookingModal.querySelector('.modal-title');
    
    // In a real app, we would fetch booking details from API
    // Simulate fetching booking by ID
    const getBookingData = () => {
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
      
      // Sample bookings
      const bookings = {
        101: { 
          id: 101, 
          fieldId: 1, 
          customerId: 1, 
          date: todayFormatted, 
          startTime: '17:00', 
          endTime: '18:00', 
          status: 'confirmed', 
          notes: 'Khách hàng thường xuyên',
          services: [
            { id: 1, quantity: 10 }
          ]
        },
        102: { 
          id: 102, 
          fieldId: 2, 
          customerId: 2, 
          date: todayFormatted, 
          startTime: '18:00', 
          endTime: '19:00', 
          status: 'confirmed', 
          notes: '',
          services: []
        },
        103: { 
          id: 103, 
          fieldId: 3, 
          customerId: 3, 
          date: tomorrowFormatted, 
          startTime: '19:00', 
          endTime: '21:00', 
          status: 'pending', 
          notes: 'Đặt sân đá giao lưu',
          services: [
            { id: 2, quantity: 7 },
            { id: 3, quantity: 1 }
          ]
        },
        104: { 
          id: 104, 
          fieldId: 4, 
          customerId: 1, 
          date: yesterdayFormatted, 
          startTime: '16:00', 
          endTime: '18:00', 
          status: 'completed', 
          notes: 'Đã thanh toán',
          services: [
            { id: 4, quantity: 1 }
          ]
        }
      };
      
      return bookings[id] || null;
    };
    
    const booking = getBookingData();
    
    if (!booking) {
      alert('Không tìm thấy thông tin đặt sân!');
      return;
    }
    
    // Populate form with booking details
    document.getElementById('bookingId').value = booking.id;
    document.getElementById('fieldId').value = booking.fieldId;
    document.getElementById('customerId').value = booking.customerId;
    document.getElementById('date').value = booking.date;
    document.getElementById('notes').value = booking.notes || '';
    document.getElementById('status').value = booking.status;
    
    // Populate time options
    populateTimeOptions();
    
    // Set selected time
    document.getElementById('startTime').value = booking.startTime;
    updateEndTimeOptions(); // Update end time options based on start time
    document.getElementById('endTime').value = booking.endTime;
    
    // Set selected services
    const servicesContainer = document.getElementById('servicesContainer');
    if (servicesContainer && booking.services) {
      // Reset all checkboxes and quantities
      servicesContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
      
      servicesContainer.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = 1;
        input.disabled = true;
      });
      
      // Check selected services and set quantities
      booking.services.forEach(service => {
        const checkbox = document.getElementById(`service_${service.id}`);
        const quantityInput = document.getElementById(`quantity_${service.id}`);
        
        if (checkbox) {
          checkbox.checked = true;
        }
        
        if (quantityInput) {
          quantityInput.disabled = false;
          quantityInput.value = service.quantity;
        }
      });
    }
    
    // Hide new customer fields
    document.getElementById('newCustomerFields').style.display = 'none';
    
    // Set modal title
    if (modalTitle) modalTitle.textContent = 'Chỉnh sửa đặt sân';
    
    // Show the modal
    bookingModal.classList.add('show');
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