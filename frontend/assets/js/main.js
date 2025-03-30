document.addEventListener('DOMContentLoaded', function() {
  // Set up dropdown toggles
  setupDropdowns();
  
  // Handle logout button
  setupLogout();
  
  // Check if user is logged in (except on login page)
  if (!window.location.pathname.includes('login.html')) {
    checkAuth();
  }
  
  // Set up the user display if on dashboard
  setupUserDisplay();
});

// Set up dropdown menus
function setupDropdowns() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const dropdownMenu = this.nextElementSibling;
      if (dropdownMenu.classList.contains('dropdown-menu')) {
        dropdownMenu.classList.toggle('show');
        
        // Close when clicking outside
        document.addEventListener('click', function closeDropdown(e) {
          if (!toggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
            document.removeEventListener('click', closeDropdown);
          }
        });
      }
    });
  });
}

// Set up logout functionality
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Clear user data
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = 'login.html';
    });
  }
}

// Check if user is authenticated
function checkAuth() {
  console.log('checkAuth called in main.js');
  const userJson = localStorage.getItem('user');
  console.log('User data from localStorage in main.js:', userJson);
  
  if (!userJson) {
    console.log('No user data, redirecting to login.html');
    // Not logged in, redirect to login
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const user = JSON.parse(userJson);
    console.log('Parsed user data in main.js:', user);
    
    if (!user || !user.id) {
      console.log('Invalid user (no id), redirecting to login.html');
      // Invalid user data, redirect to login
      window.location.href = 'login.html';
    } else {
      console.log('Valid user authenticated in main.js');
    }
  } catch (e) {
    console.error('Error parsing user data in main.js:', e);
    // Invalid user data, redirect to login
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
}

// Setup user display in the header
function setupUserDisplay() {
  const userNameElement = document.querySelector('.user-name');
  const userRoleElement = document.querySelector('.user-role');
  
  if (userNameElement && userRoleElement) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        userNameElement.textContent = user.fullName || 'Người dùng';
        
        const roleText = {
          'admin': 'Quản trị viên',
          'manager': 'Quản lý',
          'staff': 'Nhân viên'
        };
        
        userRoleElement.textContent = roleText[user.role] || 'Người dùng';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }
}