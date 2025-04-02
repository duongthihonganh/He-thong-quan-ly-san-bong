/**
 * Dữ liệu ảo cho hệ thống quản lý sân bóng đá
 * Được sử dụng cho mục đích demo
 */

// Initialize window.mockData object to hold all mock data functions
window.mockData = window.mockData || {};

// Hàm format tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Tạo dữ liệu thống kê theo khoảng thời gian
window.mockData.generateTimeSeriesData = function(startDate, endDate, minValue, maxValue, isInteger = true) {
  const data = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= new Date(endDate)) {
    let value;
    if (isInteger) {
      value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    } else {
      value = (Math.random() * (maxValue - minValue)) + minValue;
    }
    
    data.push({
      date: new Date(currentDate).toISOString().split('T')[0],
      value: value
    });
    
    // Tăng ngày lên 1
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

// Dữ liệu báo cáo doanh thu
window.mockData.generateRevenueData = function() {
  // Tạo dữ liệu doanh thu theo ngày cho năm hiện tại
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  
  // Dữ liệu doanh thu theo ngày
  const dailyRevenue = window.mockData.generateTimeSeriesData(
    startOfYear, 
    today, 
    100000, 
    5000000
  );
  
  // Tính doanh thu theo tháng
  const monthlyRevenue = [];
  for (let month = 0; month < 12; month++) {
    const monthName = new Date(today.getFullYear(), month, 1).toLocaleString('vi-VN', { month: 'long' });
    const monthData = dailyRevenue.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === month && itemDate.getFullYear() === today.getFullYear();
    });
    
    const totalRevenue = monthData.reduce((sum, item) => sum + item.value, 0);
    monthlyRevenue.push({
      month: monthName,
      value: totalRevenue
    });
  }
  
  // Tính doanh thu theo quý
  const quarterlyRevenue = [
    {
      quarter: 'Quý 1',
      value: monthlyRevenue.slice(0, 3).reduce((sum, item) => sum + item.value, 0)
    },
    {
      quarter: 'Quý 2',
      value: monthlyRevenue.slice(3, 6).reduce((sum, item) => sum + item.value, 0)
    },
    {
      quarter: 'Quý 3',
      value: monthlyRevenue.slice(6, 9).reduce((sum, item) => sum + item.value, 0)
    },
    {
      quarter: 'Quý 4',
      value: monthlyRevenue.slice(9, 12).reduce((sum, item) => sum + item.value, 0)
    }
  ];
  
  // Dữ liệu doanh thu và chi phí
  const expenses = {
    daily: dailyRevenue.map(item => ({
      date: item.date,
      value: Math.floor(item.value * 0.4) // Chi phí bằng khoảng 40% doanh thu
    })),
    monthly: monthlyRevenue.map(item => ({
      month: item.month,
      value: Math.floor(item.value * 0.4)
    })),
    quarterly: quarterlyRevenue.map(item => ({
      quarter: item.quarter,
      value: Math.floor(item.value * 0.4)
    }))
  };
  
  return {
    daily: dailyRevenue,
    monthly: monthlyRevenue,
    quarterly: quarterlyRevenue,
    expenses: expenses,
    totalRevenue: dailyRevenue.reduce((sum, item) => sum + item.value, 0),
    totalExpenses: expenses.daily.reduce((sum, item) => sum + item.value, 0),
    profit: dailyRevenue.reduce((sum, item) => sum + item.value, 0) - expenses.daily.reduce((sum, item) => sum + item.value, 0)
  };
};

// Dữ liệu thống kê sân bóng
window.mockData.generateFieldStatistics = function() {
  const fields = [
    { id: 1, name: 'Sân mini 1', type: 'mini' },
    { id: 2, name: 'Sân mini 2', type: 'mini' },
    { id: 3, name: 'Sân 7 người 1', type: 'medium' },
    { id: 4, name: 'Sân 11 người', type: 'full' }
  ];
  
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Tạo dữ liệu sử dụng sân theo ngày cho tháng hiện tại
  return fields.map(field => {
    const dailyUsage = window.mockData.generateTimeSeriesData(
      startOfMonth, 
      today, 
      0, 
      field.type === 'mini' ? 10 : (field.type === 'medium' ? 8 : 5), // Số lần sử dụng trong ngày
      true
    );
    
    // Tính tổng doanh thu từ sân
    const hourlyRate = field.type === 'mini' ? 250000 : (field.type === 'medium' ? 400000 : 800000);
    const revenue = dailyUsage.reduce((sum, day) => sum + (day.value * hourlyRate), 0);
    
    // Tính tỷ lệ sử dụng
    const totalHours = dailyUsage.length * 17; // 17 giờ mỗi ngày từ 6:00 - 23:00
    const usedHours = dailyUsage.reduce((sum, day) => sum + day.value, 0);
    const usageRate = (usedHours / totalHours) * 100;
    
    return {
      field: field,
      dailyUsage: dailyUsage,
      revenue: revenue,
      usageRate: usageRate,
      maintenanceCount: Math.floor(Math.random() * 3) // Số lần bảo trì
    };
  });
};

