document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const staffTable = document.querySelector('#staffTable tbody');
  const shiftScheduleTable = document.querySelector('#shiftScheduleTable tbody');
  const newStaffBtn = document.getElementById('newStaffBtn');
  const staffModal = document.getElementById('staffModal');
  const viewStaffModal = document.getElementById('viewStaffModal');
  const cancelStaffBtn = document.getElementById('cancelStaffBtn');
  const saveStaffBtn = document.getElementById('saveStaffBtn');
  const closeViewStaffBtn = document.getElementById('closeViewStaffBtn');
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  const staffForm = document.getElementById('staffForm');
  const staffFilterBtn = document.getElementById('staffFilterBtn');
  const scheduleWeek = document.getElementById('scheduleWeek');
  const loadScheduleBtn = document.getElementById('loadScheduleBtn');
  const printScheduleBtn = document.getElementById('printScheduleBtn');
  
  // Fetch staff data
  fetchStaff();
  
  // Set current week as default for schedule
  if (scheduleWeek) {
    const now = new Date();
    const year = now.getFullYear();
    const weekNum = getWeekNumber(now);
    scheduleWeek.value = `${year}-W${weekNum.toString().padStart(2, '0')}`;
  }
  
  // Load shift schedule for default week
  loadShiftSchedule();
  
  // Initialize event listeners
  if (newStaffBtn) {
    newStaffBtn.addEventListener('click', function() {
      openAddStaffModal();
    });
  }
  
  if (cancelStaffBtn) {
    cancelStaffBtn.addEventListener('click', function() {
      staffModal.classList.remove('show');
    });
  }
  
  if (saveStaffBtn) {
    saveStaffBtn.addEventListener('click', function() {
      saveStaff();
    });
  }
  
  if (closeViewStaffBtn) {
    closeViewStaffBtn.addEventListener('click', function() {
      viewStaffModal.classList.remove('show');
    });
  }
  
  if (staffFilterBtn) {
    staffFilterBtn.addEventListener('click', function() {
      const nameFilter = document.getElementById('staffNameFilter').value;
      const roleFilter = document.getElementById('staffRoleFilter').value;
      fetchStaff(nameFilter, roleFilter);
    });
  }
  
  if (loadScheduleBtn) {
    loadScheduleBtn.addEventListener('click', function() {
      loadShiftSchedule();
    });
  }
  
  if (printScheduleBtn) {
    printScheduleBtn.addEventListener('click', function() {
      window.print();
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
  
  // Set up form events
  const roleSelect = document.getElementById('role');
  const passwordContainer = document.getElementById('passwordContainer');
  
  if (roleSelect && passwordContainer) {
    roleSelect.addEventListener('change', function() {
      // If admin role is selected, password is required
      const isAdmin = this.value === 'admin';
      document.getElementById('password').required = isAdmin;
      document.getElementById('confirmPassword').required = isAdmin;
    });
  }
  
  // Add event listener to customerType field
  const customerType = document.getElementById('customerType');
  const companyDetailsContainer = document.getElementById('companyDetailsContainer');
  
  if (customerType && companyDetailsContainer) {
    customerType.addEventListener('change', function() {
      if (this.value === 'company') {
        companyDetailsContainer.style.display = 'block';
      } else {
        companyDetailsContainer.style.display = 'none';
      }
    });
  }
});

// Open add staff modal
function openAddStaffModal() {
  const staffForm = document.getElementById('staffForm');
  const staffModal = document.getElementById('staffModal');
  const modalTitle = staffModal.querySelector('.modal-title');
  
  if (staffForm) staffForm.reset();
  
  // Set default values
  document.getElementById('status').value = 'active';
  
  // Set modal title
  if (modalTitle) modalTitle.textContent = 'Thêm nhân viên mới';
  
  // Show modal
  staffModal.classList.add('show');
}

// Save staff
function saveStaff() {
  const staffForm = document.getElementById('staffForm');
  const staffModal = document.getElementById('staffModal');
  
  // Get form data
  const fullName = document.getElementById('fullName').value;
  const role = document.getElementById('role').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const address = document.getElementById('address').value;
  const status = document.getElementById('status').value;
  const notes = document.getElementById('notes').value;
  
  // Basic validation
  if (!fullName) {
    alert('Vui lòng nhập họ và tên.');
    return;
  }
  
  if (!role) {
    alert('Vui lòng chọn vai trò.');
    return;
  }
  
  if (!email) {
    alert('Vui lòng nhập email.');
    return;
  }
  
  if (!phone) {
    alert('Vui lòng nhập số điện thoại.');
    return;
  }
  
  // Check if role is admin, password is required
  if (role === 'admin' && !password) {
    alert('Vui lòng nhập mật khẩu cho tài khoản quản trị viên.');
    return;
  }
  
  // Check if passwords match
  if (password && password !== confirmPassword) {
    alert('Mật khẩu xác nhận không khớp.');
    return;
  }
  
  // In a real app, we would submit to API
  console.log('Saving staff...');
  console.log({
    fullName,
    role,
    email,
    phone,
    password,
    address,
    status,
    notes
  });
  
  // Simulate successful save
  alert('Đã lưu thông tin nhân viên thành công!');
  staffModal.classList.remove('show');
  
  // Refresh the staff table
  fetchStaff();
}

// Fetch staff
function fetchStaff(nameFilter = '', roleFilter = '') {
  const staffTable = document.querySelector('#staffTable tbody');
  
  if (!staffTable) return;
  
  // Show loading indicator
  staffTable.innerHTML = '<tr><td colspan="7" class="text-center">Đang tải dữ liệu...</td></tr>';
  
  // In a real app, we would fetch from API with filters
  console.log('Fetching staff with filters:', { nameFilter, roleFilter });
  
  // Simulate API delay
  setTimeout(() => {
    // Simulate data (in a real app, this would come from the API)
    const staffList = [
      { 
        id: 1, 
        fullName: 'Nguyễn Văn Quản Lý', 
        role: 'admin', 
        email: 'admin@example.com', 
        phone: '0901234567', 
        address: 'Số 123, Đường ABC, Quận 1, TP HCM', 
        status: 'active', 
        notes: 'Quản lý chính' 
      },
      { 
        id: 2, 
        fullName: 'Trần Thị Nhân Viên', 
        role: 'staff', 
        email: 'staff@example.com', 
        phone: '0909876543', 
        address: 'Số 456, Đường XYZ, Quận 2, TP HCM', 
        status: 'active', 
        notes: 'Nhân viên đặt sân' 
      },
      { 
        id: 3, 
        fullName: 'Lê Văn Cũ', 
        role: 'staff', 
        email: 'former@example.com', 
        phone: '0905555555', 
        address: 'Số 789, Đường DEF, Quận 3, TP HCM', 
        status: 'inactive', 
        notes: 'Đã nghỉ việc' 
      }
    ];
    
    // Filter staff if filters are provided
    let filteredStaff = [...staffList];
    
    if (nameFilter) {
      filteredStaff = filteredStaff.filter(staff => 
        staff.fullName.toLowerCase().includes(nameFilter.toLowerCase()) || 
        staff.phone.includes(nameFilter)
      );
    }
    
    if (roleFilter) {
      filteredStaff = filteredStaff.filter(staff => staff.role === roleFilter);
    }
    
    // Populate table
    if (filteredStaff.length === 0) {
      staffTable.innerHTML = '<tr><td colspan="7" class="text-center">Không tìm thấy dữ liệu phù hợp</td></tr>';
      return;
    }
    
    let html = '';
    filteredStaff.forEach(staff => {
      html += `
        <tr>
          <td>${staff.id}</td>
          <td>${staff.fullName}</td>
          <td>${getRoleText(staff.role)}</td>
          <td>${staff.email}</td>
          <td>${staff.phone}</td>
          <td><span class="status ${getStatusClass(staff.status)}">${getStatusText(staff.status)}</span></td>
          <td>
            <a href="#" class="action-btn view-staff" data-id="${staff.id}"><i class="fas fa-eye"></i></a>
            <a href="#" class="action-btn edit-staff" data-id="${staff.id}"><i class="fas fa-edit"></i></a>
          </td>
        </tr>
      `;
    });
    
    staffTable.innerHTML = html;
    
    // Add event listeners to view/edit buttons
    document.querySelectorAll('.view-staff').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = parseInt(this.getAttribute('data-id'));
        viewStaff(id);
      });
    });
    
    document.querySelectorAll('.edit-staff').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = parseInt(this.getAttribute('data-id'));
        editStaff(id);
      });
    });
  }, 500); // Simulate network delay
}

