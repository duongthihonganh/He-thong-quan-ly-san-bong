const customerList = [
    { 
      customerId: 1, 
      customerName: 'Hứa Quang Hán', 
      customerType: 'individual', 
      customerEmail: 'hqh@example.com', 
      customerPhone: '0901234567', 
      customerAddress: 'Số 123, Đường ABC, Quận 1, TP HCM', 
      taxCode: '123123', 
      customerNotes: '' ,
      contactPerson:''
    },
    { 
        customerId: 2, 
        customerName: 'Hứa Quang Hán', 
        customerType: 'club', 
        customerEmail: 'hqh@example.com', 
        customerPhone: '0901234567', 
        customerAddress: 'Số 123, Đường ABC, Quận 1, TP HCM', 
        taxCode: '123123', 
        customerNotes: '' ,
        contactPerson:''
      },
  ];
const customer = {
    customerId: 2, 
    customerName: '', 
    customerType: '', 
    customerEmail: '', 
    customerPhone: '', 
    customerAddress: '', 
    taxCode: '', 
    customerNotes: '' ,
    contactPerson:''
}
let titleFrom = ''
let id = 0
let index = 0
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const customersTable = document.querySelector('#customersTable tbody');
    const newCustomerBtn = document.getElementById('newCustomerBtn');
    const customerModal = document.getElementById('customerModal');
    const viewCustomerModal = document.getElementById('viewCustomerModal');
    const cancelCustomerBtn = document.getElementById('cancelCustomerBtn');
    const saveCustomerBtn = document.getElementById('saveCustomerBtn');
    const closeViewCustomerBtn = document.getElementById('closeViewCustomerBtn');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const customerFilterBtn = document.getElementById('customerFilterBtn');
    const customerForm = document.getElementById('customerForm');
    
    
    // Fetch staff data
    fetchCustomer();
    
    // Initialize event listeners
    if (newCustomerBtn) {
        newCustomerBtn.addEventListener('click', function() {
        titleFrom = 'Thêm khách hàng mới'
        console.log(titleFrom)
        openAddStaffModal();
      });
    }
    
    if (cancelCustomerBtn) {
        cancelCustomerBtn.addEventListener('click', function() {
            customerModal.classList.remove('show');
      });
    }
    
    if (saveCustomerBtn) {
        if (saveCustomerBtn) {
            saveCustomerBtn.addEventListener('click', function() {
                if (titleFrom === 'Thêm khách hàng mới') {
                    saveStaff();
                } 
            });
        }
    }
    
    if (closeViewCustomerBtn) {
        closeViewCustomerBtn.addEventListener('click', function() {
        viewCustomerModal.classList.remove('show');
      });
    }
    
    if (customerFilterBtn) {
      customerFilterBtn.addEventListener('click', function() {
        const customerNameFilter = document.getElementById('customerNameFilter').value;
        const customerTypeFilter = document.getElementById('customerTypeFilter').value;
        fetchCustomer(customerNameFilter, customerTypeFilter);
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
    
  });
  
  // Open add staff modal
  function openAddStaffModal() {
    const customerForm = document.getElementById('customerForm');
    const customerModal = document.getElementById('customerModal');
    const modalTitle = customerModal.querySelector('.modal-title');
    
    if (customerForm) customerForm.reset();
    
    // Set default values
    document.getElementById('customerType').value = 'individual';
    
    // Set modal title
    if (modalTitle) modalTitle.textContent = 'Thêm khách hàng mới';
    
    // Show modal
    customerModal.classList.add('show');
  }
  
  // Save staff
  function saveStaff() {
    const customerForm = document.getElementById('customerForm');
    const customerModal = document.getElementById('customerModal');
    // Get form data
    customer.customerId++ 
    customer.customerName = document.getElementById('customerName').value;
    customer.customerType = document.getElementById('customerType').value;
    customer.customerPhone = document.getElementById('customerPhone').value;
    customer.customerEmail = document.getElementById('customerEmail').value;
    customer.customerAddress = document.getElementById('customerAddress').value;
    customer.taxCode = document.getElementById('taxCode').value;
    customer.contactPerson = document.getElementById('contactPerson').value;
    customer.customerNotes = document.getElementById('customerNotes').value;
    
    // Basic validation
    if (!customer.customerName) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }
    
    if (!customer.customerType) {
      alert('Vui lòng chọn loại khách hàng.');
      return;
    }
    
    if (!customer.customerEmail) {
      alert('Vui lòng nhập email.');
      return;
    }
    
    if (!customer.customerPhone) {
      alert('Vui lòng nhập số điện thoại.');
      return;
    }
    if (!customer.customerAddress) {
        alert('Vui lòng nhập địa chỉ');
        return;
    }
    
    
    // Simulate successful save
    customerList.push({...customer})
    alert('Đã lưu thông tin khách hàng thành công!');

    customerModal.classList.remove('show');

    // Refresh the staff table
    fetchCustomer();
  }
  
  // Fetch staff
  function fetchCustomer(customerNameFilter = '', customerTypeFilter = '') {
    const customersTable = document.querySelector('#customersTable tbody');
    
    if (!customersTable) return;
    
    // Show loading indicator
    customersTable.innerHTML = '<tr><td colspan="7" class="text-center">Đang tải dữ liệu...</td></tr>';

    // Simulate API delay
    setTimeout(() => {
      // Filter staff if filters are provided
      let filteredCustomer = [...customerList];
      
      if (customerNameFilter) {
        filteredCustomer = filteredCustomer.filter(customer => 
          customer.customerName.toLowerCase().includes(customerNameFilter.toLowerCase()) || customer.customerPhone.includes(customerNameFilter)
        );
      }
      if (customerTypeFilter) {
        filteredCustomer = filteredCustomer.filter(customer => customer.customerType === customerTypeFilter);
      }
      
      // Populate table
      if (filteredCustomer.length === 0) {
        staffTable.innerHTML = '<tr><td colspan="7" class="text-center">Không tìm thấy dữ liệu phù hợp</td></tr>';
        return;
      }
      
      let html = '';
      filteredCustomer.forEach(customer => {
        html += `
          <tr>
            <td>${customer.customerId}</td>
            <td>${customer.customerName}</td>
            <td>${customer.customerPhone}</td>
            <td>${customer.customerEmail}</td>
            <td>${customer.customerAddress}</td>
            <td>${getRoleText(customer.customerType)}</td>
            <td>
              <a href="#" class="action-btn view-staff" data-id="${customer.customerId}"><i class="fas fa-eye"></i></a>
              <a href="#" class="action-btn edit-staff" data-id="${customer.customerId}"><i class="fas fa-edit"></i></a>
            </td>
          </tr>
        `;
      });
      
      customersTable.innerHTML = html;
      
      // Add event listeners to view/edit buttons
      document.querySelectorAll('.view-staff').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          id = parseInt(this.getAttribute('data-id'));
          viewCustomer(id);
        });
      });
      
      document.querySelectorAll('.edit-staff').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          id = parseInt(this.getAttribute('data-id'));
          console.log(id)
          titleFrom = 'Chỉnh sửa khách hàng'
          console.log
          editStaff(id);
        });
      });
    }, 500); // Simulate network delay
  }
  
  // View staff details
  function viewCustomer(id) {
    const customertemp = customerList.find(item => item.customerId === id);
    const viewCustomerModal = document.getElementById('viewCustomerModal');

    // In a real app, we would fetch staff details from API
    // Simulate fetching staff by ID
    
    // Populate view modal with staff details
    document.getElementById('viewCustomerId').textContent = customertemp.customerId;
    document.getElementById('viewCustomerName').textContent = customertemp.customerName;
    document.getElementById('viewCustomerType').textContent = getRoleText(customertemp.customerType);
    document.getElementById('viewCustomerPhone').textContent = customertemp.customerPhone;
    document.getElementById('viewCustomerEmail').textContent = customertemp.customerEmail;
    document.getElementById('viewCustomerAddress').textContent = customertemp.customerAddress;
    document.getElementById('viewTaxCode').textContent = customertemp.taxCode
    document.getElementById('viewContactPerson').textContent = customertemp.contactPerson;
    document.getElementById('viewCustomerNotes').textContent = customertemp.customerNotes || '(Không có ghi chú)';
    // Show the modal
    viewCustomerModal.classList.add('show');
  }
  
  // Edit staff
  function editStaff(id) {
    const customerModal = document.getElementById('customerModal');
    customerModal.classList.add('show');
    const modalTitle = customerModal.querySelector('.modal-title');
    if (modalTitle) modalTitle.innerText = 'Chỉnh sửa khách hàng';
    const customertemp = customerList.find(item =>  item.customerId === id)
    index = customerList.findIndex(item => item.customerId === id)
    // Populate form with customer details
    document.getElementById('customerName').value = customertemp.customerName;
    document.getElementById('customerType').value = customertemp.customerType;
    document.getElementById('customerPhone').value = customertemp.customerPhone;
    document.getElementById('customerEmail').value = customertemp.customerEmail;
    document.getElementById('customerAddress').value = customertemp.customerAddress;
    document.getElementById('taxCode').value = customertemp.taxCode
    document.getElementById('contactPerson').value = customertemp.contactPerson;
    document.getElementById('customerNotes').value = customertemp.customerNotes || '(Không có ghi chú)';
    document.getElementById('saveCustomerBtn').onclick = function () {
        customerList[index] = {
            customerId: customertemp.customerId, // Giữ nguyên ID
            customerName: document.getElementById('customerName').value,
            customerType: document.getElementById('customerType').value,
            customerEmail: document.getElementById('customerEmail').value,
            customerPhone: document.getElementById('customerPhone').value,
            customerAddress: document.getElementById('customerAddress').value,
            taxCode: document.getElementById('taxCode').value,
            customerNotes: document.getElementById('customerNotes').value,
            contactPerson: document.getElementById('contactPerson').value
        };

        alert("Cập nhật thông tin khách hàng thành công!");
        customerModal.classList.remove('show');
        fetchCustomer(); 
    };

  }
  // Helper functions
  
  // Get role text
  function getRoleText(role) {
    const roleMap = {
      'individual': 'Cá nhân',
      'company': 'Doanh nghiệp',
      'club': 'Câu lạc bộ'
    };
    
    return roleMap[role] || 'Không xác định';
  }
  