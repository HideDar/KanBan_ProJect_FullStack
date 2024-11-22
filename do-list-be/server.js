const db = require('./models');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/uploads', express.static('uploads')); // Cho phép truy cập ảnh từ /uploads/
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));  
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', 
}));

// Import routes
const apiRoutes = require('./routes/api');

// Use routes
app.use('/api', apiRoutes);

async function initializeDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Kết nối database thành công.');

    await db.sequelize.sync({ force: false });
    console.log('Database đã được đồng bộ hóa');

    app.listen(PORT, () => {
      console.log(`Server đang chạy trên cổng ${PORT}`);
    });
  } catch (err) {
    console.error('Lỗi khi khởi tạo database:', err);
  }
}

initializeDatabase();