// Dữ liệu nhân viên
const staffData = [
  { 
    id: 1, 
    username: "admin", 
    fullName: "Nguyễn Quản Trị", 
    position: "Quản lý", 
    phone: "0901234567", 
    email: "admin@example.com", 
    avatar: "assets/images/avatar1.png",
    role: "admin", 
    salary: 10000000,
    status: "active",
    startDate: "2023-01-01"
  },
  { 
    id: 2, 
    username: "staff1", 
    fullName: "Trần Nhân Viên", 
    position: "Nhân viên", 
    phone: "0912345678", 
    email: "staff1@example.com", 
    avatar: "assets/images/avatar2.png",
    role: "staff", 
    salary: 7000000,
    status: "active",
    startDate: "2023-02-15"
  },
  { 
    id: 3, 
    username: "staff2", 
    fullName: "Lê Thị Nhân", 
    position: "Nhân viên", 
    phone: "0923456789", 
    email: "staff2@example.com", 
    avatar: "assets/images/avatar3.png",
    role: "staff", 
    salary: 7000000,
    status: "active",
    startDate: "2023-03-10"
  },
  { 
    id: 4, 
    username: "cashier", 
    fullName: "Phạm Thu Ngân", 
    position: "Thu ngân", 
    phone: "0934567890", 
    email: "cashier@example.com", 
    avatar: "assets/images/avatar4.png",
    role: "staff", 
    salary: 6500000,
    status: "active",
    startDate: "2023-04-05"
  },
  { 
    id: 5, 
    username: "manager", 
    fullName: "Hoàng Văn Quản", 
    position: "Quản lý", 
    phone: "0945678901", 
    email: "manager@example.com", 
    avatar: "assets/images/avatar5.png",
    role: "admin", 
    salary: 12000000,
    status: "active",
    startDate: "2023-01-01"
  }
];

// Dữ liệu khách hàng
const customerData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    type: "regular",
    joinDate: "2023-01-10",
    totalBookings: 15,
    totalSpent: 7500000,
    notes: "Khách hàng thường xuyên đặt sân vào cuối tuần"
  },
  {
    id: 2,
    name: "Công ty XYZ",
    phone: "0909876543",
    email: "contact@xyz.com",
    address: "456 Đường DEF, Quận 2, TP.HCM",
    type: "business",
    joinDate: "2023-02-15",
    totalBookings: 8,
    totalSpent: 12000000,
    notes: "Đặt sân cho các sự kiện công ty"
  },
  {
    id: 3,
    name: "Trần Thị B",
    phone: "0905555555",
    email: "tranthib@example.com",
    address: "789 Đường GHI, Quận 3, TP.HCM",
    type: "regular",
    joinDate: "2023-03-05",
    totalBookings: 6,
    totalSpent: 3000000,
    notes: "Thường đặt sân mini"
  },
  {
    id: 4,
    name: "Câu lạc bộ Sao Đỏ",
    phone: "0903333333",
    email: "club@saodo.com",
    address: "101 Đường JKL, Quận Tân Bình, TP.HCM",
    type: "club",
    joinDate: "2023-01-20",
    totalBookings: 20,
    totalSpent: 15000000,
    notes: "CLB đá bóng hàng tuần vào tối thứ 5"
  },
  {
    id: 5,
    name: "Lê Văn C",
    phone: "0907777777",
    email: "levanc@example.com",
    address: "202 Đường MNO, Quận 7, TP.HCM",
    type: "regular",
    joinDate: "2023-04-12",
    totalBookings: 4,
    totalSpent: 2000000,
    notes: "Mới trở thành khách hàng thường xuyên"
  },
  {
    id: 6,
    name: "Trường THPT Nguyễn Trãi",
    phone: "0288888888",
    email: "info@nguyentrai.edu.vn",
    address: "303 Đường PQR, Quận 5, TP.HCM",
    type: "school",
    joinDate: "2023-02-01",
    totalBookings: 10,
    totalSpent: 5000000,
    notes: "Đặt sân cho hoạt động ngoại khóa"
  }
];

