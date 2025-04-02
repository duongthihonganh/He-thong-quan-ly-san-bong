document.addEventListener('DOMContentLoaded', function() {
  // Load dashboard data
  fetchDashboardSummary();
  
  // Load field status overview
  fetchFieldStatusOverview();
  
  // Load all fields status table
  updateAllFieldsStatusTable();
  
  // Load recent activities
  fetchRecentActivities();
  
  // Initialize revenue charts
  initializeRevenueCharts();
});

// Fetch dashboard summary data
function fetchDashboardSummary() {
  const dashboardSummary = document.getElementById('dashboardSummary');
  if (!dashboardSummary) return;
  
  // In a real app, we would fetch from API
  console.log('Fetching dashboard summary data...');
  
  // Use mock data if available, otherwise use default data
  const summary = (window.mockData && window.mockData.getDashboardSummary) ? 
    window.mockData.getDashboardSummary() : 
    {
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
}

// Fetch recent activities
function fetchRecentActivities() {
  const recentActivities = document.getElementById('recentActivities');
  if (!recentActivities) return;
  
  // Show loading indicator
  recentActivities.innerHTML = '<p>Đang tải hoạt động gần đây...</p>';
  
  // In a real app, we would fetch from API
  console.log('Fetching recent activities...');
  
  // Get activities from mock data or use default data
  const activities = (window.mockData && window.mockData.getRecentActivities) ? 
    window.mockData.getRecentActivities() : [
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

// Update all fields status table
function updateAllFieldsStatusTable() {
  const allFieldsStatusBody = document.getElementById('allFieldsStatusBody');
  if (!allFieldsStatusBody) return;
  
  // Show loading indicator
  allFieldsStatusBody.innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu sân...</td></tr>';
  
  // Get fields data from mock data or use default data
  const fieldsData = (window.mockData && window.mockData.getFieldTimeSlots) ? 
    window.mockData.getFieldTimeSlots(new Date().toISOString().split('T')[0]) : [];
  
  if (fieldsData.length > 0) {
    let html = '';
    
    // Process and display field data
    fieldsData.forEach(field => {
      const price = field.fieldType === 'mini' ? '200,000đ - 350,000đ' : 
                    field.fieldType === 'medium' ? '400,000đ - 600,000đ' : 
                    '800,000đ - 1,200,000đ';
      
      // Format status with color
      let statusHtml = '';
      if (field.status === 'available') {
        statusHtml = '<span class="badge badge-success">Trống</span>';
      } else if (field.status === 'booked') {
        statusHtml = '<span class="badge badge-danger">Đã đặt</span>';
      } else if (field.status === 'maintenance') {
        statusHtml = '<span class="badge badge-warning">Bảo trì</span>';
      }
      
      // Find next available time slot
      const nextAvailable = field.status === 'available' ? 'Hiện tại' : field.nextAvailableTime || 'Chưa xác định';
      
      html += `
        <tr>
          <td>${field.fieldId}</td>
          <td>${field.fieldName}</td>
          <td>${field.fieldType || '-'}</td>
          <td>${statusHtml}</td>
          <td>${price}</td>
          <td>${nextAvailable}</td>
        </tr>
      `;
    });
    
    allFieldsStatusBody.innerHTML = html;
  } else {
    allFieldsStatusBody.innerHTML = '<tr><td colspan="6" class="text-center">Không có dữ liệu sân</td></tr>';
  }
}

// Initialize revenue charts
function initializeRevenueCharts() {
  if (!window.mockData || !window.mockData.generateRevenueData) return;
  
  // Get revenue data
  const revenueData = window.mockData.generateRevenueData();
  
  // Draw daily revenue chart
  const dailyCtx = document.getElementById('dailyRevenueChart');
  if (dailyCtx) {
    // Get the last 14 days of data for readability
    const last14Days = revenueData.daily.slice(-14);
    
    new Chart(dailyCtx, {
      type: 'line',
      data: {
        labels: last14Days.map(item => new Date(item.date).toLocaleDateString('vi-VN')),
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data: last14Days.map(item => item.value),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Doanh thu 14 ngày gần đây'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString('vi-VN') + 'đ';
              }
            }
          }
        }
      }
    });
  }
  
  // Draw monthly revenue chart
  const monthlyCtx = document.getElementById('monthlyRevenueChart');
  if (monthlyCtx) {
    new Chart(monthlyCtx, {
      type: 'bar',
      data: {
        labels: revenueData.monthly.map(item => item.month),
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data: revenueData.monthly.map(item => item.value),
          backgroundColor: '#2196F3',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Doanh thu theo tháng'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString('vi-VN') + 'đ';
              }
            }
          }
        }
      }
    });
  }
  
  // Draw quarterly revenue chart
  const quarterlyCtx = document.getElementById('quarterlyRevenueChart');
  if (quarterlyCtx) {
    new Chart(quarterlyCtx, {
      type: 'bar',
      data: {
        labels: revenueData.quarterly.map(item => item.quarter),
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data: revenueData.quarterly.map(item => item.value),
          backgroundColor: '#FFC107',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Doanh thu theo quý'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString('vi-VN') + 'đ';
              }
            }
          }
        }
      }
    });
  }
  
  // Draw comparison chart
  const comparisonCtx = document.getElementById('comparisonChart');
  if (comparisonCtx) {
    new Chart(comparisonCtx, {
      type: 'bar',
      data: {
        labels: ['Doanh thu', 'Chi phí', 'Lợi nhuận'],
        datasets: [{
          label: 'Giá trị (VNĐ)',
          data: [revenueData.totalRevenue, revenueData.totalExpenses, revenueData.profit],
          backgroundColor: ['#4CAF50', '#F44336', '#2196F3'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'So sánh doanh thu và chi phí'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString('vi-VN') + 'đ';
              }
            }
          }
        }
      }
    });
  }
}

