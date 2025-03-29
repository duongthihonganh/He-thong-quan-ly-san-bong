// Staff management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const staffTable = document.getElementById('staff-table');
    const addStaffBtn = document.getElementById('add-staff-btn');
    const staffModal = document.getElementById('staff-modal');
    const staffForm = document.getElementById('staff-form');
    const staffModalTitle = document.getElementById('staff-modal-title');
    const cancelStaffBtn = document.getElementById('cancel-staff-btn');
    const closeModalBtns = staffModal.querySelectorAll('.close-modal');
    
    // Initialize
    loadStaffData();
    
    // Event listeners
    addStaffBtn.addEventListener('click', () => openAddStaffModal());
    staffForm.addEventListener('submit', handleStaffFormSubmit);
    cancelStaffBtn.addEventListener('click', () => closeModal(staffModal));
    closeModalBtns.forEach(btn => btn.addEventListener('click', () => closeModal(staffModal)));
    
    // Functions
    function loadStaffData() {
        fetch('/api/staff')
            .then(response => response.json())
            .then(data => {
                renderStaffTable(data);
            })
            .catch(error => {
                console.error('Error loading staff data:', error);
                showNotification('Không thể tải dữ liệu nhân viên', 'error');
            });
    }
    
    function renderStaffTable(staffList) {
        const tbody = staffTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (staffList.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="7" class="empty-table">Không có dữ liệu nhân viên</td>`;
            tbody.appendChild(emptyRow);
            return;
        }
        
        staffList.forEach(staff => {
            const row = document.createElement('tr');
            
            // Map role values to display text
            const roleDisplay = {
                'admin': 'Quản trị viên',
                'manager': 'Quản lý',
                'staff': 'Nhân viên'
            };
            
            // Map status values to display text and style
            const statusDisplay = {
                'active': '<span class="status-badge active">Đang làm việc</span>',
                'inactive': '<span class="status-badge inactive">Tạm nghỉ</span>'
            };
            
            row.innerHTML = `
                <td>${staff.id}</td>
                <td>${staff.fullName}</td>
                <td>${staff.username}</td>
                <td>${staff.phone}</td>
                <td>${roleDisplay[staff.role] || staff.role}</td>
                <td>${statusDisplay[staff.status] || staff.status}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${staff.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${staff.id}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            
            tbody.appendChild(row);
            
            // Add event listeners to the buttons
            row.querySelector('.edit-btn').addEventListener('click', () => openEditStaffModal(staff));
            row.querySelector('.delete-btn').addEventListener('click', () => confirmDeleteStaff(staff));
        });
    }
    
    function openAddStaffModal() {
        staffModalTitle.textContent = 'Thêm nhân viên mới';
        staffForm.reset();
        staffForm.dataset.mode = 'add';
        document.getElementById('staff-id').value = '';
        document.getElementById('staff-password').required = true;
        openModal(staffModal);
    }
    
    function openEditStaffModal(staff) {
        staffModalTitle.textContent = 'Chỉnh sửa thông tin nhân viên';
        staffForm.dataset.mode = 'edit';
        document.getElementById('staff-id').value = staff.id;
        document.getElementById('staff-fullname').value = staff.fullName;
        document.getElementById('staff-username').value = staff.username;
        document.getElementById('staff-password').required = false;
        document.getElementById('staff-password').value = '';
        document.getElementById('staff-phone').value = staff.phone;
        document.getElementById('staff-role').value = staff.role;
        document.getElementById('staff-status').value = staff.status;
        openModal(staffModal);
    }
    
    function handleStaffFormSubmit(event) {
        event.preventDefault();
        
        const staffId = document.getElementById('staff-id').value;
        const fullName = document.getElementById('staff-fullname').value;
        const username = document.getElementById('staff-username').value;
        const password = document.getElementById('staff-password').value;
        const phone = document.getElementById('staff-phone').value;
        const role = document.getElementById('staff-role').value;
        const status = document.getElementById('staff-status').value;
        
        const staffData = {
            fullName,
            username,
            phone,
            role,
            status
        };
        
        // Add password only if it's provided
        if (password) {
            staffData.password = password;
        }
        
        const isEdit = staffForm.dataset.mode === 'edit';
        const url = isEdit ? `/api/staff/${staffId}` : '/api/staff';
        const method = isEdit ? 'PUT' : 'POST';
        
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(staffData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            closeModal(staffModal);
            loadStaffData();
            showNotification(isEdit ? 'Cập nhật nhân viên thành công' : 'Thêm nhân viên thành công', 'success');
        })
        .catch(error => {
            console.error('Error saving staff:', error);
            showNotification('Không thể lưu thông tin nhân viên', 'error');
        });
    }
    
    function confirmDeleteStaff(staff) {
        if (confirm(`Bạn có chắc chắn muốn xóa nhân viên "${staff.fullName}"?`)) {
            deleteStaff(staff.id);
        }
    }
    
    function deleteStaff(staffId) {
        fetch(`/api/staff/${staffId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            loadStaffData();
            showNotification('Xóa nhân viên thành công', 'success');
        })
        .catch(error => {
            console.error('Error deleting staff:', error);
            showNotification('Không thể xóa nhân viên', 'error');
        });
    }
});