// Dữ liệu sân bóng
const fieldData = [
  {
    id: 1,
    name: "Sân mini 1",
    type: "mini",
    size: "5 người",
    surface: "Cỏ nhân tạo",
    quality: "Tốt",
    lighting: "Có",
    price: {
      morning: 200000, // 6:00 - 16:00
      evening: 300000, // 16:00 - 22:00
      weekend: 350000  // Cuối tuần
    },
    status: "active",
    description: "Sân mini 5 người với cỏ nhân tạo chất lượng cao",
    maintenanceHistory: [
      { date: "2023-01-15", description: "Thay mới cỏ nhân tạo", cost: 15000000 },
      { date: "2023-05-01", description: "Bảo dưỡng hệ thống đèn", cost: 2000000 }
    ],
    lastMaintenance: "2023-05-01"
  },
  {
    id: 2,
    name: "Sân mini 2",
    type: "mini",
    size: "5 người",
    surface: "Cỏ nhân tạo",
    quality: "Tốt",
    lighting: "Có",
    price: {
      morning: 200000,
      evening: 300000,
      weekend: 350000
    },
    status: "active",
    description: "Sân mini 5 người với cỏ nhân tạo chất lượng cao",
    maintenanceHistory: [
      { date: "2023-02-10", description: "Thay mới cỏ nhân tạo", cost: 15000000 }
    ],
    lastMaintenance: "2023-02-10"
  },
  {
    id: 3,
    name: "Sân 7 người 1",
    type: "medium",
    size: "7 người",
    surface: "Cỏ nhân tạo",
    quality: "Rất tốt",
    lighting: "Có",
    price: {
      morning: 400000,
      evening: 500000,
      weekend: 600000
    },
    status: "active",
    description: "Sân 7 người với cỏ nhân tạo cao cấp và hệ thống đèn chiếu sáng hiện đại",
    maintenanceHistory: [
      { date: "2023-03-20", description: "Thay mới cỏ nhân tạo", cost: 25000000 },
      { date: "2023-06-05", description: "Bảo dưỡng hệ thống thoát nước", cost: 5000000 }
    ],
    lastMaintenance: "2023-06-05"
  },
  {
    id: 4,
    name: "Sân 11 người",
    type: "full",
    size: "11 người",
    surface: "Cỏ nhân tạo",
    quality: "Rất tốt",
    lighting: "Có",
    price: {
      morning: 800000,
      evening: 1000000,
      weekend: 1200000
    },
    status: "active",
    description: "Sân tiêu chuẩn 11 người với đầy đủ tiện nghi và không gian rộng rãi",
    maintenanceHistory: [
      { date: "2023-04-10", description: "Thay mới cỏ nhân tạo", cost: 50000000 },
      { date: "2023-07-15", description: "Bảo dưỡng hệ thống đèn", cost: 8000000 }
    ],
    lastMaintenance: "2023-07-15"
  },
  {
    id: 5,
    name: "Sân 7 người 2",
    type: "medium",
    size: "7 người",
    surface: "Cỏ nhân tạo",
    quality: "Tốt",
    lighting: "Có",
    price: {
      morning: 350000,
      evening: 450000,
      weekend: 550000
    },
    status: "maintenance",
    description: "Sân 7 người với cỏ nhân tạo chất lượng tốt, đang trong quá trình bảo trì",
    maintenanceHistory: [
      { date: "2023-05-05", description: "Thay mới cỏ nhân tạo", cost: 20000000 },
      { date: "2023-08-01", description: "Bảo dưỡng hệ thống thoát nước", cost: 4000000 }
    ],
    lastMaintenance: "2023-08-01"
  }
];

// Dữ liệu dịch vụ
const serviceData = [
  {
    id: 1, 
    name: "Nước uống",
    price: 10000,
    description: "Nước khoáng, nước ngọt, trà đá",
    category: "food",
    inventory: 100,
    unit: "chai",
    availability: true
  },
  {
    id: 2,
    name: "Áo thi đấu",
    price: 50000,
    description: "Áo thi đấu cho đội bóng",
    category: "equipment",
    inventory: 30,
    unit: "bộ",
    availability: true
  },
  {
    id: 3,
    name: "Trọng tài",
    price: 200000,
    description: "Dịch vụ trọng tài cho trận đấu",
    category: "referee",
    inventory: null,
    unit: "trận",
    availability: true
  },
  {
    id: 4,
    name: "Quay video",
    price: 300000,
    description: "Quay video trận đấu, chất lượng HD",
    category: "media",
    inventory: null,
    unit: "trận",
    availability: true
  },
  {
    id: 5,
    name: "Đồ ăn nhẹ",
    price: 50000,
    description: "Bánh mì, xôi, đồ ăn nhẹ cho đội bóng",
    category: "food",
    inventory: 50,
    unit: "phần",
    availability: true
  },
  {
    id: 6,
    name: "Bóng thi đấu",
    price: 100000,
    description: "Bóng thi đấu chất lượng cao",
    category: "equipment",
    inventory: 15,
    unit: "quả",
    availability: true
  },
  {
    id: 7,
    name: "Găng tay thủ môn",
    price: 70000,
    description: "Găng tay dành cho thủ môn",
    category: "equipment",
    inventory: 8,
    unit: "đôi",
    availability: true
  },
  {
    id: 8,
    name: "Giày đá bóng",
    price: 150000,
    description: "Giày đá bóng cho thuê",
    category: "equipment",
    inventory: 20,
    unit: "đôi",
    availability: true
  }
];

