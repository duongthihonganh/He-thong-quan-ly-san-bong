document.addEventListener('DOMContentLoaded', function() {
  console.log('Login page loaded successfully');
  // Elements
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.querySelector('button[type="submit"]');
  const loginError = document.getElementById('loginError');
  
  // Handle form submission
  if (loginForm) {
    console.log('Found login form, adding submit event listener');
    loginForm.addEventListener('submit', function(e) {
      console.log('Form submitted');
      e.preventDefault();
      attemptLogin();
    });
  }
  
  // Login button click
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      attemptLogin();
    });
  }
  
  // Attempt to login
  function attemptLogin() {
    console.log('attemptLogin function called');
    
    // Get values
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    console.log('Input values:', { username, password });
    
    // Basic validation
    if (!username || !password) {
      showError('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }
    
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang đăng nhập...';
    hideError();
    
    // In a real app, we would call the API
    console.log('Attempting login with:', { username, password });
    
    // Simulate API delay
    setTimeout(() => {
      // For demo purposes, we'll accept any admin/admin or staff/staff combination
      if ((username === 'admin' && password === 'admin') || 
          (username === 'staff' && password === 'staff')) {
        
        // Store user info in session/local storage
        const user = {
          id: username === 'admin' ? 1 : 2,
          username: username,
          fullName: username === 'admin' ? 'Quản trị viên' : 'Nhân viên',
          role: username === 'admin' ? 'admin' : 'staff'
        };
        
        console.log('Login successful, user data:', user);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to dashboard
        console.log('Redirecting to index.html...');
        window.location.href = 'index.html';
      } else {
        // Show error
        showError('Tên đăng nhập hoặc mật khẩu không đúng.');
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Đăng nhập';
      }
    }, 1000);
  }
  
  // Show error message
  function showError(message) {
    if (loginError) {
      loginError.textContent = message;
      loginError.style.display = 'block';
    }
  }
  
  // Hide error message
  function hideError() {
    if (loginError) {
      loginError.style.display = 'none';
    }
  }
  
  // Check if user is already logged in
  function checkLoggedInStatus() {
    console.log('checkLoggedInStatus called');
    const userJson = localStorage.getItem('user');
    console.log('User data from localStorage:', userJson);
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        console.log('Parsed user data:', user);
        
        if (user && user.id) {
          console.log('Valid user found, redirecting to dashboard');
          // User is already logged in, redirect to dashboard
          window.location.href = 'index.html';
        } else {
          console.log('Invalid user data (no id)');
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user');
      }
    } else {
      console.log('No user data in localStorage');
    }
  }
  
  // Check logged in status on page load
  checkLoggedInStatus();
});