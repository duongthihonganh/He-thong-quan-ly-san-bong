const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleSpreadsheet } = require('google-spreadsheet');

// Tải biến môi trường từ file .env
dotenv.config();

// Tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Biến để lưu trữ tham chiếu đến Google Spreadsheet
let doc;

// Hàm kết nối với Google Spreadsheet
async function connectToSpreadsheet() {
  try {
    if (!process.env.GOOGLE_SHEET_ID) {
      console.error('Thiếu GOOGLE_SHEET_ID trong .env');
      return;
    }
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Thiếu thông tin xác thực Google Service Account trong .env');
      return;
    }

    // Tạo mới GoogleSpreadsheet instance
    doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    // Xác thực với Google Sheets API cho phiên bản mới nhất
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    });

    // Tải thông tin từ spreadsheet
    await doc.loadInfo();
    console.log(`Đã kết nối với bảng tính: ${doc.title}`);
    
    // Đảm bảo các sheet cần thiết đã tồn tại
    if (!doc.sheetsByTitle.fields) {
      await doc.addSheet({ title: 'fields', headerValues: ['id', 'name', 'type', 'price', 'status'] });
      console.log('Đã tạo sheet fields');
    }
    
    if (!doc.sheetsByTitle.bookings) {
      await doc.addSheet({ title: 'bookings', headerValues: ['id', 'fieldId', 'customerName', 'customerPhone', 'date', 'startTime', 'endTime', 'price', 'status'] });
      console.log('Đã tạo sheet bookings');
    }
    
    if (!doc.sheetsByTitle.staff) {
      const staffSheet = await doc.addSheet({ title: 'staff', headerValues: ['id', 'fullName', 'username', 'password', 'phone', 'role', 'status'] });
      // Thêm admin mặc định nếu là sheet mới
      await staffSheet.addRow({
        id: '1',
        fullName: 'Quản trị viên',
        username: 'admin',
        password: 'admin123',
        phone: '0123456789',
        role: 'admin',
        status: 'active'
      });
      console.log('Đã tạo sheet staff với admin mặc định');
    }
  } catch (error) {
    console.error('Lỗi kết nối với Google Sheets:', error);
  }
}

// Định nghĩa các routes API

// API lấy danh sách sân bóng
app.get('/api/fields', async (req, res) => {
  try {
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }

    // Lấy sheet "fields"
    const sheet = doc.sheetsByTitle.fields || doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Chuyển đổi dữ liệu từ rows sang dạng đối tượng JSON
    const fields = rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      price: parseFloat(row.price),
      status: row.status
    }));

    res.json(fields);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sân bóng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API lấy danh sách đặt sân
