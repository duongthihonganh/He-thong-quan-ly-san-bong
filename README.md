# HỆ THỐNG QUẢN LÝ SÂN BÓNG

## 1. Giới Thiệu  
Hệ thống quản lý sân bóng giúp nhân viên, quản lý và chủ sân dễ dàng theo dõi và vận hành sân bóng, bao gồm:  
- Quản lý sân bóng và trạng thái sân.  
- Quản lý lịch đặt sân, tránh trùng lịch.  
- Quản lý khách hàng, nhân viên và thanh toán.  
- Báo cáo thống kê doanh thu và tình trạng sân.  

**Lưu ý:** Hệ thống chỉ dành cho nhân viên, khách hàng không thể đặt sân trực tiếp qua hệ thống.  

---

## 2. Tính Năng Chính  

### 2.1. Quản Lý Sân Bóng  
- Danh sách các sân mini và sân lớn.  
- Trạng thái sân: **Trống, Đã đặt, Đang bảo trì**.  
- Hỗ trợ ghép nhiều sân nhỏ thành sân lớn theo yêu cầu.  

### 2.2. Quản Lý Lịch Đặt Sân  
- Nhân viên nhập đặt sân cho khách.  
- Kiểm tra & ngăn chặn đặt trùng lịch.  
- Hiển thị lịch đặt sân theo ngày, tuần, tháng.  
- Hủy hoặc chỉnh sửa lịch đặt khi cần.   

### 2.3. Quản Lý Khách Hàng  
- Lưu trữ thông tin khách hàng (**Tên, SĐT, Lịch sử đặt sân**).  
- Ghi chú khách hàng thân thiết hoặc khách hay hủy sân.  

### 2.4. Quản Lý Nhân Viên  
- Phân quyền: **Lễ tân, Quản lý, Kế toán**.  
- Theo dõi lịch sử thao tác của từng nhân viên.

### 2.5. Báo Cáo & Thống Kê  
- Xem doanh thu theo ngày, tháng.  
- Thống kê lượt đặt sân giúp tối ưu kinh doanh.  
- Báo cáo tình trạng sử dụng sân theo thời gian.

### 2.6 Quản lý dịch vụ đi kèm
- Quản lý dịch vụ đi kèm
- Quản lý đặt dịch vụ đi kèm
- Quản lý giá cả dịch vụ
## 3. Chi tiết các tính năng 
### 3.1 Quản lý sân bóng
#### 3.1.1 Danh sách sân bóng 
Hiển thị danh sách tất cả các sân có các thông tin mô tả sau:
- ID: Mã định danh sân
- Tên sân: Tên sân bóng
- Loại sân: (Mini, 7 người, 11 người)
- Kích thước: Kích thước sân (ví dụ: 10m x 20m, 15m x 30m)
- Chất lượng sân: Mức độ chất lượng sân (Tốt, Trung bình, Kém)
- Giá thuê theo giờ: Giá thuê sân theo giờ
- Trạng thái sân: Trạng thái sân (Trống, Đã đặt, Bảo trì)
#### 3.1.2 Hiển thị trạng thái sân
Hiển thị trạng thái sân hiện tại:
 - Trống: Có thể đặt sân.
 - Đã đặt: Đã có khách đặt.
 - Đang bảo trì: Không thể đặt.
