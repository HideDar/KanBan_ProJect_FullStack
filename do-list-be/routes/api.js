const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');
const bcrypt = require('bcrypt'); 
const bodyParser = require('body-parser'); 
const SECRET_KEY = 'mysecertkey'
const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu trữ file vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Thư mục lưu trữ file upload
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));  // Đặt tên file
  }
});

// Khởi tạo multer với cấu hình lưu trữ
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


router.use(bodyParser.json({ limit: '10mb' })); 

// User routes
router.post('/users', async (req, res) => {
  try {
    const user = await db.User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Board routes
router.post('/boards', async (req, res) => {
  const name_board = req.body;
  try { 
  const newBoard = await db.Board.create({name_board, user_id: req.params.id});
  res.json(newBoard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/boards/:userId', async (req, res) => {
  try {
    const board = await db.Board.findAll({ where: { user_id: req.params.userId } });
    res.json(board);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/boards/:boardId', (req, res) => {
  const boardId = req.params.boardId;
  db.Board.findById(boardId, (err, board) => {
    if (err) return res.status(500).send(err);
    Column.findByBoardId(boardId, (err, columns) => {
      if (err) return res.status(500).send(err);
      res.json({
        board: board,  
        columns: columns 
      });
    });
  });
});

// Column routes
router.get('/columns/:boardId', async (req, res) => {
  try {
    const columns = await db.Cols.findAll({ where: { board_id: req.params.boardId } });
    res.json(columns);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Task routes

// router.get('/tasks/columns/:column_id', async (req, res) => {
//   const columnId = req.params.column_id;
  
//   try {
//     const tasks = await db.Tasks.findAll({ where: { column_id: columnId } });
//     res.json(tasks); 
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).json({ error: 'Database query failed' });
//   }
// });

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.Tasks.findAll({
      include: [
        {
          model: db.Cols,  
          as: 'column',   
          include: {
            model: db.Board,  
            as: 'board',     
            include: {
              model: db.User,  
              as: 'user',      
              include: {
                model: db.ProfileUsers,  
                as: 'profile', 
                attributes: ['avatar'],  
              }
            }
          }
        },
        {
          model: db.TaskChecklist,
          as: 'taskChecklist',
          include: {
            model: db.ChecklistItem,
            as: 'checklistItem'
          }
        }
      ],
      order: [['position', 'ASC']] 
    });

    const currentDate = new Date();
    const tasksWithStatus = tasks.map(task => {
      const startDate = new Date(task.start_date);
      const dueDate = new Date(task.due_date);
      const totalTime = dueDate - startDate;
      const diffTime = currentDate - startDate;
      const progress = Math.ceil((diffTime / totalTime) * 100);

      let statusColor = '';
      if (progress >= 100 && task.status_task !== 'done') {
        statusColor = 'red'; 
        task.status_task = 'overdue'; 
      } else if (progress >= 80 && progress < 100 && task.status_task !== 'done') {
        statusColor = 'yellow'; 
      } else if (task.status_task === 'done') {
        statusColor = 'blue'; 
      } else if (progress < 0 && task.status_task !== 'done') {
        statusColor = 'red';
        task.status_task = 'overdue';
      } else {
        statusColor = 'green';
      }

      const avatar = task.column.board.user.profile.avatar;

      return {
        ...task.dataValues,
        statusColor,
        progress,
        avatar 
      };
    });

    res.json(tasksWithStatus);
    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/tasks/:id/update', async (req, res) => {
  const { id } = req.params;
  const updatedTaskData = req.body;
  
  try {
    const task = await db.Tasks.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.update(updatedTaskData);
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

router.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { position, column_id } = req.body; 

  try {
    const task = await db.Tasks.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.position = position; 
    task.column_id = column_id; 

    await task.save();

    res.json({ message: 'Task updated successfully', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await db.Tasks.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

router.post('/tasks/:columnId', async (req, res) => {
  const columnId = req.params.columnId;
  try {
    const newTask = await db.Tasks.create({
      ...req.body,
      column_id: columnId,
    }); 
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ error: error.message });
  }
});

// checklist routes

router.get('/tasks/:taskId/checklist', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const checklistItems = await db.TaskChecklist.findAll({
      where: { task_id: taskId },
      include: {
        model: db.ChecklistItem,
        as: 'checklistItem'
      }
    });
    res.json(checklistItems);
  } catch (error) {
    console.error('Error fetching checklist items:', error);
    res.status(500).json({ error: 'Failed to fetch checklist items' });
  }
});

// Profile routes
router.post('/profile_users', async (req, res) => {
  try {
    const profile = await db.ProfileUsers.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/profile_users', async (req, res) => {
  try {
    const { user_id } = req.query;  
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const profile = await db.ProfileUsers.findOne({
      where: { user_id } 
    });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile_users/:userId', upload.single('avatar'), async (req, res) => {
  const { userId } = req.params;
  const { first_name, last_name, address, phone_number } = req.body;

  try {
    const profile = await db.ProfileUsers.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.first_name = first_name || profile.first_name;
    profile.last_name = last_name || profile.last_name;
    profile.address = address || profile.address;
    profile.phone_number = phone_number || profile.phone_number;

    if (req.file) {
      const avatarUrl = `/uploads/${req.file.filename}`; 
      profile.avatar = avatarUrl;
    }

    await profile.save();

    res.json(profile);

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

//Login, Register routes
router.post('/login', async (req, res) => {
  try {
    const { email, pass } = req.body;


    if (!email || !pass) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    if (user.pass !== pass) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({id: user.id, email: user.email}, SECRET_KEY,{
        expiresIn: 86400
    });

    res.json({ 
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  const { username,email, pass } = req.body;
  if (!username || !email || !pass) {
    return res.status(400).json({ error: 'UserName, Email and password are required' });
  }
  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = await db.User.create({
      username,
      email,
      pass,
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

  } catch (error) {
    console.error('Error registering user: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/drag/:id', async (req, res) => {
  const { position, status_task } = req.body;
  try {
    const task = await db.Tasks.findByPk(req.params.id);
    if (task) {
      task.update({ position, status_task });
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating task position', error });
  }
});


module.exports = router;
