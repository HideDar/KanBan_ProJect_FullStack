module.exports = (sequelize, DataTypes) => { 
    const TaskChecklist = sequelize.define('TaskChecklist', {
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Tasks', 
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        checklist_item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'ChecklistItem', 
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
        
    }, {
        timestamps: false,
        tableName: 'task_checklist'
    });

    TaskChecklist.associate = (models) => {
        TaskChecklist.belongsTo(models.Tasks, { foreignKey: 'task_id', as: 'task' });   
        TaskChecklist.belongsTo(models.ChecklistItem, { foreignKey: 'checklist_item_id', as: 'checklistItem' });
    };
    return TaskChecklist;
};