// Fetch field status overview
function fetchFieldStatusOverview() {
  const fieldStatusOverview = document.getElementById('fieldStatusOverview');
  if (!fieldStatusOverview) return;
  
  // Show loading indicator
  fieldStatusOverview.innerHTML = '<p>Đang tải thông tin sân...</p>';
  
  // In a real app, we would fetch from API
  console.log('Fetching field status data...');
  
  // Get fields data from mock data
  const fieldsData = (window.mockData && window.mockData.getFields) ? 
    window.mockData.getFields() : [];
    
  // Create field status cards
  let html = '';
  
  if (fieldsData.length > 0) {
    fieldsData.forEach(field => {
      // Determine status class
      let statusClass = 'status-available';
      let statusText = 'Sẵn sàng';
      
      if (field.status === 'maintenance') {
        statusClass = 'status-maintenance';
        statusText = 'Bảo trì';
      } else if (field.status === 'booked') {
        statusClass = 'status-booked';
        statusText = 'Đã đặt';
      }
      
      html += `
        <div class="field-status-card">
          <div class="field-status-header">
            <div class="field-status-name">${field.name}</div>
            <span class="field-status-indicator ${statusClass}">${statusText}</span>
          </div>
          <div class="field-status-info">
            <div>Loại: ${field.type || field.size || ''}</div>
            <div>Mặt sân: ${field.surface || ''}</div>
            ${field.pricePerHour ? `<div>Giá: ${formatCurrency(field.pricePerHour)}/giờ</div>` : ''}
            ${field.price ? `<div>Giá buổi tối: ${formatCurrency(field.price.evening)}</div>` : ''}
          </div>
          <div class="field-status-details">
            <a href="fields.html?id=${field.id}" class="btn btn-sm">Xem chi tiết</a>
          </div>
        </div>
      `;
    });
  } else {
    html = '<p>Không có thông tin sân</p>';
  }
  
  fieldStatusOverview.innerHTML = html;
}