// Dữ liệu đặt sân
const bookingData = [
  { 
    id: 101, 
    fieldId: 1, 
    fieldName: "Sân mini 1", 
    customerId: 1, 
    customerName: "Nguyễn Văn A", 
    customerPhone: "0901234567",
    date: "2023-08-15", 
    startTime: "17:00", 
    endTime: "18:00", 
    status: "completed", 
    totalAmount: 300000,
    paidAmount: 300000,
    paymentMethod: "cash",
    paymentStatus: "paid",
    notes: "Khách hàng thường xuyên",
    services: [
      { id: 1, name: "Nước uống", quantity: 10, price: 10000, subtotal: 100000 }
    ],
    createdBy: "admin",
    createdAt: "2023-08-10T10:00:00"
  },
  { 
    id: 102, 
    fieldId: 2, 
    fieldName: "Sân mini 2", 
    customerId: 2, 
    customerName: "Công ty XYZ", 
    customerPhone: "0909876543",
    date: "2023-08-16", 
    startTime: "18:00", 
    endTime: "19:00", 
    status: "completed", 
    totalAmount: 300000,
    paidAmount: 300000,
    paymentMethod: "transfer",
    paymentStatus: "paid",
    notes: "",
    services: [],
    createdBy: "staff1",
    createdAt: "2023-08-10T11:30:00"
  },
  { 
    id: 103, 
    fieldId: 3, 
    fieldName: "Sân 7 người 1", 
    customerId: 3, 
    customerName: "Trần Thị B", 
    customerPhone: "0905555555",
    date: "2023-08-20", 
    startTime: "19:00", 
    endTime: "21:00", 
    status: "confirmed", 
    totalAmount: 1050000,
    paidAmount: 500000,
    paymentMethod: "cash",
    paymentStatus: "partial",
    notes: "Đặt sân đá giao lưu",
    services: [
      { id: 2, name: "Áo thi đấu", quantity: 7, price: 50000, subtotal: 350000 },
      { id: 3, name: "Trọng tài", quantity: 1, price: 200000, subtotal: 200000 }
    ],
    createdBy: "admin",
    createdAt: "2023-08-12T14:00:00"
  },
  { 
    id: 104, 
    fieldId: 4, 
    fieldName: "Sân 11 người", 
    customerId: 4, 
    customerName: "Câu lạc bộ Sao Đỏ", 
    customerPhone: "0903333333",
    date: "2023-08-17", 
    startTime: "16:00", 
    endTime: "18:00", 
    status: "completed", 
    totalAmount: 1600000,
    paidAmount: 1600000,
    paymentMethod: "transfer",
    paymentStatus: "paid",
    notes: "Đã thanh toán đầy đủ",
    services: [
      { id: 4, name: "Quay video", quantity: 1, price: 300000, subtotal: 300000 }
    ],
    createdBy: "staff2",
    createdAt: "2023-08-10T09:15:00"
  },
  { 
    id: 105, 
    fieldId: 1, 
    fieldName: "Sân mini 1", 
    customerId: 5, 
    customerName: "Lê Văn C", 
    customerPhone: "0907777777",
    date: "2023-08-21", 
    startTime: "18:00", 
    endTime: "19:00", 
    status: "confirmed", 
    totalAmount: 350000,
    paidAmount: 0,
    paymentMethod: "cash",
    paymentStatus: "unpaid",
    notes: "Sẽ thanh toán khi đến sân",
    services: [
      { id: 1, name: "Nước uống", quantity: 5, price: 10000, subtotal: 50000 }
    ],
    createdBy: "cashier",
    createdAt: "2023-08-15T16:30:00"
  },
  { 
    id: 106, 
    fieldId: 3, 
    fieldName: "Sân 7 người 1", 
    customerId: 6, 
    customerName: "Trường THPT Nguyễn Trãi", 
    customerPhone: "0288888888",
    date: "2023-08-25", 
    startTime: "15:00", 
    endTime: "17:00", 
    status: "pending", 
    totalAmount: 800000,
    paidAmount: 400000,
    paymentMethod: "transfer",
    paymentStatus: "partial",
    notes: "Đặt sân cho hoạt động ngoại khóa",
    services: [],
    createdBy: "manager",
    createdAt: "2023-08-15T10:00:00"
  },
  { 
    id: 107, 
    fieldId: 2, 
    fieldName: "Sân mini 2", 
    customerId: 1, 
    customerName: "Nguyễn Văn A", 
    customerPhone: "0901234567",
    date: "2023-08-22", 
    startTime: "17:00", 
    endTime: "18:00", 
    status: "confirmed", 
    totalAmount: 300000,
    paidAmount: 300000,
    paymentMethod: "cash",
    paymentStatus: "paid",
    notes: "",
    services: [],
    createdBy: "admin",
    createdAt: "2023-08-16T14:20:00"
  }
];

