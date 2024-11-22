module.exports = (sequelize, DataTypes) => {    
    const Tasks = sequelize.define('Tasks', {
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        des: DataTypes.TEXT,
        position: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_date: DataTypes.DATE,
        due_date: DataTypes.DATE,
        
        status_task: {
            type: DataTypes.ENUM('todo', 'in_progress', 'done', 'overdue'),
            defaultValue: 'todo'
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },  
        completed_at: DataTypes.DATE
    }, {
        timestamps: false
    });

    Tasks.associate = (models) => {
        Tasks.belongsTo(models.Cols, {
            foreignKey: 'column_id',
            as: 'column',
            onDelete: 'CASCADE'
        });
        Tasks.hasMany(models.TaskChecklist, { foreignKey: 'task_id', as: 'taskChecklist' });
    };

    return Tasks;
};
