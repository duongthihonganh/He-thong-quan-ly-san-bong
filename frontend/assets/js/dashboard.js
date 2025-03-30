document.addEventListener('DOMContentLoaded', function() {
  // Load dashboard data
  fetchDashboardSummary();
  
  // Load recent activities
  fetchRecentActivities();
});

// Fetch dashboard summary data
function fetchDashboardSummary() {
  const dashboardSummary = document.getElementById('dashboardSummary');
  if (!dashboardSummary) return;
  
  // In a real app, we would fetch from API
  console.log('Fetching dashboard summary data...');
  
  // Simulate API delay
  setTimeout(() => {
    // Simulate data (in a real app, this would come from the API)
    const summary = {
      todayBookings: 12,
      todayRevenue: 3500000,
      newCustomers: 3,
      fieldsInMaintenance: 1
    };
    
    // Update dashboard cards
    document.getElementById('todayBookings').textContent = summary.todayBookings;
    document.getElementById('todayRevenue').textContent = formatCurrency(summary.todayRevenue);
    document.getElementById('newCustomers').textContent = summary.newCustomers;
    document.getElementById('fieldsInMaintenance').textContent = summary.fieldsInMaintenance;
  }, 500); // Simulate network delay
}

// Fetch recent activities
function fetchRecentActivities() {
  const recentActivities = document.getElementById('recentActivities');
  if (!recentActivities) return;
  
  // Show loading indicator
  recentActivities.innerHTML = '<p>Đang tải hoạt động gần đây...</p>';
  
  // In a real app, we would fetch from API
  console.log('Fetching recent activities...');
  
  // Simulate API delay
  setTimeout(() => {
    // Simulate data (in a real app, this would come from the API)
    const activities = [
      { 
        type: 'booking', 
        description: 'Đặt sân mini 2 từ 18:00-20:00', 
        user: 'Nguyễn Văn A', 
        timestamp: '2023-09-28T15:30:00Z' 
      },
      { 
        type: 'payment', 
        description: 'Thanh toán đặt sân 500,000 VND', 
        user: 'Trần Thị B', 
        timestamp: '2023-09-28T14:45:00Z' 
      },
      { 
        type: 'maintenance', 
        description: 'Bảo trì sân mini 3', 
        user: 'Lê Văn C', 
        timestamp: '2023-09-28T12:15:00Z' 
      },
      { 
        type: 'customer', 
        description: 'Thêm khách hàng mới: Công ty XYZ', 
        user: 'Phạm Văn D', 
        timestamp: '2023-09-28T10:30:00Z' 
      }
    ];
    
    // Populate activities list
    let html = '';
    activities.forEach(activity => {
      html += `
        <div class="activity-item">
          <div class="activity-type ${activity.type}">${getActivityIcon(activity.type)}</div>
          <div class="activity-details">
            <p>${activity.description}</p>
            <small>${activity.user} - ${formatDateTime(activity.timestamp)}</small>
          </div>
        </div>
      `;
    });
    
    recentActivities.innerHTML = html || '<p>Không có hoạt động gần đây</p>';
  }, 700); // Simulate network delay
}

// Get appropriate icon for activity type
function getActivityIcon(type) {
  const icons = {
    'booking': '<i class="fas fa-calendar-check"></i>',
    'payment': '<i class="fas fa-money-bill-wave"></i>',
    'maintenance': '<i class="fas fa-tools"></i>',
    'customer': '<i class="fas fa-user"></i>',
    'field': '<i class="fas fa-futbol"></i>',
    'service': '<i class="fas fa-concierge-bell"></i>'
  };
  
  return icons[type] || '<i class="fas fa-info-circle"></i>';
}

// Format currency to VND
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Format date and time
function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return date.toLocaleString('vi-VN');
}