Nhân viên có thể thay đổi trạng thái sân khi cần.
#### 3.1.3 Ghép sân 
Hỗ trợ ghép 2 hoặc 4 sân mini thành 1 sân lớn khi khách có nhu cầu.
Hệ thống sẽ cập nhật lại trạng thái sân mini để tránh trùng lịch.
#### 3.1.4: Lọc sân bóng
Người dùng có thể lọc danh sách sân bóng theo:
-Loại sân (Mini, 7 người, 11 người)
-Trạng thái sân (Trống, Đã đặt, Bảo trì)
Hệ thống hiển thị danh sách sân phù hợp với tiêu chí lọc.
#### 3.1.5: Thêm sân bóng mới
-Người dùng nhấn vào nút "Thêm sân".
-Hệ thống hiển thị form nhập thông tin sân mới.
-Người dùng nhập thông tin sân (Tên, loại, kích thước, chất lượng, giá thuê, trạng thái).
-Người dùng nhấn nút "Lưu".
Hệ thống kiểm tra tính hợp lệ thông tin:
-Các trường không được để trống.
-Giá thuê phải là số hợp lệ.
Nếu thông tin hợp lệ:
-Dữ liệu được thêm vào hệ thống.
-Hệ thống cập nhật và hiển thị lại danh sách sân.
Nếu thông tin không hợp lệ:
Hệ thống hiển thị thông báo lỗi và yêu cầu người dùng sửa lại.
#### 3.1.6: Sửa thông tin sân
-chọn sân muốn sửa từ danh sách.
- chỉnh sửa thông tin sân (tên, loại, kích thước, chất lượng, giá thuê, trạng thái).
- "Lưu thay đổi".
Hệ thống kiểm tra tính hợp lệ của thông tin sửa đổi.
Nếu thông tin hợp lệ:
Hệ thống cập nhật thông tin sân và danh sách sân bóng.
Nếu thông tin không hợp lệ.
Hệ thống hiển thị thông báo lỗi yêu cầu sửa lại
#### 3.1.7: Xóa sân bóng
Người dùng chọn sân muốn xóa từ danh sách.
Hệ thống kiểm tra trạng thái sân:
Nếu sân đang có lịch đặt, hệ thống sẽ cảnh báo không thể xóa.
Nếu sân không có lịch đặt, hệ thống yêu cầu người dùng xác nhận trước khi xóa.
Nếu người dùng xác nhận xóa:
Hệ thống xóa sân khỏi hệ thống.
Cập nhật danh sách sân.
Nếu người dùng từ chối xóa:
Hệ thống không thực hiện thao tác xóa và quay lại danh sách sân.
#### 3.1.8: Xem trạng thái sân theo ngày
Người dùng chọn một ngày cụ thể.
Hệ thống hiển thị trạng thái của các sân vào ngày đó (Trống, Đã đặt, Bảo trì)
Nếu không có lịch đặt cho ngày đó, hệ thống hiển thị thông báo “Không có thông tin cho ngày đã chọn
#### 3.1.9 Tình trạng sân 
Sân cần bảo trì sửa chữa:
- Sửa chữa gì
- Nâng cấp gì
- Chi phí 
### 3.2 Quản lý lịch đặt sân 
#### 3.2.1 Đặt sân
Nhân viên nhập thông tin đặt sân của khách hàng:
- Thông tin khách hàng: Họ tên, SDT, thông tin cá nhân...
- Sân : Loại sân, kích thước, mô thể thao
- Thời gian: Ngày/tháng/năm, Giờ check in - check out
- Hình thức thuê: theo giờ, ngày, tuần, ...
Kiểm tra tự động tránh trùng lịch
Gửi xác nhận đặt sân qua SMS/Zalo/Messenger/email nếu cần
#### 3.2.2 Quản lý lịch đặt
Hiển thị danh sách lịch đặt sân theo :
- Ngày
- Tuần
- Tháng
- Quỳ
Tìm kiếm lịch đặt theo :
- Tên khách hàng
- Số CCCD/CMTND của khách hàng
- Số điện thoại
#### 3.2.3 Hủy hoặc chỉnh sửa lịch đặt
Nhân viên có thể hủy hoặc thay đổi lịch đặt theo yêu cầu khách hàng hay các tình huống phát sinh
Khi hủy sân, hệ thống sẽ: 
- Cập nhật lại trạng thái sân
- Lưu lý do hủy đặt
- Hoàn hoặc giữ lại tiền đặt cọc ( nếu có)

