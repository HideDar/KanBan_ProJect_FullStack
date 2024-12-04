CREATE DATABASE kanban_todolist;
USE kanban_todolist;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    pass VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select*from profileUsers;
CREATE TABLE profileUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address  VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
select * from profile;
CREATE TABLE boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name_board VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE cols (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT,
    name_col VARCHAR(100) NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    column_id INT,
    title VARCHAR(255) NOT NULL,
    des TEXT,
    position INT NOT NULL,
    due_date DATE,
    status_task ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (column_id) REFERENCES cols(id) ON DELETE CASCADE
);
CREATE TABLE checklist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255) NOT NULL, 
    is_checked BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_checklist (
    task_id INT, 
    checklist_item_id INT, 
    PRIMARY KEY (task_id, checklist_item_id), 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE, 
    FOREIGN KEY (checklist_item_id) REFERENCES checklist_items(id) ON DELETE CASCADE 
);

drop table checklistitems;
drop table taskchecklists;

ALTER TABLE tasks 
ADD COLUMN start_date DATE DEFAULT NULL;


ALTER TABLE profileusers 
add COLUMN avatar varchar(255) null	;
ALTER TABLE ProfileUsers MODIFY COLUMN avatar LONGTEXT;



ALTER TABLE tasks MODIFY COLUMN status_task ENUM('todo', 'in_progress', 'done', 'overdue') DEFAULT 'todo';