app.get('/api/bookings', async (req, res) => {
  try {
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }

    // Lấy sheet "bookings"
    const sheet = doc.sheetsByTitle.bookings || doc.sheetsByIndex[1];
    const rows = await sheet.getRows();

    // Chuyển đổi dữ liệu từ rows sang dạng đối tượng JSON
    const bookings = rows.map(row => ({
      id: row.id,
      fieldId: row.fieldId,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      date: row.date,
      startTime: row.startTime,
      endTime: row.endTime,
      price: parseFloat(row.price),
      status: row.status
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt sân:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API tạo đặt sân mới
app.post('/api/bookings', async (req, res) => {
  try {
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }

    const { fieldId, customerName, customerPhone, date, startTime, endTime, price } = req.body;

    // Validate dữ liệu đầu vào
    if (!fieldId || !customerName || !customerPhone || !date || !startTime || !endTime || !price) {
      return res.status(400).json({ error: 'Thiếu thông tin đặt sân' });
    }

    // Lấy sheet "bookings"
    const sheet = doc.sheetsByTitle.bookings || doc.sheetsByIndex[1];
    const rows = await sheet.getRows();
    
    // Tạo ID mới
    const newId = rows.length > 0 ? Math.max(...rows.map(row => parseInt(row.id))) + 1 : 1;

    // Thêm dữ liệu vào sheet
    await sheet.addRow({
      id: newId.toString(),
      fieldId,
      customerName,
      customerPhone,
      date,
      startTime,
      endTime,
      price: price.toString(),
      status: 'confirmed'
    });

    res.status(201).json({ 
      id: newId,
      fieldId,
      customerName,
      customerPhone,
      date,
      startTime,
      endTime,
      price,
      status: 'confirmed'
    });
  } catch (error) {
    console.error('Lỗi khi tạo đặt sân mới:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API lấy danh sách nhân viên
app.get('/api/staff', async (req, res) => {
  try {
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }

    // Lấy sheet "staff"
    let sheet = doc.sheetsByTitle.staff;
    
    // Nếu sheet chưa tồn tại, tạo sheet mới
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'staff', headerValues: [
        'id', 'fullName', 'username', 'password', 'phone', 'role', 'status'
      ]});
      
      // Thêm admin mặc định nếu là sheet mới
      await sheet.addRow({
        id: '1',
        fullName: 'Quản trị viên',
        username: 'admin',
        password: 'admin123',
        phone: '0123456789',
        role: 'admin',
        status: 'active'
      });
    }
    
    const rows = await sheet.getRows();

    // Chuyển đổi dữ liệu từ rows sang dạng đối tượng JSON
    const staffList = rows.map(row => ({
      id: row.id,
      fullName: row.fullName,
      username: row.username,
      phone: row.phone,
      role: row.role,
      status: row.status
    }));

    res.json(staffList);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API tạo nhân viên mới
app.post('/api/staff', async (req, res) => {
  try {
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }

    const { fullName, username, password, phone, role, status } = req.body;

    // Validate dữ liệu đầu vào
    if (!fullName || !username || !password || !phone || !role || !status) {
      return res.status(400).json({ error: 'Thiếu thông tin nhân viên' });
    }

    // Lấy sheet "staff"
    const sheet = doc.sheetsByTitle.staff;
    
    // Kiểm tra xem tên đăng nhập đã tồn tại chưa
    const rows = await sheet.getRows();
    const existingUser = rows.find(row => row.username === username);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    }
    
    // Tạo ID mới
    const newId = rows.length > 0 ? Math.max(...rows.map(row => parseInt(row.id))) + 1 : 1;

    // Thêm dữ liệu vào sheet
    await sheet.addRow({
      id: newId.toString(),
      fullName,
      username,
      password,
      phone,
      role,
      status
    });

    res.status(201).json({ 
      id: newId,
      fullName,
      username,
      phone,
      role,
      status
    });
  } catch (error) {
    console.error('Lỗi khi tạo nhân viên mới:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API cập nhật nhân viên
app.put('/api/staff/:id', async (req, res) => {
  try {
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }

    const staffId = req.params.id;
    const { fullName, username, password, phone, role, status } = req.body;

    // Validate dữ liệu đầu vào
    if (!fullName || !username || !phone || !role || !status) {
      return res.status(400).json({ error: 'Thiếu thông tin nhân viên' });
    }

    // Lấy sheet "staff"
    const sheet = doc.sheetsByTitle.staff;
    const rows = await sheet.getRows();
    
    // Tìm nhân viên cần cập nhật
    const staffIndex = rows.findIndex(row => row.id === staffId);
    
    if (staffIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }
    
    // Kiểm tra xem tên đăng nhập đã tồn tại chưa (trừ nhân viên hiện tại)
    const existingUser = rows.find(row => row.username === username && row.id !== staffId);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    }
    
    // Cập nhật thông tin
    rows[staffIndex].fullName = fullName;
    rows[staffIndex].username = username;
    if (password) {
      rows[staffIndex].password = password;
    }
    rows[staffIndex].phone = phone;
    rows[staffIndex].role = role;
    rows[staffIndex].status = status;
    
    await rows[staffIndex].save();

    res.json({ 
      id: staffId,
      fullName,
      username,
      phone,
      role,
      status
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật nhân viên:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API xóa nhân viên
app.delete('/api/staff/:id', async (req, res) => {
  try {
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }

    const staffId = req.params.id;

    // Lấy sheet "staff"
    const sheet = doc.sheetsByTitle.staff;
    const rows = await sheet.getRows();
    
    // Tìm nhân viên cần xóa
    const staffIndex = rows.findIndex(row => row.id === staffId);
    
    if (staffIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }
    
    // Không cho phép xóa admin cuối cùng
    const adminCount = rows.filter(row => row.role === 'admin').length;
    if (rows[staffIndex].role === 'admin' && adminCount <= 1) {
      return res.status(400).json({ error: 'Không thể xóa quản trị viên duy nhất' });
    }
    
    // Xóa nhân viên
    await rows[staffIndex].delete();

    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa nhân viên:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API tổng quan doanh thu
app.get('/api/revenue', async (req, res) => {
  try {
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }

    // Lấy sheet "bookings"
    const sheet = doc.sheetsByTitle.bookings || doc.sheetsByIndex[1];
    const rows = await sheet.getRows();

    // Tính toán doanh thu
    const bookings = rows.map(row => ({
      date: row.date,
      price: parseFloat(row.price) || 0,
      status: row.status
    }));

    // Tạo bản tổng hợp theo ngày
    const dailyRevenue = {};
    bookings.forEach(booking => {
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        if (!dailyRevenue[booking.date]) {
          dailyRevenue[booking.date] = 0;
        }
        dailyRevenue[booking.date] += booking.price;
      }
    });

    // Chuyển đổi sang mảng để trả về
    const result = Object.keys(dailyRevenue).map(date => ({
      date,
      revenue: dailyRevenue[date]
    }));

    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu doanh thu:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Route mặc định trả về file HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API xác thực đăng nhập
app.post('/api/auth/login', async (req, res) => {
  try {
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }

    const { username, password } = req.body;

    // Validate dữ liệu đầu vào
    if (!username || !password) {
      return res.status(400).json({ error: 'Thiếu thông tin đăng nhập' });
    }

    // Lấy sheet "staff"
    const sheet = doc.sheetsByTitle.staff;
    if (!sheet) {
      return res.status(500).json({ error: 'Không tìm thấy bảng dữ liệu nhân viên' });
    }
    
    const rows = await sheet.getRows();
    
    // Tìm người dùng với tên đăng nhập phù hợp
    const user = rows.find(row => row.username === username && row.status === 'active');
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    
    // Tạo token đơn giản (trong thực tế nên dùng JWT)
    const token = Buffer.from(`${username}-${Date.now()}`).toString('base64');
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API kiểm tra thông tin người dùng hiện tại
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Không có token xác thực' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Giải mã token đơn giản (giả lập)
    // Trong thực tế, đây là nơi để xác thực JWT token
    
    // Nếu có token hợp lệ, trả về thông tin người dùng giả định
    // Trong ứng dụng thực tế, bạn sẽ truy vấn thông tin người dùng từ cơ sở dữ liệu
    
    if (!doc) {
      return res.status(500).json({ error: 'Chưa kết nối với Google Sheets' });
    }
    
    const sheet = doc.sheetsByTitle.staff;
    const rows = await sheet.getRows();
    
    // Ví dụ giả định: Trích xuất tên người dùng từ token (chỉ để demo)
    // Trong thực tế, bạn sẽ truy vấn người dùng dựa trên ID được lưu trong token đã được xác thực
    const tokenParts = Buffer.from(token, 'base64').toString().split('-');
    const username = tokenParts[0];
    
    const user = rows.find(row => row.username === username && row.status === 'active');
    
    if (!user) {
      return res.status(401).json({ error: 'Token không hợp lệ' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role
    });
  } catch (error) {
    console.error('Lỗi khi xác thực người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Khởi động server
app.listen(PORT, async () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  await connectToSpreadsheet();
});