### 3.3 Quản lý khách hàng 
#### 3.3.1 Lưu trữ thông tin khách hàng 
Mỗi khách hàng có hồ sơ lưu trữ: 
- Họ tên
- Số điện thoại
- Giấy tờ tùy thân ( số CCCD/Hộ chiếu/CMTND...)
- Lịch sử đặt sân
- Công nợ ( nếu có)
Nhân viên có thể tìm kiếm khách hàng theo số điện thoại hoặc số CCCD/ hộ chiếu...
#### 3.3.2 Khách hàng thân thiết 
Đánh dấu khách hàng thường xuyên để ưu tiên ( phân cấp khách hàng thường xuyên theo chi tiêu của khách hàng cho hệ thống sân và theo số lần đặt sân)
Áp dụng ưu đãi cho khách hàng thân thiết 
#### 3.3.3 Theo dõi hủy sân
Lưu lịch sử hủy sân của khách
Cảnh báo khi khách có tỷ lệ hủy sân cao ( black list)
### 3.4 Quản lý nhân viên 
#### 3.4.1 Phân quyền nhân viên 
Hệ thống có các nhóm quyền truy cập: 
- Nhân viên thường: Quản lý đặt sân, cập nhật trạng thái sân, quản lý khách hàng 
- Quản lý: Quản lý sân, nhân viên, thống kê doanh thu, quản lý thanh toán, công nợ, hóa đơn
- Chủ sân: Thống kê doanh thu, quản lý nhân viên
#### 3.4.2 Theo dõi lịch sử hoạt động
Lưu lại các thao tác của nhân viên: 
- Ai là người đặt sân, hủy sân, thu tiền, phục vụ 
- Thời gian thực hiện thao tác
### 3.5 Báo cáo và thống kê
#### 3.5.1 Báo cáo doanh thu
Hiển thị doanh thu theo: 
- Ngày
- Tuần
- Tháng
- Quý
- Năm
Tổng hợp doanh thu theo :
- loại sân
- Thời gian cao điểm/ thấp điểm
- Hình thức thuê ( giờ/ buổi/ tháng, lẻ/định kì)
- Các loại dịch vụ kèm theo 
#### 3.5.2 Báo cáo chi phí ( số tiền chi ra )
Quản lý các khoản chi phí hàng tháng: 
- Tiền điện, nước
- Chi phí bảo trì sân
- Lương nhân viên
- Chi phí nhập hàng cho các dịch vụ khác
- Chi phí quảng cáo và tiếp thị 
Xem báo cáo tổng chi phí theo Ngày/Tháng/Năm
So sánh doanh thu và chi phí để tính lợi nhuận ròng
#### 3.5.3 Thống kê sử dụng sân 
Xem số lần sân được thuê theo thời gian 
Phát hiện giờ cao điểm và thấp điểm đặt sân
#### 3.5.4 Báo cáo tình trạng sân
Xem số lần bảo trì sân 
Phát hiện sân ít được thuê để có thể tối ưu được kinh doanh
### 3.6 Quản lý dịch vụ đi kèm
#### 3.6.1 Quản lý dịch vụ đi kèm
- Phân loại và nhóm các dịch vụ:
- Mô tả dịch vụ: Cung cấp thông tin chi tiết của dịch vụ ( Tên, giá cả, ưu đãi...)
- Cập nhật trạng thái dịch vụ ( có sẵn, đã đặt, không còn cung cấp)
- Cập nhật giá cả cho các dịch vụ
- Phân tích tình hình sử dụng dịch vụ
#### 3.6.2 Quản lý đặt dịch vụ
- Nhân viên nhập đặt dịch vụ
- Thông tin khách hàng đặt dịch vụ
- Quản lý lịch sử đặt dịch vụ
- Xóa hoặc thêm dịch vụ
#### 3.6.3 Quản lý tồn kho
- Theo dõi tồn kho
- Cảnh báo khi số lượng hàng còn trong kho thấp hơn ngưỡng nhất định 


