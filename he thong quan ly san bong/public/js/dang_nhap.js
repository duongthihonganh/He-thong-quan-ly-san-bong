document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageContainer = document.getElementById('loginMessage');
    
    // Nếu đã đăng nhập, chuyển hướng tới trang chính
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthAndRedirect(token);
    }
    
    // Xử lý đăng nhập
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // Hiển thị thông báo đang xử lý
      showMessage('Đang xử lý...', 'info');
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Lưu token và thông tin người dùng
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Hiển thị thông báo thành công
          showMessage('Đăng nhập thành công! Đang chuyển hướng...', 'success');
          
          // Chuyển hướng đến trang chính sau 1 giây
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          // Hiển thị thông báo lỗi
          showMessage(data.error || 'Đăng nhập thất bại', 'error');
        }
      } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        showMessage('Lỗi kết nối đến máy chủ', 'error');
      }
    });
    
    // Hàm kiểm tra token và chuyển hướng
    async function checkAuthAndRedirect(token) {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          window.location.href = '/';
        } else {
          // Token không hợp lệ, xóa khỏi localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // Hàm hiển thị thông báo
    function showMessage(message, type = 'info') {
      messageContainer.innerHTML = '';
      
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      
      switch (type) {
        case 'success':
          messageElement.classList.add('message-success');
          break;
        case 'error':
          messageElement.classList.add('message-error');
          break;
        case 'warning':
          messageElement.classList.add('message-warning');
          break;
        default:
          messageElement.textContent = message;
      }
      
      messageElement.textContent = message;
      messageContainer.appendChild(messageElement);
    }
  });