// View staff details
function viewStaff(id) {
  console.log('Viewing staff:', id);
  const viewStaffModal = document.getElementById('viewStaffModal');
  
  // In a real app, we would fetch staff details from API
  // Simulate fetching staff by ID
  const staff = {
    id: id,
    fullName: id === 1 ? 'Nguyễn Văn Quản Lý' : (id === 2 ? 'Trần Thị Nhân Viên' : 'Lê Văn Cũ'),
    role: id === 1 ? 'admin' : 'staff',
    email: id === 1 ? 'admin@example.com' : (id === 2 ? 'staff@example.com' : 'former@example.com'),
    phone: id === 1 ? '0901234567' : (id === 2 ? '0909876543' : '0905555555'),
    address: id === 1 ? 'Số 123, Đường ABC, Quận 1, TP HCM' : (id === 2 ? 'Số 456, Đường XYZ, Quận 2, TP HCM' : 'Số 789, Đường DEF, Quận 3, TP HCM'),
    status: id === 3 ? 'inactive' : 'active',
    notes: id === 1 ? 'Quản lý chính' : (id === 2 ? 'Nhân viên đặt sân' : 'Đã nghỉ việc')
  };
  
  // Populate view modal with staff details
  document.getElementById('viewStaffId').textContent = staff.id;
  document.getElementById('viewFullName').textContent = staff.fullName;
  document.getElementById('viewRole').textContent = getRoleText(staff.role);
  document.getElementById('viewEmail').textContent = staff.email;
  document.getElementById('viewPhone').textContent = staff.phone;
  document.getElementById('viewAddress').textContent = staff.address || '(Không có)';
  document.getElementById('viewStatus').textContent = getStatusText(staff.status);
  document.getElementById('viewNotes').textContent = staff.notes || '(Không có ghi chú)';
  
  // Add status class
  document.getElementById('viewStatus').className = getStatusClass(staff.status);
  
  // Show the modal
  viewStaffModal.classList.add('show');
}