// Dữ liệu thanh toán
const paymentData = [
  {
    id: 1,
    bookingId: 101,
    amount: 300000,
    method: "cash",
    status: "completed",
    date: "2023-08-15T16:45:00",
    paidBy: "Nguyễn Văn A",
    receivedBy: "Phạm Thu Ngân",
    reference: "",
    notes: "Thanh toán đầy đủ"
  },
  {
    id: 2,
    bookingId: 102,
    amount: 300000,
    method: "transfer",
    status: "completed",
    date: "2023-08-15T17:30:00",
    paidBy: "Công ty XYZ",
    receivedBy: "Phạm Thu Ngân",
    reference: "CT123456",
    notes: "Chuyển khoản ngân hàng"
  },
  {
    id: 3,
    bookingId: 103,
    amount: 500000,
    method: "cash",
    status: "partial",
    date: "2023-08-18T14:00:00",
    paidBy: "Trần Thị B",
    receivedBy: "Phạm Thu Ngân",
    reference: "",
    notes: "Thanh toán đặt cọc, còn lại 550.000 đ"
  },
  {
    id: 4,
    bookingId: 104,
    amount: 1600000,
    method: "transfer",
    status: "completed",
    date: "2023-08-16T09:15:00",
    paidBy: "Câu lạc bộ Sao Đỏ",
    receivedBy: "Hoàng Văn Quản",
    reference: "CT789012",
    notes: "Thanh toán đầy đủ qua chuyển khoản"
  },
  {
    id: 5,
    bookingId: 106,
    amount: 400000,
    method: "transfer",
    status: "partial",
    date: "2023-08-15T11:30:00",
    paidBy: "Trường THPT Nguyễn Trãi",
    receivedBy: "Hoàng Văn Quản",
    reference: "CT345678",
    notes: "Đặt cọc 50%, còn lại thanh toán sau khi sử dụng"
  },
  {
    id: 6,
    bookingId: 107,
    amount: 300000,
    method: "cash",
    status: "completed",
    date: "2023-08-16T14:30:00",
    paidBy: "Nguyễn Văn A",
    receivedBy: "Phạm Thu Ngân",
    reference: "",
    notes: "Thanh toán đầy đủ bằng tiền mặt"
  }
];

