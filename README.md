# Todo List with Checklist

## Giới thiệu

Dự án Todo List với tính năng CheckList cho phép người dùng quản lý các công việc và các mục trong danh sách công việc (checklist). Mỗi công việc có thể có nhiều mục checklist, giúp người dùng dễ dàng theo dõi tiến độ công việc.

Dự án sử dụng **Vue.js** cho frontend và **Node.js** với **Express** cho backend, kết hợp với cơ sở dữ liệu **MySQL**.

## Các tính năng chính

- Quản lý công việc (tasks) với các trạng thái như `todo`, `in_progress`, `done`.
- Thêm, sửa, xóa công việc.
- Quản lý các mục checklist liên quan đến mỗi công việc.
- Lưu trữ thông tin người dùng (avatar, thông tin cá nhân) và cho phép chỉnh sửa.
- Tích hợp tính năng tải lên avatar cho người dùng.

## Kiến trúc dự án

### Frontend

- **Vue.js**: Thư viện JavaScript cho giao diện người dùng.
- **Vuex**: Quản lý trạng thái của ứng dụng.
- **Axios**: Gửi yêu cầu HTTP đến backend.

### Backend

- **Node.js + Express**: Framework cho backend API.
- **Sequelize**: ORM cho MySQL để truy vấn cơ sở dữ liệu.
- **MySQL**: Hệ quản trị cơ sở dữ liệu quan hệ.