// Edit staff
function editStaff(id) {
  console.log('Editing staff:', id);
  const staffModal = document.getElementById('staffModal');
  const modalTitle = staffModal.querySelector('.modal-title');
  
  // In a real app, we would fetch staff details from API
  // Simulate fetching staff by ID
  const staff = {
    id: id,
    fullName: id === 1 ? 'Nguyễn Văn Quản Lý' : (id === 2 ? 'Trần Thị Nhân Viên' : 'Lê Văn Cũ'),
    role: id === 1 ? 'admin' : 'staff',
    email: id === 1 ? 'admin@example.com' : (id === 2 ? 'staff@example.com' : 'former@example.com'),
    phone: id === 1 ? '0901234567' : (id === 2 ? '0909876543' : '0905555555'),
    address: id === 1 ? 'Số 123, Đường ABC, Quận 1, TP HCM' : (id === 2 ? 'Số 456, Đường XYZ, Quận 2, TP HCM' : 'Số 789, Đường DEF, Quận 3, TP HCM'),
    status: id === 3 ? 'inactive' : 'active',
    notes: id === 1 ? 'Quản lý chính' : (id === 2 ? 'Nhân viên đặt sân' : 'Đã nghỉ việc')
  };
  
  // Populate form with staff details
  document.getElementById('staffId').value = staff.id;
  document.getElementById('fullName').value = staff.fullName;
  document.getElementById('role').value = staff.role;
  document.getElementById('email').value = staff.email;
  document.getElementById('phone').value = staff.phone;
  document.getElementById('address').value = staff.address || '';
  document.getElementById('status').value = staff.status;
  document.getElementById('notes').value = staff.notes || '';
  
  // Clear password fields
  document.getElementById('password').value = '';
  document.getElementById('confirmPassword').value = '';
  
  // Set modal title
  if (modalTitle) modalTitle.textContent = 'Chỉnh sửa nhân viên';
  
  // Show the modal
  staffModal.classList.add('show');
}