// Dữ liệu hoạt động
const activityData = [
  {
    id: 1,
    userId: 1,
    userName: "Nguyễn Quản Trị",
    action: "create",
    target: "booking",
    targetId: 101,
    details: "Tạo đặt sân mới cho Nguyễn Văn A",
    timestamp: "2023-08-10T10:00:00"
  },
  {
    id: 2,
    userId: 2,
    userName: "Trần Nhân Viên",
    action: "create",
    target: "booking",
    targetId: 102,
    details: "Tạo đặt sân mới cho Công ty XYZ",
    timestamp: "2023-08-10T11:30:00"
  },
  {
    id: 3,
    userId: 4,
    userName: "Phạm Thu Ngân",
    action: "create",
    target: "payment",
    targetId: 1,
    details: "Nhận thanh toán 300.000 đ cho đặt sân #101",
    timestamp: "2023-08-15T16:45:00"
  },
  {
    id: 4,
    userId: 4,
    userName: "Phạm Thu Ngân",
    action: "create",
    target: "payment",
    targetId: 2,
    details: "Nhận thanh toán 300.000 đ cho đặt sân #102",
    timestamp: "2023-08-15T17:30:00"
  },
  {
    id: 5,
    userId: 1,
    userName: "Nguyễn Quản Trị",
    action: "create",
    target: "booking",
    targetId: 103,
    details: "Tạo đặt sân mới cho Trần Thị B",
    timestamp: "2023-08-12T14:00:00"
  },
  {
    id: 6,
    userId: 3,
    userName: "Lê Thị Nhân",
    action: "create",
    target: "booking",
    targetId: 104,
    details: "Tạo đặt sân mới cho Câu lạc bộ Sao Đỏ",
    timestamp: "2023-08-10T09:15:00"
  },
  {
    id: 7,
    userId: 5,
    userName: "Hoàng Văn Quản",
    action: "create",
    target: "payment",
    targetId: 4,
    details: "Nhận thanh toán 1.600.000 đ cho đặt sân #104",
    timestamp: "2023-08-16T09:15:00"
  },
  {
    id: 8,
    userId: 4,
    userName: "Phạm Thu Ngân",
    action: "create",
    target: "booking",
    targetId: 105,
    details: "Tạo đặt sân mới cho Lê Văn C",
    timestamp: "2023-08-15T16:30:00"
  },
  {
    id: 9,
    userId: 5,
    userName: "Hoàng Văn Quản",
    action: "create",
    target: "booking",
    targetId: 106,
    details: "Tạo đặt sân mới cho Trường THPT Nguyễn Trãi",
    timestamp: "2023-08-15T10:00:00"
  },
  {
    id: 10,
    userId: 5,
    userName: "Hoàng Văn Quản",
    action: "create",
    target: "payment",
    targetId: 5,
    details: "Nhận thanh toán 400.000 đ cho đặt sân #106",
    timestamp: "2023-08-15T11:30:00"
  },
  {
    id: 11,
    userId: 1,
    userName: "Nguyễn Quản Trị",
    action: "create",
    target: "booking",
    targetId: 107,
    details: "Tạo đặt sân mới cho Nguyễn Văn A",
    timestamp: "2023-08-16T14:20:00"
  },
  {
    id: 12,
    userId: 4,
    userName: "Phạm Thu Ngân",
    action: "create",
    target: "payment",
    targetId: 6,
    details: "Nhận thanh toán 300.000 đ cho đặt sân #107",
    timestamp: "2023-08-16T14:30:00"
  },
  {
    id: 13,
    userId: 4,
    userName: "Phạm Thu Ngân",
    action: "create",
    target: "payment",
    targetId: 3,
    details: "Nhận thanh toán 500.000 đ cho đặt sân #103",
    timestamp: "2023-08-18T14:00:00"
  },
  {
    id: 14,
    userId: 1,
    userName: "Nguyễn Quản Trị",
    action: "update",
    target: "field",
    targetId: 5,
    details: "Cập nhật trạng thái sân #5 thành bảo trì",
    timestamp: "2023-08-01T08:30:00"
  },
  {
    id: 15,
    userId: 5,
    userName: "Hoàng Văn Quản",
    action: "create",
    target: "maintenance",
    targetId: 2,
    details: "Tạo lịch bảo trì cho sân #5",
    timestamp: "2023-08-01T08:35:00"
  }
];

// Dữ liệu bảo trì
const maintenanceData = [
  {
    id: 1,
    fieldId: 1,
    fieldName: "Sân mini 1",
    type: "regular",
    description: "Bảo dưỡng hệ thống đèn",
    startDate: "2023-05-01",
    endDate: "2023-05-01",
    cost: 2000000,
    status: "completed",
    assignedTo: "Trần Nhân Viên",
    notes: "Thay thế 2 bóng đèn và kiểm tra hệ thống điện",
    createdBy: "Hoàng Văn Quản",
    createdAt: "2023-04-25T10:00:00"
  },
  {
    id: 2,
    fieldId: 5,
    fieldName: "Sân 7 người 2",
    type: "major",
    description: "Bảo dưỡng hệ thống thoát nước",
    startDate: "2023-08-01",
    endDate: "2023-08-15",
    cost: 4000000,
    status: "in_progress",
    assignedTo: "Lê Thị Nhân",
    notes: "Cải tạo hệ thống thoát nước và sửa chữa mặt sân",
    createdBy: "Hoàng Văn Quản",
    createdAt: "2023-07-20T14:30:00"
  },
  {
    id: 3,
    fieldId: 3,
    fieldName: "Sân 7 người 1",
    type: "regular",
    description: "Bảo dưỡng hệ thống thoát nước",
    startDate: "2023-06-05",
    endDate: "2023-06-05",
    cost: 5000000,
    status: "completed",
    assignedTo: "Trần Nhân Viên",
    notes: "Kiểm tra và sửa chữa hệ thống thoát nước",
    createdBy: "Nguyễn Quản Trị",
    createdAt: "2023-06-01T09:15:00"
  },
  {
    id: 4,
    fieldId: 4,
    fieldName: "Sân 11 người",
    type: "regular",
    description: "Bảo dưỡng hệ thống đèn",
    startDate: "2023-07-15",
    endDate: "2023-07-15",
    cost: 8000000,
    status: "completed",
    assignedTo: "Lê Thị Nhân",
    notes: "Thay thế 4 bóng đèn và kiểm tra hệ thống điện",
    createdBy: "Hoàng Văn Quản",
    createdAt: "2023-07-10T11:30:00"
  },
  {
    id: 5,
    fieldId: 2,
    fieldName: "Sân mini 2",
    type: "planned",
    description: "Thay mới cỏ nhân tạo",
    startDate: "2023-09-10",
    endDate: "2023-09-20",
    cost: 15000000,
    status: "planned",
    assignedTo: "Trần Nhân Viên",
    notes: "Lên kế hoạch thay mới toàn bộ cỏ nhân tạo",
    createdBy: "Hoàng Văn Quản",
    createdAt: "2023-08-15T15:45:00"
  }
];

