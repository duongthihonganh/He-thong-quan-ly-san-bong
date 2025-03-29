// Tải dữ liệu sân bóng
async function loadFieldsData() {
    const fieldsTable = document.querySelector('#fields-table tbody');
    if (!fieldsTable) return;
    
    // Xóa dữ liệu cũ
    fieldsTable.innerHTML = '';
    
    try {
        // Gọi API lấy danh sách sân bóng
        const fields = await fetchAPI('/fields');
        
        if (fields && fields.length > 0) {
            // Hiển thị dữ liệu
            fields.forEach(field => {
                const row = document.createElement('tr');
                
                // Tạo style cho trạng thái
                let statusClass = '';
                let statusText = '';
                
                switch (field.status) {
                    case 'available':
                        statusClass = 'status-available';
                        statusText = 'Khả dụng';
                        break;
                    case 'maintenance':
                        statusClass = 'status-maintenance';
                        statusText = 'Bảo trì';
                        break;
                    case 'closed':
                        statusClass = 'status-booked';
                        statusText = 'Đóng cửa';
                        break;
                    default:
                        statusClass = '';
                        statusText = field.status;
                }
                
                // Tạo hiển thị loại sân
                let fieldType = '';
                switch (field.type) {
                    case 'mini':
                        fieldType = 'Sân mini';
                        break;
                    case '5':
                        fieldType = 'Sân 5 người';
                        break;
                    case '7':
                        fieldType = 'Sân 7 người';
                        break;
                    case '11':
                        fieldType = 'Sân 11 người';
                        break;
                    default:
                        fieldType = field.type;
                }
                
                row.innerHTML = `
                    <td>${field.id}</td>
                    <td>${field.name}</td>
                    <td>${fieldType}</td>
                    <td>${formatCurrency(field.price)}</td>
                    <td><span class="field-status-badge ${statusClass}">${statusText}</span></td>
                    <td class="table-actions">
                        <button class="edit-btn" data-id="${field.id}">Sửa</button>
                        <button class="delete-btn" data-id="${field.id}">Xóa</button>
                    </td>
                `;
                
                fieldsTable.appendChild(row);
            });
            
            // Thêm event listeners cho các nút
            addFieldButtonListeners();
        } else {
            fieldsTable.innerHTML = '<tr><td colspan="6" class="no-data">Không có dữ liệu sân bóng</td></tr>';
        }
    } catch (error) {
        console.error('Error loading fields:', error);
        fieldsTable.innerHTML = '<tr><td colspan="6" class="error-data">Lỗi khi tải dữ liệu</td></tr>';
    }
}

// Thêm event listeners cho các nút trong bảng sân bóng
function addFieldButtonListeners() {
    // Xử lý nút sửa
    const editButtons = document.querySelectorAll('#fields-table .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const fieldId = button.dataset.id;
            await loadFieldForEdit(fieldId);
        });
    });
    
    // Xử lý nút xóa
    const deleteButtons = document.querySelectorAll('#fields-table .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const fieldId = button.dataset.id;
            if (confirm('Bạn có chắc chắn muốn xóa sân bóng này không?')) {
                await deleteField(fieldId);
            }
        });
    });
}

// Tải dữ liệu sân bóng để sửa
async function loadFieldForEdit(fieldId) {
    try {
        const fields = await fetchAPI('/fields');
        const field = fields.find(f => f.id.toString() === fieldId);
        
        if (field) {
            // Điền dữ liệu vào form
            document.getElementById('field-id').value = field.id;
            document.getElementById('field-name').value = field.name;
            document.getElementById('field-type').value = field.type;
            document.getElementById('field-price').value = field.price;
            document.getElementById('field-status').value = field.status;
            
            // Cập nhật tiêu đề modal
            document.getElementById('field-modal-title').textContent = 'Sửa thông tin sân bóng';
            
            // Hiện modal
            document.getElementById('field-modal').classList.add('show');
        } else {
            showNotification('Không tìm thấy thông tin sân bóng', 'error');
        }
    } catch (error) {
        console.error('Error loading field for edit:', error);
        showNotification('Lỗi khi tải dữ liệu sân bóng', 'error');
    }
}

// Xử lý submit form thêm/sửa sân bóng
async function handleFieldSubmit() {
    const fieldId = document.getElementById('field-id').value;
    const name = document.getElementById('field-name').value;
    const type = document.getElementById('field-type').value;
    const price = document.getElementById('field-price').value;
    const status = document.getElementById('field-status').value;
    
    if (!name || !type || !price) {
        showNotification('Vui lòng điền đầy đủ thông tin sân bóng', 'error');
        return;
    }
    
    try {
        // Tạo đối tượng dữ liệu
        const fieldData = {
            name,
            type,
            price: parseFloat(price),
            status
        };
        
        let response;
        
        if (fieldId) {
            // Cập nhật sân bóng
            response = await fetchAPI(`/fields/${fieldId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fieldData)
            });
            
            showNotification('Cập nhật sân bóng thành công');
        } else {
            // Thêm mới sân bóng
            response = await fetchAPI('/fields', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fieldData)
            });
            
            showNotification('Thêm sân bóng mới thành công');
        }
        
        // Đóng modal
        closeAllModals();
        
        // Tải lại dữ liệu
        await loadFieldsData();
        
    } catch (error) {
        console.error('Error submitting field form:', error);
        showNotification('Lỗi khi lưu thông tin sân bóng', 'error');
    }
}

// Xóa sân bóng
async function deleteField(fieldId) {
    try {
        await fetchAPI(`/fields/${fieldId}`, {
            method: 'DELETE'
        });
        
        showNotification('Xóa sân bóng thành công');
        
        // Tải lại dữ liệu
        await loadFieldsData();
    } catch (error) {
        console.error('Error deleting field:', error);
        showNotification('Lỗi khi xóa sân bóng', 'error');
    }
}

// Tải danh sách sân bóng vào dropdown
async function loadFieldsDropdown() {
    const dropdown = document.getElementById('booking-field');
    if (!dropdown) return;
    
    // Xóa options cũ
    dropdown.innerHTML = '<option value="">Chọn sân bóng</option>';
    
    try {
        // Lấy danh sách sân bóng
        const fields = await fetchAPI('/fields');
        
        if (fields && fields.length > 0) {
            // Lọc các sân đang khả dụng
            const availableFields = fields.filter(field => field.status === 'available');
            
            // Thêm vào dropdown
            availableFields.forEach(field => {
                const option = document.createElement('option');
                option.value = field.id;
                option.textContent = `${field.name} (${formatCurrency(field.price)}/giờ)`;
                option.dataset.price = field.price;
                dropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading fields dropdown:', error);
    }
}