// Load shift schedule
function loadShiftSchedule() {
  const shiftScheduleTable = document.querySelector('#shiftScheduleTable tbody');
  const scheduleWeek = document.getElementById('scheduleWeek').value;
  
  if (!shiftScheduleTable) return;
  
  // Show loading indicator
  shiftScheduleTable.innerHTML = '<tr><td colspan="8" class="text-center">Đang tải lịch làm việc...</td></tr>';
  
  // In a real app, we would fetch from API with week filter
  console.log('Fetching shift schedule for week:', scheduleWeek);
  
  // Simulate API delay
  setTimeout(() => {
    // Simulate data (in a real app, this would come from the API)
    const staff = [
      { id: 1, name: 'Nguyễn Văn Quản Lý' },
      { id: 2, name: 'Trần Thị Nhân Viên' },
      { id: 3, name: 'Phạm Văn A' },
      { id: 4, name: 'Lê Thị B' }
    ];
    
    const shifts = {
      1: ['S', 'S', 'C', 'C', 'S', '', ''],
      2: ['C', 'C', 'S', 'S', 'C', 'S', ''],
      3: ['', 'S', 'S', 'C', 'C', 'C', 'S'],
      4: ['C', '', '', 'S', 'S', 'C', 'C']
    };
    
    // Populate table
    let html = '';
    staff.forEach(s => {
      const staffShifts = shifts[s.id] || Array(7).fill('');
      
      html += `
        <tr>
          <td>${s.name}</td>
          <td>${formatShift(staffShifts[0])}</td>
          <td>${formatShift(staffShifts[1])}</td>
          <td>${formatShift(staffShifts[2])}</td>
          <td>${formatShift(staffShifts[3])}</td>
          <td>${formatShift(staffShifts[4])}</td>
          <td>${formatShift(staffShifts[5])}</td>
          <td>${formatShift(staffShifts[6])}</td>
        </tr>
      `;
    });
    
    shiftScheduleTable.innerHTML = html;
  }, 500); // Simulate network delay
}

// Helper functions

// Get role text
function getRoleText(role) {
  const roleMap = {
    'admin': 'Quản trị viên',
    'manager': 'Quản lý',
    'staff': 'Nhân viên'
  };
  
  return roleMap[role] || 'Không xác định';
}

// Get status class
function getStatusClass(status) {
  const statusMap = {
    'active': 'status-success',
    'inactive': 'status-danger'
  };
  
  return statusMap[status] || '';
}

// Get status text
function getStatusText(status) {
  const statusMap = {
    'active': 'Đang làm việc',
    'inactive': 'Ngừng làm việc'
  };
  
  return statusMap[status] || 'Không xác định';
}

// Format shift
function formatShift(shift) {
  if (!shift) return '-';
  
  const shiftMap = {
    'S': '<span class="status status-success">Sáng</span>',
    'C': '<span class="status status-warning">Chiều</span>',
    'F': '<span class="status status-danger">Cả ngày</span>'
  };
  
  return shiftMap[shift] || shift;
}

// Get week number
function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  
  return weekNo;
}