// Dữ liệu thống kê và báo cáo
const reportData = {
  // Thống kê doanh thu theo tháng
  revenueByMonth: [
    { month: "2023-01", amount: 15000000 },
    { month: "2023-02", amount: 18500000 },
    { month: "2023-03", amount: 20000000 },
    { month: "2023-04", amount: 22500000 },
    { month: "2023-05", amount: 25000000 },
    { month: "2023-06", amount: 28000000 },
    { month: "2023-07", amount: 30000000 },
    { month: "2023-08", amount: 21000000 }
  ],
  
  // Thống kê doanh thu theo sân
  revenueByField: [
    { fieldId: 1, fieldName: "Sân mini 1", amount: 35000000 },
    { fieldId: 2, fieldName: "Sân mini 2", amount: 32000000 },
    { fieldId: 3, fieldName: "Sân 7 người 1", amount: 45000000 },
    { fieldId: 4, fieldName: "Sân 11 người", amount: 60000000 },
    { fieldId: 5, fieldName: "Sân 7 người 2", amount: 8000000 }
  ],
  
  // Thống kê doanh thu theo dịch vụ
  revenueByService: [
    { serviceId: 1, serviceName: "Nước uống", amount: 8000000 },
    { serviceId: 2, serviceName: "Áo thi đấu", amount: 12000000 },
    { serviceId: 3, serviceName: "Trọng tài", amount: 15000000 },
    { serviceId: 4, serviceName: "Quay video", amount: 9000000 },
    { serviceId: 5, serviceName: "Đồ ăn nhẹ", amount: 6000000 },
    { serviceId: 6, serviceName: "Bóng thi đấu", amount: 5000000 },
    { serviceId: 7, serviceName: "Găng tay thủ môn", amount: 2000000 },
    { serviceId: 8, serviceName: "Giày đá bóng", amount: 7000000 }
  ],
  
  // Thống kê số lượng đặt sân theo tháng
  bookingsByMonth: [
    { month: "2023-01", count: 120 },
    { month: "2023-02", count: 135 },
    { month: "2023-03", count: 150 },
    { month: "2023-04", count: 165 },
    { month: "2023-05", count: 180 },
    { month: "2023-06", count: 200 },
    { month: "2023-07", count: 210 },
    { month: "2023-08", count: 150 }
  ],
  
  // Thống kê chi phí bảo trì
  maintenanceCostsByField: [
    { fieldId: 1, fieldName: "Sân mini 1", amount: 17000000 },
    { fieldId: 2, fieldName: "Sân mini 2", amount: 15000000 },
    { fieldId: 3, fieldName: "Sân 7 người 1", amount: 30000000 },
    { fieldId: 4, fieldName: "Sân 11 người", amount: 58000000 },
    { fieldId: 5, fieldName: "Sân 7 người 2", amount: 24000000 }
  ]
};

// Tính toán thông tin cho bảng điều khiển
function getDashboardSummary() {
  // Lấy ngày hiện tại
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  // Đếm số lượng đặt sân trong ngày
  const todayBookings = bookingData.filter(booking => booking.date === formattedDate).length;
  
  // Tính tổng doanh thu trong ngày
  const todayRevenue = bookingData
    .filter(booking => booking.date === formattedDate)
    .reduce((total, booking) => total + booking.paidAmount, 0);
  
  // Số khách hàng mới trong tuần (giả lập)
  const newCustomers = 3;
  
  // Số sân đang bảo trì
  const fieldsInMaintenance = fieldData.filter(field => field.status === 'maintenance').length;
  
  return {
    todayBookings,
    todayRevenue,
    newCustomers,
    fieldsInMaintenance
  };
}

