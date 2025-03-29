const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// Google Sheets API configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
  });
  
  const authToken = await auth.getClient();
  return authToken;
}

async function getGoogleSheetsInstance() {
  const authToken = await getAuthToken();
  return google.sheets({ version: 'v4', auth: authToken });
}

// Hàm để đảm bảo các sheet cần thiết tồn tại
async function ensureRequiredSheets() {
  const sheets = await getGoogleSheetsInstance();
  
  // Lấy thông tin spreadsheet
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID
  });
  
  const existingSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
  const requiredSheets = ['users', 'fields', 'bookings', 'customers', 'services'];
  
  // Kiểm tra và tạo các sheet còn thiếu
  for (const sheetName of requiredSheets) {
    if (!existingSheets.includes(sheetName)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }
          ]
        }
      });
      
      // Thêm header cho mỗi sheet mới
      const headerValues = getHeadersForSheet(sheetName);
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${sheetName}!A1:Z1`,
        valueInputOption: 'RAW',
        resource: {
          values: [headerValues]
        }
      });
      
      console.log(`Đã tạo sheet ${sheetName}`);
    }
  }
  
  // Thêm một admin mặc định nếu chưa có dữ liệu trong users
  const usersData = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'users!A2:F'
  });
  
  if (!usersData.data.values || usersData.data.values.length === 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'users!A2:F2',
      valueInputOption: 'RAW',
      resource: {
        values: [['1', 'Quản trị viên', 'admin', 'admin123', '0123456789', 'admin', 'active']]
      }
    });
    console.log('Đã thêm admin mặc định');
  }
}

// Hàm lấy header cho từng loại sheet
function getHeadersForSheet(sheetName) {
  switch (sheetName) {
    case 'users':
      return ['id', 'fullName', 'username', 'password', 'phone', 'role', 'status'];
    case 'fields':
      return ['id', 'name', 'type', 'price', 'status'];
    case 'bookings':
      return ['id', 'fieldId', 'customerName', 'customerPhone', 'date', 'startTime', 'endTime', 'price', 'status'];
    case 'customers':
      return ['id', 'name', 'phone', 'email', 'address', 'bookingCount', 'totalSpent'];
    case 'services':
      return ['id', 'name', 'price', 'description', 'status'];
    default:
      return [];
  }
}

// API cho authentication
exports.api = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Đảm bảo sheet đã được tạo
      await ensureRequiredSheets();
      
      const sheets = await getGoogleSheetsInstance();
      const path = req.path.split('/').filter(Boolean);
      
      // Handle authentication routes
      if (path[0] === 'auth') {
        // Login
        if (path[1] === 'login' && req.method === 'POST') {
          const { username, password } = req.body;
          
          if (!username || !password) {
            return res.status(400).json({ error: 'Thiếu thông tin đăng nhập' });
          }
          
          // Tìm user trong sheet users
          const usersData = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'users!A2:G'
          });
          
          const users = usersData.data.values || [];
          const user = users.find(row => row[2] === username && row[3] === password && row[6] === 'active');
          
          if (!user) {
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
          }
          
          // Tạo token đơn giản
          const token = Buffer.from(`${username}-${Date.now()}`).toString('base64');
          
          return res.json({
            token,
            user: {
              id: user[0],
              username: user[2],
              fullName: user[1],
              role: user[5]
            }
          });
        }
        
        // Get current user
        if (path[1] === 'me' && req.method === 'GET') {
          const authHeader = req.headers.authorization;
          
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Không có token xác thực' });
          }
          
          const token = authHeader.split(' ')[1];
          
          // Giải mã token đơn giản (giả lập)
          try {
            const tokenParts = Buffer.from(token, 'base64').toString().split('-');
            const username = tokenParts[0];
            
            // Tìm user trong sheet users
            const usersData = await sheets.spreadsheets.values.get({
              spreadsheetId: SHEET_ID,
              range: 'users!A2:G'
            });
            
            const users = usersData.data.values || [];
            const user = users.find(row => row[2] === username && row[6] === 'active');
            
            if (!user) {
              return res.status(401).json({ error: 'Token không hợp lệ' });
            }
            
            return res.json({
              id: user[0],
              username: user[2],
              fullName: user[1],
              role: user[5]
            });
          } catch (error) {
            return res.status(401).json({ error: 'Token không hợp lệ' });
          }
        }
      }
      
      // Handle fields routes
      if (path[0] === 'fields') {
        // Get all fields
        if (req.method === 'GET') {
          const fieldsData = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'fields!A2:E'
          });
          
          const rows = fieldsData.data.values || [];
          const fields = rows.map(row => ({
            id: row[0],
            name: row[1],
            type: row[2],
            price: parseFloat(row[3] || 0),
            status: row[4]
          }));
          
          return res.json(fields);
        }
        
        // Create a new field
        if (req.method === 'POST') {
          const { name, type, price, status } = req.body;
          
          if (!name || !type || !price || !status) {
            return res.status(400).json({ error: 'Thiếu thông tin sân bóng' });
          }
          
          // Get data to determine next ID
          const fieldsData = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'fields!A2:A'
          });
          
          const existingIds = (fieldsData.data.values || []).map(row => parseInt(row[0] || 0));
          const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
          
          // Add new field
          await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'fields!A2',
            valueInputOption: 'RAW',
            resource: {
              values: [[newId.toString(), name, type, price.toString(), status]]
            }
          });
          
          return res.status(201).json({
            id: newId,
            name,
            type,
            price: parseFloat(price),
            status
          });
        }
      }
      
      // Handle bookings routes
      if (path[0] === 'bookings') {
        // Get all bookings
        if (req.method === 'GET') {
          const bookingsData = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'bookings!A2:I'
          });
          
          const rows = bookingsData.data.values || [];
          const bookings = rows.map(row => ({
            id: row[0],
            fieldId: row[1],
            customerName: row[2],
            customerPhone: row[3],
            date: row[4],
            startTime: row[5],
            endTime: row[6],
            price: parseFloat(row[7] || 0),
            status: row[8]
          }));
          
          return res.json(bookings);
        }
        
        // Create a new booking
        if (req.method === 'POST') {
          const { fieldId, customerName, customerPhone, date, startTime, endTime, price } = req.body;
          
          if (!fieldId || !customerName || !customerPhone || !date || !startTime || !endTime || !price) {
            return res.status(400).json({ error: 'Thiếu thông tin đặt sân' });
          }
          
          // Get data to determine next ID
          const bookingsData = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'bookings!A2:A'
          });
          
          const existingIds = (bookingsData.data.values || []).map(row => parseInt(row[0] || 0));
          const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
          
          // Add new booking
          await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'bookings!A2',
            valueInputOption: 'RAW',
            resource: {
              values: [[newId.toString(), fieldId, customerName, customerPhone, date, startTime, endTime, price.toString(), 'confirmed']]
            }
          });
          
          return res.status(201).json({
            id: newId,
            fieldId,
            customerName,
            customerPhone,
            date,
            startTime,
            endTime,
            price: parseFloat(price),
            status: 'confirmed'
          });
        }
      }
      
      // Handle staff/users routes
      if (path[0] === 'staff') {
        // Get all staff
        if (req.method === 'GET') {
          const usersData = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'users!A2:G'
          });
          
          const rows = usersData.data.values || [];
          const staffList = rows.map(row => ({
            id: row[0],
            fullName: row[1],
            username: row[2],
            phone: row[4],
            role: row[5],
            status: row[6]
          }));
          
          return res.json(staffList);
        }
        
        // Create a new staff member
        if (req.method === 'POST') {
          const { fullName, username, password, phone, role, status } = req.body;
          
          if (!fullName || !username || !password || !phone || !role || !status) {
            return res.status(400).json({ error: 'Thiếu thông tin nhân viên' });
          }
          
          // Check if username already exists
          const usersData = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'users!A2:G'
          });
          
          const rows = usersData.data.values || [];
          const existingUser = rows.find(row => row[2] === username);
          
          if (existingUser) {
            return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
          }
          
          // Get data to determine next ID
          const existingIds = rows.map(row => parseInt(row[0] || 0));
          const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
          
          // Add new staff
          await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'users!A2',
            valueInputOption: 'RAW',
            resource: {
              values: [[newId.toString(), fullName, username, password, phone, role, status]]
            }
          });
          
          return res.status(201).json({
            id: newId,
            fullName,
            username,
            phone,
            role,
            status
          });
        }
      }
      
      // Handle revenue route
      if (path[0] === 'revenue' && req.method === 'GET') {
        const bookingsData = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: 'bookings!A2:I'
        });
        
        const rows = bookingsData.data.values || [];
        const bookings = rows
          .filter(row => row[8] === 'confirmed' || row[8] === 'completed')
          .map(row => ({
            date: row[4],
            price: parseFloat(row[7] || 0),
            status: row[8]
          }));
        
        // Tạo bản tổng hợp theo ngày
        const dailyRevenue = {};
        bookings.forEach(booking => {
          if (!dailyRevenue[booking.date]) {
            dailyRevenue[booking.date] = 0;
          }
          dailyRevenue[booking.date] += booking.price;
        });
        
        // Chuyển đổi sang mảng để trả về
        const result = Object.keys(dailyRevenue).map(date => ({
          date,
          revenue: dailyRevenue[date]
        }));
        
        return res.json(result);
      }
      
      // If no route is matched
      return res.status(404).json({ error: 'API endpoint không tồn tại' });
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
  });
});