document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html';
      return;
    }
    
    // Khởi tạo dữ liệu người dùng từ localStorage
    initUserInfo();
    
    // Khởi tạo các sự kiện
    setupEventListeners();
    
    // Tải trang mặc định (dashboard)
    loadPage('dashboard');
    
    // Kiểm tra token hợp lệ
    validateToken();
    
    // Các biến và hàm toàn cục cho ứng dụng
    window.app = {
      currentPage: 'dashboard',
      userData: getUserData(),
      api: {
        get: apiGet,
        post: apiPost,
        put: apiPut,
        delete: apiDelete
      },
      utils: {
        formatDate,
        formatCurrency,
        showModal,
        hideModal,
        showMessage
      }
    };
    
    // Khởi tạo thông tin người dùng
    function initUserInfo() {
      const userData = getUserData();
      if (userData) {
        document.getElementById('userName').textContent = userData.fullName;
        document.getElementById('userRole').textContent = getVietnameseRole(userData.role);
        // Set first letter of name as avatar text
        const avatarElement = document.getElementById('userAvatar');
        avatarElement.innerHTML = userData.fullName.charAt(0).toUpperCase();
      }
    }
    
    // Lấy dữ liệu người dùng từ localStorage
    function getUserData() {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    }
    
    // Thiết lập các sự kiện
    function setupEventListeners() {
      // Toggle dropdown menu
      const userAvatar = document.getElementById('userAvatar');
      const userDropdown = document.getElementById('userDropdown');
      
      userAvatar.addEventListener('click', function() {
        userDropdown.classList.toggle('show');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.remove('show');
        }
      });
      
      // Xử lý đăng xuất
      document.getElementById('logoutBtn').addEventListener('click', logout);
      
      // Xử lý chuyển trang
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach(item => {
        item.addEventListener('click', function() {
          const page = this.getAttribute('data-page');
          loadPage(page);
          
          // Cập nhật trạng thái active
          navItems.forEach(navItem => navItem.classList.remove('active'));
          this.classList.add('active');
        });
      });
    }
    
    // Hàm kiểm tra token
    async function validateToken() {
      try {
        const result = await apiGet('/auth/me');
        if (!result) {
          logout();
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        logout();
      }
    }
    
    // Hàm đăng xuất
    function logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login.html';
    }
    
    // Hàm tải nội dung trang
    async function loadPage(pageName) {
      const contentContainer = document.getElementById('pageContent');
      window.app.currentPage = pageName;
      
      // Hiển thị loading
      contentContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      `;
      
      try {
        // Load page content based on page name
        switch (pageName) {
          case 'dashboard':
            await loadDashboardPage(contentContainer);
            break;
          case 'bookings':
            await loadBookingsPage(contentContainer);
            break;
          case 'fields':
            await loadFieldsPage(contentContainer);
            break;
          case 'customers':
            await loadCustomersPage(contentContainer);
            break;
          case 'services':
            await loadServicesPage(contentContainer);
            break;
          case 'payments':
            await loadPaymentsPage(contentContainer);
            break;
          case 'reports':
            await loadReportsPage(contentContainer);
            break;
          case 'staff':
            await loadStaffPage(contentContainer);
            break;
          default:
            contentContainer.innerHTML = '<div class="page-error">Trang không tồn tại</div>';
        }
      } catch (error) {
        console.error(`Lỗi khi tải trang ${pageName}:`, error);
        contentContainer.innerHTML = `
          <div class="page-error">
            <h2>Lỗi khi tải trang</h2>
            <p>${error.message || 'Không thể tải nội dung trang. Vui lòng thử lại sau.'}</p>
          </div>
        `;
      }
    }
    
    // API request helpers
    async function apiGet(endpoint) {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
        }
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    }
    
    async function apiPost(endpoint, data) {
      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }
      
      return await response.json();
    }
    
    async function apiPut(endpoint, data) {
      const response = await fetch(`/api${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }
      
      return await response.json();
    }
    
    async function apiDelete(endpoint) {
      const response = await fetch(`/api${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
        }
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    }
    
    // Utility functions
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    }
    
    function formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    }
    
    function getVietnameseRole(role) {
      switch (role) {
        case 'admin':
          return 'Quản trị viên';
        case 'manager':
          return 'Quản lý';
        case 'staff':
          return 'Nhân viên';
        default:
          return role;
      }
    }
    
    // Modal functions
    function showModal(title, content, onConfirm = null) {
      const modalBackdrop = document.getElementById('modalBackdrop');
      const modalContainer = document.getElementById('modalContainer');
      
      modalContainer.innerHTML = `
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-cancel">Hủy</button>
          ${onConfirm ? '<button class="btn btn-primary modal-confirm">Xác nhận</button>' : ''}
        </div>
      `;
      
      // Add event listeners
      modalContainer.querySelector('.close-modal').addEventListener('click', hideModal);
      modalContainer.querySelector('.modal-cancel').addEventListener('click', hideModal);
      
      if (onConfirm) {
        modalContainer.querySelector('.modal-confirm').addEventListener('click', () => {
          onConfirm();
          hideModal();
        });
      }
      
      // Show modal
      modalBackdrop.classList.add('show');
    }
    
    function hideModal() {
      const modalBackdrop = document.getElementById('modalBackdrop');
      modalBackdrop.classList.remove('show');
    }
    
    function showMessage(message, type = 'info') {
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = `message message-${type}`;
      messageElement.textContent = message;
      
      // Add to document
      document.body.appendChild(messageElement);
      
      // Show and then hide after 3 seconds
      setTimeout(() => {
        messageElement.classList.add('show');
        
        setTimeout(() => {
          messageElement.classList.remove('show');
          setTimeout(() => {
            document.body.removeChild(messageElement);
          }, 300);
        }, 3000);
      }, 100);
    }
    
    // Page load functions - sẽ được triển khai chi tiết trong các phiên bản tiếp theo
    async function loadDashboardPage(container) {
      container.innerHTML = `
        <div class="page-title">
          <h1>Tổng quan</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Trang chủ</span>
            <span class="breadcrumb-item">Tổng quan</span>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Đặt sân hôm nay</div>
            <div class="stat-value">0</div>
            <div class="stat-description">Tổng số đặt sân trong ngày</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-title">Doanh thu hôm nay</div>
            <div class="stat-value">0 ₫</div>
            <div class="stat-description">Tổng doanh thu trong ngày</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-title">Khách hàng mới</div>
            <div class="stat-value">0</div>
            <div class="stat-description">Khách hàng mới trong 30 ngày</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-title">Sân đang bảo trì</div>
            <div class="stat-value">0</div>
            <div class="stat-description">Số sân đang trong thời gian bảo trì</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Lịch đặt sân hôm nay</h2>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Sân</th>
                    <th>Khách hàng</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="5" style="text-align: center;">Chưa có dữ liệu</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
      
      try {
        // Tải dữ liệu tổng quan từ API
        const summaryData = await apiGet('/summary');
        
        // Cập nhật thống kê
        if (summaryData) {
          const statValues = container.querySelectorAll('.stat-value');
          statValues[0].textContent = summaryData.todayBookings || '0';
          statValues[1].textContent = formatCurrency(summaryData.todayRevenue || 0);
          statValues[2].textContent = summaryData.newCustomers || '0';
          statValues[3].textContent = summaryData.fieldsInMaintenance || '0';
        }
        
        // Tải danh sách đặt sân hôm nay
        const today = new Date().toISOString().split('T')[0];
        const bookingsData = await apiGet(`/bookings?date=${today}`);
        
        if (bookingsData && bookingsData.length > 0) {
          const bookingsTable = container.querySelector('tbody');
          bookingsTable.innerHTML = '';
          
          bookingsData.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${booking.fieldName || `Sân ${booking.fieldId}`}</td>
              <td>${booking.customerName} (${booking.customerPhone})</td>
              <td>${booking.startTime} - ${booking.endTime}</td>
              <td>
                <span class="badge ${getBadgeClass(booking.status)}">
                  ${getStatusText(booking.status)}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button title="Xem chi tiết" data-id="${booking.id}">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button title="Thanh toán" data-id="${booking.id}">
                    <i class="fas fa-money-bill"></i>
                  </button>
                </div>
              </td>
            `;
            
            bookingsTable.appendChild(row);
          });
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu tổng quan:', error);
      }
    }
    
    async function loadBookingsPage(container) {
      container.innerHTML = `
        <div class="page-title">
          <h1>Quản lý đặt sân</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Trang chủ</span>
            <span class="breadcrumb-item">Quản lý đặt sân</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Danh sách đặt sân</h2>
            <button class="btn btn-primary">Thêm mới</button>
          </div>
          <div class="card-body">
            <p>Chức năng đang được phát triển...</p>
          </div>
        </div>
      `;
    }
    
    async function loadFieldsPage(container) {
      container.innerHTML = `
        <div class="page-title">
          <h1>Quản lý sân bóng</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Trang chủ</span>
            <span class="breadcrumb-item">Quản lý sân bóng</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Danh sách sân bóng</h2>
            <button class="btn btn-primary">Thêm mới</button>
          </div>
          <div class="card-body">
            <p>Chức năng đang được phát triển...</p>
          </div>
        </div>
      `;
    }
    
    async function loadCustomersPage(container) {
      container.innerHTML = `
        <div class="page-title">
          <h1>Quản lý khách hàng</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Trang chủ</span>
            <span class="breadcrumb-item">Quản lý khách hàng</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Danh sách khách hàng</h2>
            <button class="btn btn-primary">Thêm mới</button>
          </div>
          <div class="card-body">
            <p>Chức năng đang được phát triển...</p>
          </div>
        </div>
      `;
    }
    
    async function loadServicesPage(container) {
      container.innerHTML = `
        <div class="page-title">
          <h1>Quản lý dịch vụ</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Trang chủ</span>
            <span class="breadcrumb-item">Quản lý dịch vụ</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Danh sách dịch vụ</h2>
            <button class="btn btn-primary">Thêm mới</button>
          </div>
          <div class="card-body">
            <p>Chức năng đang được phát triển...</p>
          </div>
        </div>
      `;
    }
    
    async function loadPaymentsPage(container) {
      container.innerHTML = `
        <div class="page-title">
          <h1>Quản lý thanh toán</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Trang chủ</span>
            <span class="breadcrumb-item">Quản lý thanh toán</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Danh sách thanh toán</h2>
          </div>
          <div class="card-body">
            <p>Chức năng đang được phát triển...</p>
          </div>
        </div>
      `;
    }
    
    async function loadReportsPage(container) {
      container.innerHTML = `
        <div class="page-title">
          <h1>Báo cáo doanh thu</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Trang chủ</span>
            <span class="breadcrumb-item">Báo cáo doanh thu</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Báo cáo doanh thu</h2>
          </div>
          <div class="card-body">
            <p>Chức năng đang được phát triển...</p>
          </div>
        </div>
      `;
    }
    
    async function loadStaffPage(container) {
      container.innerHTML = `
        <div class="page-title">
          <h1>Quản lý nhân viên</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Trang chủ</span>
            <span class="breadcrumb-item">Quản lý nhân viên</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Danh sách nhân viên</h2>
            <button class="btn btn-primary" id="addStaffBtn">Thêm mới</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Tên đăng nhập</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody id="staffTableBody">
                  <tr>
                    <td colspan="7" class="text-center">Đang tải dữ liệu...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
      
      try {
        // Tải danh sách nhân viên
        const staffData = await apiGet('/staff');
        
        if (staffData && staffData.length > 0) {
          const staffTableBody = document.getElementById('staffTableBody');
          staffTableBody.innerHTML = '';
          
          staffData.forEach(staff => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${staff.id}</td>
              <td>${staff.fullName}</td>
              <td>${staff.username}</td>
              <td>${staff.phone}</td>
              <td>${getVietnameseRole(staff.role)}</td>
              <td>
                <span class="badge ${staff.status === 'active' ? 'badge-success' : 'badge-error'}">
                  ${staff.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button title="Chỉnh sửa" data-id="${staff.id}" class="edit-staff-btn">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button title="${staff.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}" data-id="${staff.id}" class="toggle-staff-status-btn">
                    <i class="fas ${staff.status === 'active' ? 'fa-lock' : 'fa-unlock'}"></i>
                  </button>
                </div>
              </td>
            `;
            
            staffTableBody.appendChild(row);
          });
          
          // Add event listeners for staff actions
          document.querySelectorAll('.edit-staff-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              const staffId = this.getAttribute('data-id');
              editStaff(staffId);
            });
          });
          
          document.querySelectorAll('.toggle-staff-status-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              const staffId = this.getAttribute('data-id');
              toggleStaffStatus(staffId);
            });
          });
        } else {
          const staffTableBody = document.getElementById('staffTableBody');
          staffTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có dữ liệu nhân viên</td></tr>';
        }
        
        // Add event for add staff button
        document.getElementById('addStaffBtn').addEventListener('click', showAddStaffModal);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu nhân viên:', error);
        const staffTableBody = document.getElementById('staffTableBody');
        staffTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Lỗi khi tải dữ liệu: ${error.message}</td></tr>`;
      }
    }
    
    // Helper functions
    function getBadgeClass(status) {
      switch (status) {
        case 'confirmed':
          return 'badge-success';
        case 'pending':
          return 'badge-warning';
        case 'cancelled':
          return 'badge-error';
        case 'completed':
          return 'badge-info';
        default:
          return 'badge-info';
      }
    }
    
    function getStatusText(status) {
      switch (status) {
        case 'confirmed':
          return 'Đã xác nhận';
        case 'pending':
          return 'Chờ xác nhận';
        case 'cancelled':
          return 'Đã hủy';
        case 'completed':
          return 'Hoàn thành';
        default:
          return status;
      }
    }
    
    // Staff management functions
    function showAddStaffModal() {
      const modalContent = `
        <form id="addStaffForm">
          <div class="form-group">
            <label for="fullName">Họ tên</label>
            <input type="text" id="fullName" name="fullName" required>
          </div>
          <div class="form-group">
            <label for="username">Tên đăng nhập</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Mật khẩu</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div class="form-group">
            <label for="phone">Số điện thoại</label>
            <input type="tel" id="phone" name="phone" required>
          </div>
          <div class="form-group">
            <label for="role">Vai trò</label>
            <select id="role" name="role" required>
              <option value="staff">Nhân viên</option>
              <option value="manager">Quản lý</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
        </form>
      `;
      
      showModal('Thêm nhân viên mới', modalContent, async () => {
        const form = document.getElementById('addStaffForm');
        
        const formData = {
          fullName: form.fullName.value,
          username: form.username.value,
          password: form.password.value,
          phone: form.phone.value,
          role: form.role.value,
          status: 'active'
        };
        
        try {
          await apiPost('/staff', formData);
          showMessage('Thêm nhân viên thành công', 'success');
          loadPage('staff'); // Reload staff page
        } catch (error) {
          showMessage(`Lỗi: ${error.message}`, 'error');
        }
      });
    }
    
    function editStaff(staffId) {
      showMessage('Chức năng chỉnh sửa nhân viên đang được phát triển', 'info');
    }
    
    function toggleStaffStatus(staffId) {
      showMessage('Chức năng thay đổi trạng thái nhân viên đang được phát triển', 'info');
    }
  });