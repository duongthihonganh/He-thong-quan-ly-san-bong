// Soccer Field Management System

// Common color constants for the entire application
const statusColorMap = {
  'available': '#28a745',  // Green
  'booked': '#ffc107',     // Yellow
  'maintenance': '#dc3545' // Red
};

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const fieldsTable = document.querySelector('#fieldsTable tbody');
  const newFieldBtn = document.getElementById('newFieldBtn');
  const mergeFieldsBtn = document.getElementById('mergeFieldsBtn');
  const fieldModal = document.getElementById('fieldModal');
  const mergeFieldsModal = document.getElementById('mergeFieldsModal');
  const fieldForm = document.getElementById('fieldForm');
  const fieldFilterBtn = document.getElementById('fieldFilterBtn');
  const fieldStatusDate = document.getElementById('fieldStatusDate');
  const fieldsStatusContainer = document.getElementById('fieldsStatus');
  
  // Initialize date picker with today's date if element exists
  if (fieldStatusDate) {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    fieldStatusDate.value = formattedDate;
  }
  
  // Initialize data from localStorage or create sample data if empty
  initializeData();
  
  // Load fields table and status display
  loadFieldsTable();
  updateFieldStatusDisplay();
  
  // Initialize event listeners
  if (newFieldBtn) {
    newFieldBtn.addEventListener('click', function() {
      openAddFieldModal();
    });
  }
  
  if (mergeFieldsBtn) {
    mergeFieldsBtn.addEventListener('click', function() {
      openMergeFieldsModal();
    });
  }
  
  if (fieldFilterBtn) {
    fieldFilterBtn.addEventListener('click', function() {
      const typeFilter = document.getElementById('fieldTypeFilter').value;
      const statusFilter = document.getElementById('fieldStatusFilter').value;
      loadFieldsTable(typeFilter, statusFilter);
    });
  }
  
  if (fieldStatusDate) {
    fieldStatusDate.addEventListener('change', function() {
      updateFieldStatusDisplay();
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
  
  // Field status change event listener
  const fieldStatus = document.getElementById('fieldStatus');
  if (fieldStatus) {
    fieldStatus.addEventListener('change', function() {
      toggleMaintenanceDetails(this.value === 'maintenance');
    });
  }
  
  // Save field button
  const saveFieldBtn = document.getElementById('saveFieldBtn');
  if (saveFieldBtn) {
    saveFieldBtn.addEventListener('click', saveField);
  }
  
  // Cancel field button
  const cancelFieldBtn = document.getElementById('cancelFieldBtn');
  if (cancelFieldBtn) {
    cancelFieldBtn.addEventListener('click', function() {
      fieldModal.classList.remove('show');
    });
  }
  
  // Save merge button
  const saveMergeBtn = document.getElementById('saveMergeBtn');
  if (saveMergeBtn) {
    saveMergeBtn.addEventListener('click', mergeFields);
  }
  
  // Cancel merge button
  const cancelMergeBtn = document.getElementById('cancelMergeBtn');
  if (cancelMergeBtn) {
    cancelMergeBtn.addEventListener('click', function() {
      mergeFieldsModal.classList.remove('show');
    });
  }
  
  // Add event listeners for edit and delete buttons
  document.addEventListener('click', function(e) {
    // Edit field button clicked
    if (e.target.closest('.edit-field')) {
      const button = e.target.closest('.edit-field');
      const fieldId = button.getAttribute('data-id');
      editField(fieldId);
      e.preventDefault();
    }
    
    // Delete field button clicked
    if (e.target.closest('.delete-field')) {
      const button = e.target.closest('.delete-field');
      const fieldId = button.getAttribute('data-id');
      deleteField(fieldId);
      e.preventDefault();
    }
  });
});

// Initialize data in localStorage
function initializeData() {
  // Check if fields data exists in localStorage
  if (!localStorage.getItem('soccerFields')) {
    // Sample fields data
    const sampleFields = [
      {
        id: 1,
        name: 'Sân A1',
        type: 'mini',
        size: '10m x 20m',
        quality: 'Tốt',
        pricePerHour: 300000,
        status: 'available',
        description: 'Sân mini chất lượng cao với cỏ nhân tạo',
        maintenanceInfo: null,
        isMerged: false,
        mergedFrom: null
      },
      {
        id: 2,
        name: 'Sân A2',
        type: 'mini',
        size: '10m x 20m',
        quality: 'Tốt',
        pricePerHour: 300000,
        status: 'available',
        description: 'Sân mini chất lượng cao với cỏ nhân tạo',
        maintenanceInfo: null,
        isMerged: false,
        mergedFrom: null
      },
      {
        id: 3,
        name: 'Sân B',
        type: 'medium',
        size: '20m x 40m',
        quality: 'Rất tốt',
        pricePerHour: 500000,
        status: 'booked',
        description: 'Sân 7 người với hệ thống đèn chiếu sáng mới',
        maintenanceInfo: null,
        isMerged: false,
        mergedFrom: null
      },
      {
        id: 4,
        name: 'Sân C',
        type: 'full',
        size: '40m x 80m',
        quality: 'Tốt',
        pricePerHour: 800000,
        status: 'maintenance',
        description: 'Sân 11 người tiêu chuẩn',
        maintenanceInfo: {
          reason: 'Thay cỏ nhân tạo mới',
          startDate: '2023-10-15',
          endDate: '2023-10-20',
          cost: 5000000
        },
        isMerged: false,
        mergedFrom: null
      }
    ];
    
    // Save to localStorage
    localStorage.setItem('soccerFields', JSON.stringify(sampleFields));
  }
  
  // Check if bookings data exists in localStorage
  if (!localStorage.getItem('bookings')) {
    // Get today's date for sample data
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Sample bookings data
    const sampleBookings = [
      {
        id: 1,
        fieldId: 3,
        date: formattedDate,
        startTime: '18:00',
        endTime: '20:00',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0901234567',
        totalAmount: 1000000,
        status: 'confirmed'
      }
    ];
    
    // Save to localStorage
    localStorage.setItem('bookings', JSON.stringify(sampleBookings));
  }
}

// Open add field modal
function openAddFieldModal() {
  const fieldForm = document.getElementById('fieldForm');
  const fieldModal = document.getElementById('fieldModal');
  const modalTitle = fieldModal.querySelector('.modal-title');
  
  if (fieldForm) fieldForm.reset();
  document.getElementById('fieldId').value = ''; // Clear hidden ID field
  
  // Set default values
  document.getElementById('fieldType').value = 'mini';
  document.getElementById('fieldQuality').value = 'Tốt';
  document.getElementById('fieldStatus').value = 'available';
  
  // Set modal title
  if (modalTitle) modalTitle.textContent = 'Thêm sân mới';
  
  // Hide maintenance details
  toggleMaintenanceDetails(false);
  
  // Show modal
  fieldModal.classList.add('show');
}

// Open edit field modal
function editField(fieldId) {
  const fields = JSON.parse(localStorage.getItem('soccerFields')) || [];
  const field = fields.find(f => f.id == fieldId);
  
  if (!field) {
    alert('Không tìm thấy thông tin sân!');
    return;
  }
  
  const fieldModal = document.getElementById('fieldModal');
  const modalTitle = fieldModal.querySelector('.modal-title');
  
  // Populate form fields
  document.getElementById('fieldId').value = field.id;
  document.getElementById('fieldName').value = field.name;
  document.getElementById('fieldType').value = field.type;
  document.getElementById('fieldSize').value = field.size;
  document.getElementById('fieldQuality').value = field.quality;
  document.getElementById('pricePerHour').value = field.pricePerHour;
  document.getElementById('fieldStatus').value = field.status;
  document.getElementById('fieldDescription').value = field.description || '';
  
  // Handle maintenance info
  toggleMaintenanceDetails(field.status === 'maintenance');
  
  if (field.maintenanceInfo) {
    document.getElementById('maintenanceReason').value = field.maintenanceInfo.reason || '';
    document.getElementById('maintenanceStartDate').value = field.maintenanceInfo.startDate || '';
    document.getElementById('maintenanceEndDate').value = field.maintenanceInfo.endDate || '';
    document.getElementById('maintenanceCost').value = field.maintenanceInfo.cost || '';
  } else {
    document.getElementById('maintenanceReason').value = '';
    document.getElementById('maintenanceStartDate').value = '';
    document.getElementById('maintenanceEndDate').value = '';
    document.getElementById('maintenanceCost').value = '';
  }
  
  // Set modal title
  if (modalTitle) modalTitle.textContent = 'Chỉnh sửa sân';
  
  // Show modal
  fieldModal.classList.add('show');
}

// Open merge fields modal
function openMergeFieldsModal() {
  const fields = JSON.parse(localStorage.getItem('soccerFields')) || [];
  const mergeFieldsModal = document.getElementById('mergeFieldsModal');
  const mergeFieldsList = document.getElementById('mergeFieldsList');
  
  // Filter available mini fields (not merged and available)
  const availableFields = fields.filter(field => 
    field.type === 'mini' && field.status === 'available' && !field.isMerged
  );
  
  if (availableFields.length < 2) {
    alert('Cần ít nhất 2 sân mini trống để ghép sân!');
    return;
  }
  
  // Clear previous list
  mergeFieldsList.innerHTML = '';
  
  // Create checkboxes for each available field
  availableFields.forEach(field => {
    const fieldItem = document.createElement('div');
    fieldItem.className = 'form-row';
    
    fieldItem.innerHTML = `
      <div class="form-group" style="display: flex; align-items: center; margin-bottom: 10px;">
        <input type="checkbox" id="merge_${field.id}" name="mergeFields" value="${field.id}" style="margin-right: 10px; width: auto;">
        <label for="merge_${field.id}">${field.name} (${field.size})</label>
      </div>
    `;
    
    mergeFieldsList.appendChild(fieldItem);
  });
  
  // Set default name for merged field
  document.getElementById('mergedFieldName').value = 'Sân Ghép';
  
  // Show modal
  mergeFieldsModal.classList.add('show');
}

// Toggle maintenance details visibility
function toggleMaintenanceDetails(show) {
  const maintenanceDetailsContainer = document.getElementById('maintenanceDetailsContainer');
  if (maintenanceDetailsContainer) {
    maintenanceDetailsContainer.style.display = show ? 'block' : 'none';
  }
}

// Save field (add new or update existing)
function saveField() {
  const fields = JSON.parse(localStorage.getItem('soccerFields')) || [];
  const fieldId = document.getElementById('fieldId').value;
  const isEditMode = fieldId !== '';
  
  // Get form data
  const fieldData = {
    name: document.getElementById('fieldName').value,
    type: document.getElementById('fieldType').value,
    size: document.getElementById('fieldSize').value,
    quality: document.getElementById('fieldQuality').value,
    pricePerHour: parseInt(document.getElementById('pricePerHour').value),
    status: document.getElementById('fieldStatus').value,
    description: document.getElementById('fieldDescription').value,
    maintenanceInfo: null,
    isMerged: false,
    mergedFrom: null
  };
  
  // Validate required fields
  if (!fieldData.name) {
    alert('Vui lòng nhập tên sân');
    return;
  }
  
  if (!fieldData.size) {
    alert('Vui lòng nhập kích thước sân');
    return;
  }
  
  if (isNaN(fieldData.pricePerHour) || fieldData.pricePerHour <= 0) {
    alert('Vui lòng nhập giá thuê hợp lệ');
    return;
  }
  
  // Add maintenance info if status is maintenance
  if (fieldData.status === 'maintenance') {
    fieldData.maintenanceInfo = {
      reason: document.getElementById('maintenanceReason').value,
      startDate: document.getElementById('maintenanceStartDate').value,
      endDate: document.getElementById('maintenanceEndDate').value,
      cost: parseInt(document.getElementById('maintenanceCost').value) || 0
    };
    
    // Validate maintenance info
    if (!fieldData.maintenanceInfo.reason) {
      alert('Vui lòng nhập lý do bảo trì');
      return;
    }
    
    if (!fieldData.maintenanceInfo.startDate) {
      alert('Vui lòng chọn ngày bắt đầu bảo trì');
      return;
    }
  }
  
  if (isEditMode) {
    // Update existing field
    const index = fields.findIndex(field => field.id == fieldId);
    if (index !== -1) {
      // Preserve merged info if it was a merged field
      if (fields[index].isMerged) {
        fieldData.isMerged = fields[index].isMerged;
        fieldData.mergedFrom = fields[index].mergedFrom;
      }
      
      fieldData.id = parseInt(fieldId);
      fields[index] = fieldData;
    }
  } else {
    // Add new field with next available ID
    const maxId = fields.length > 0 ? Math.max(...fields.map(field => field.id)) : 0;
    fieldData.id = maxId + 1;
    fields.push(fieldData);
  }
  
  // Save to localStorage
  localStorage.setItem('soccerFields', JSON.stringify(fields));
  
  // Close modal
  const fieldModal = document.getElementById('fieldModal');
  fieldModal.classList.remove('show');
  
  // Reload table and update status display
  loadFieldsTable();
  updateFieldStatusDisplay();
  
  // Show success message
  alert(isEditMode ? 'Cập nhật sân thành công!' : 'Thêm sân mới thành công!');
}

// Merge fields
function mergeFields() {
  const fields = JSON.parse(localStorage.getItem('soccerFields')) || [];
  
  // Get selected field IDs
  const selectedFieldIds = Array.from(
    document.querySelectorAll('input[name="mergeFields"]:checked')
  ).map(checkbox => parseInt(checkbox.value));
  
  // Validate selection
  if (selectedFieldIds.length < 2) {
    alert('Vui lòng chọn ít nhất 2 sân để ghép');
    return;
  }
  
  if (selectedFieldIds.length > 4) {
    alert('Chỉ được ghép tối đa 4 sân');
    return;
  }
  
  // Get merged field name
  const mergedFieldName = document.getElementById('mergedFieldName').value;
  if (!mergedFieldName) {
    alert('Vui lòng nhập tên cho sân ghép');
    return;
  }
  
  // Get selected fields
  const selectedFields = fields.filter(field => selectedFieldIds.includes(field.id));
  
  // Calculate new field properties based on number of merged fields
  let newType, newSize;
  if (selectedFieldIds.length === 2) {
    newType = 'medium';
    newSize = '20m x 40m';
  } else {
    newType = 'full';
    newSize = '40m x 80m';
  }
  
  // Calculate average price and multiply by number of fields
  const averagePrice = Math.round(
    selectedFields.reduce((sum, field) => sum + field.pricePerHour, 0) / selectedFields.length
  );
  const newPrice = averagePrice * selectedFieldIds.length;
  
  // Create new merged field
  const maxId = Math.max(...fields.map(field => field.id));
  const newField = {
    id: maxId + 1,
    name: mergedFieldName,
    type: newType,
    size: newSize,
    quality: selectedFields[0].quality, // Use quality from first field
    pricePerHour: newPrice,
    status: 'available',
    description: `Sân được ghép từ: ${selectedFields.map(f => f.name).join(', ')}`,
    maintenanceInfo: null,
    isMerged: true,
    mergedFrom: selectedFieldIds
  };
  
  // Update original fields to be in maintenance and marked as merged
  selectedFields.forEach(field => {
    const index = fields.findIndex(f => f.id === field.id);
    if (index !== -1) {
      fields[index].status = 'maintenance';
      fields[index].isMerged = true;
      fields[index].maintenanceInfo = {
        reason: `Đã ghép vào sân ${mergedFieldName}`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        cost: 0
      };
    }
  });
  
  // Add new merged field
  fields.push(newField);
  
  // Save to localStorage
  localStorage.setItem('soccerFields', JSON.stringify(fields));
  
  // Close modal
  const mergeFieldsModal = document.getElementById('mergeFieldsModal');
  mergeFieldsModal.classList.remove('show');
  
  // Reload table and update status display
  loadFieldsTable();
  updateFieldStatusDisplay();
  
  // Show success message
  alert(`Ghép sân thành công! Đã tạo "${mergedFieldName}"`);
}

// Delete field
function deleteField(fieldId) {
  const fields = JSON.parse(localStorage.getItem('soccerFields')) || [];
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  
  // Find field
  const field = fields.find(f => f.id == fieldId);
  if (!field) {
    alert('Không tìm thấy thông tin sân!');
    return;
  }
  
  // Confirm deletion
  if (!confirm(`Bạn có chắc muốn xóa sân "${field.name}"?`)) {
    return;
  }
  
  // Check if field has any bookings
  const hasBookings = bookings.some(booking => booking.fieldId == fieldId);
  if (hasBookings) {
    alert('Không thể xóa sân này vì đã có lịch đặt sân liên quan.');
    return;
  }
  
  // Handle merged field case
  if (field.isMerged && field.mergedFrom) {
    // If deleting a merged field, restore the original fields
    field.mergedFrom.forEach(originalId => {
      const originalFieldIndex = fields.findIndex(f => f.id == originalId);
      if (originalFieldIndex !== -1) {
        fields[originalFieldIndex].status = 'available';
        fields[originalFieldIndex].isMerged = false;
        fields[originalFieldIndex].maintenanceInfo = null;
      }
    });
  }
  
  // Remove field from array
  const updatedFields = fields.filter(f => f.id != fieldId);
  
  // Save to localStorage
  localStorage.setItem('soccerFields', JSON.stringify(updatedFields));
  
  // Reload table and update status display
  loadFieldsTable();
  updateFieldStatusDisplay();
  
  // Show success message
  alert('Đã xóa sân thành công!');
}

// Load fields table with optional filters
function loadFieldsTable(typeFilter = '', statusFilter = '') {
  const fieldsTable = document.querySelector('#fieldsTable tbody');
  if (!fieldsTable) return;
  
  // Show loading indicator
  fieldsTable.innerHTML = '<tr><td colspan="8" class="text-center">Đang tải dữ liệu...</td></tr>';
  
  // Get fields from localStorage
  let fields = JSON.parse(localStorage.getItem('soccerFields')) || [];
  
  // Apply filters if provided
  if (typeFilter) {
    fields = fields.filter(field => field.type === typeFilter);
  }
  
  if (statusFilter) {
    fields = fields.filter(field => field.status === statusFilter);
  }
  
  // Clear table
  fieldsTable.innerHTML = '';
  
  // Check if no fields
  if (fields.length === 0) {
    fieldsTable.innerHTML = '<tr><td colspan="8" class="text-center">Không có dữ liệu sân bóng</td></tr>';
    return;
  }
  
  // Populate table
  fields.forEach(field => {
    const row = document.createElement('tr');
    
    // Map status to display text
    const statusMap = {
      'available': 'Trống',
      'booked': 'Đã đặt',
      'maintenance': 'Bảo trì'
    };
    
    // Map status to CSS class
    const statusClassMap = {
      'available': 'status-available',
      'booked': 'status-booked',
      'maintenance': 'status-maintenance'
    };
    
    // Sử dụng statusColorMap toàn cục từ đầu file
    
    // Map field type to display text
    const typeMap = {
      'mini': 'Sân mini',
      'medium': 'Sân 7 người',
      'full': 'Sân 11 người'
    };
    
    row.innerHTML = `
      <td>${field.id}</td>
      <td>${field.name}</td>
      <td>${typeMap[field.type] || field.type}</td>
      <td>${field.size}</td>
      <td>${field.quality}</td>
      <td>${formatCurrency(field.pricePerHour)}</td>
      <td>
        <span class="status-badge" style="background-color: ${statusColorMap[field.status]}; color: ${field.status === 'booked' ? '#212529' : '#ffffff'}; font-weight: bold; padding: 5px 10px; border-radius: 20px;">
          ${statusMap[field.status] || 'Không xác định'}
        </span>
      </td>
      <td>
        <button class="btn btn-outline edit-field" data-id="${field.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-danger delete-field" data-id="${field.id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    fieldsTable.appendChild(row);
  });
}

// Update field status display for the selected date
function updateFieldStatusDisplay() {
  const fieldsStatusContainer = document.getElementById('fieldsStatus');
  const fieldStatusDate = document.getElementById('fieldStatusDate');
  
  if (!fieldsStatusContainer || !fieldStatusDate) return;
  
  const selectedDate = fieldStatusDate.value;
  fieldsStatusContainer.innerHTML = '<div class="text-center">Đang tải dữ liệu...</div>';
  
  // Get fields and bookings
  const fields = JSON.parse(localStorage.getItem('soccerFields')) || [];
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  
  // Check if no fields
  if (fields.length === 0) {
    fieldsStatusContainer.innerHTML = '<div class="text-center">Không có dữ liệu sân bóng</div>';
    return;
  }
  
  // Clear container
  fieldsStatusContainer.innerHTML = '';
  
  // Filter bookings for selected date
  const dateBookings = bookings.filter(booking => booking.date === selectedDate);
  
  // Create status card for each field
  fields.forEach(field => {
    // Filter bookings for this field
    const fieldBookings = dateBookings.filter(booking => booking.fieldId == field.id);
    
    // Create the card
    const card = document.createElement('div');
    card.className = 'field-status-card';
    
    // Determine field status for this day
    let fieldStatus = field.status;
    
    // If field is in maintenance, check if the maintenance period includes the selected date
    if (field.status === 'maintenance' && field.maintenanceInfo) {
      const maintenanceStart = new Date(field.maintenanceInfo.startDate);
      const maintenanceEnd = field.maintenanceInfo.endDate ? new Date(field.maintenanceInfo.endDate) : null;
      const selectedDateObj = new Date(selectedDate);
      
      // Set to available if the selected date is outside the maintenance period
      if (selectedDateObj < maintenanceStart || (maintenanceEnd && selectedDateObj > maintenanceEnd)) {
        fieldStatus = 'available';
      }
    }
    
    // Status text map
    const statusTextMap = {
      'available': 'Trống',
      'booked': 'Đã đặt',
      'maintenance': 'Bảo trì'
    };
    
    // Status header class map with direct color values
    const headerClassMap = {
      'available': 'bg-success',
      'booked': 'bg-warning',
      'maintenance': 'bg-danger'
    };
    
    
    // Type text map
    const typeTextMap = {
      'mini': 'Sân mini',
      'medium': 'Sân 7 người',
      'full': 'Sân 11 người'
    };
    
    // Create card HTML
    let cardHTML = `
      <div class="card-header ${headerClassMap[fieldStatus] || ''}" style="color: white;">
        ${field.name}
      </div>
      <div class="card-body">
        <p><strong>Loại:</strong> ${typeTextMap[field.type] || field.type}</p>
        <p><strong>Kích thước:</strong> ${field.size}</p>
        <p><strong>Giá/giờ:</strong> ${formatCurrency(field.pricePerHour)}</p>
        <p><strong>Trạng thái:</strong> 
          <span class="status-badge" style="background-color: ${statusColorMap[fieldStatus]}; color: ${fieldStatus === 'booked' ? '#212529' : '#ffffff'}; font-weight: bold; padding: 5px 10px; border-radius: 20px; display: inline-block; margin-left: 5px;">
            ${statusTextMap[fieldStatus] || 'Không xác định'}
          </span>
        </p>
    `;
    
    // Only show booking timeline if field is not in maintenance
    if (fieldStatus !== 'maintenance') {
      cardHTML += `<div style="margin-top: 10px;"><strong>Lịch đặt:</strong></div>`;
      
      // Create time slots from 6:00 to 22:00
      const timeSlots = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      
      cardHTML += '<div class="field-timeline" style="display: flex; margin-top: 8px;">';
      
      for (let i = 0; i < timeSlots.length - 1; i++) {
        const startTime = timeSlots[i];
        const endTime = timeSlots[i + 1];
        
        // Check if this time slot has a booking
        const slotBooked = fieldBookings.some(booking => {
          return booking.startTime <= startTime && booking.endTime >= endTime;
        });
        
        const slotColor = slotBooked ? statusColorMap['booked'] : statusColorMap['available'];
        
        cardHTML += `
          <div class="time-slot" style="
            flex: 1; 
            height: 30px; 
            background-color: ${slotColor}; 
            margin-right: 2px;
            position: relative;
            border-radius: 2px;
          " title="${startTime} - ${endTime}">
            <span style="
              position: absolute;
              bottom: -18px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 10px;
            ">${startTime}</span>
          </div>
        `;
      }
      
      cardHTML += '</div>';
    }
    
    cardHTML += '</div>';
    
    card.innerHTML = cardHTML;
    fieldsStatusContainer.appendChild(card);
  });
}

// Format currency helper function
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}