// Lấy trạng thái sân theo ngày
function getFieldTimeSlots(date) {
  // Tạo danh sách các khung giờ có sẵn
  const timeSlots = [];
  
  // Tạo sẵn danh sách khung giờ cho mỗi sân
  fieldData.forEach(field => {
    if (field.status === 'active') {
      const fieldBookings = bookingData.filter(booking => 
        booking.fieldId === field.id && booking.date === date);
      
      // Tạo danh sách các khung giờ (từ 6:00 đến 22:00, mỗi khung 1 giờ)
      for (let hour = 6; hour < 22; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        // Kiểm tra xem khung giờ này đã được đặt chưa
        const isBooked = fieldBookings.some(booking => {
          const bookingStartHour = parseInt(booking.startTime.split(':')[0]);
          const bookingEndHour = parseInt(booking.endTime.split(':')[0]);
          const currentHour = hour;
          
          return bookingStartHour <= currentHour && bookingEndHour > currentHour;
        });
        
        const slot = {
          fieldId: field.id,
          fieldName: field.name,
          status: isBooked ? 'booked' : 'available',
          startTime: startTime,
          endTime: endTime,
        };
        
        // Nếu đã đặt, thêm thông tin khách hàng
        if (isBooked) {
          const booking = fieldBookings.find(booking => {
            const bookingStartHour = parseInt(booking.startTime.split(':')[0]);
            const bookingEndHour = parseInt(booking.endTime.split(':')[0]);
            const currentHour = hour;
            
            return bookingStartHour <= currentHour && bookingEndHour > currentHour;
          });
          
          slot.customerName = booking.customerName;
          slot.customerPhone = booking.customerPhone;
        }
        
        timeSlots.push(slot);
      }
    } else if (field.status === 'maintenance') {
      // Nếu sân đang bảo trì, đánh dấu tất cả các khung giờ là đang bảo trì
      for (let hour = 6; hour < 22; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        const maintenance = maintenanceData.find(m => 
          m.fieldId === field.id && 
          m.status === 'in_progress');
        
        timeSlots.push({
          fieldId: field.id,
          fieldName: field.name,
          status: 'maintenance',
          startTime: startTime,
          endTime: endTime,
          maintenanceReason: maintenance ? maintenance.description : 'Đang bảo trì'
        });
      }
    }
  });
  
  return timeSlots;
}

// Xuất dữ liệu để sử dụng trong ứng dụng
// Lấy thông tin sân bóng và tình trạng hiện tại
function getFields() {
  // Cập nhật trạng thái sân dựa trên đặt sân hôm nay
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  // Tạo bản sao của dữ liệu sân để không ảnh hưởng đến dữ liệu gốc
  // Lấy dữ liệu từ localStorage nếu có, hoặc dùng dữ liệu gốc
  let fields = [];
  
  try {
    const savedFields = localStorage.getItem('fieldData');
    if (savedFields) {
      fields = JSON.parse(savedFields);
      console.log('Lấy dữ liệu sân từ localStorage');
    } else {
      fields = JSON.parse(JSON.stringify(fieldData));
      console.log('Lấy dữ liệu sân từ dữ liệu mẫu');
    }
  } catch (e) {
    console.error('Lỗi khi lấy dữ liệu sân:', e);
    fields = JSON.parse(JSON.stringify(fieldData));
  }
  
  // Kiểm tra xem sân có đang được đặt hay không
  const currentHour = today.getHours();
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:00`;
  
  fields.forEach(field => {
    if (field.status !== 'maintenance') {
      const isBooked = bookingData.some(booking => 
        booking.fieldId === field.id && 
        booking.date === formattedDate &&
        booking.startTime <= currentTimeStr &&
        booking.endTime > currentTimeStr &&
        ['confirmed', 'completed'].includes(booking.status)
      );
      
      field.status = isBooked ? 'booked' : 'available';
    }
  });
  
  // Lưu trạng thái hiện tại vào localStorage
  try {
    localStorage.setItem('fieldData', JSON.stringify(fields));
    console.log('Đã lưu trạng thái sân vào localStorage');
  } catch (e) {
    console.error('Lỗi khi lưu trạng thái sân:', e);
  }
  
  return fields;
}

window.mockData = {
  staffData,
  customerData,
  fieldData,
  serviceData,
  bookingData,
  paymentData,
  activityData,
  maintenanceData,
  reportData,
  getDashboardSummary,
  getFieldTimeSlots,
  getFields,
  
  // Function to get recent activities for dashboard
  getRecentActivities: function() {
    return activityData.slice(0, 5).map(activity => {
      return {
        type: activity.target,
        description: activity.details,
        user: activity.userName,
        timestamp: activity.timestamp
      };
    });
  }
};