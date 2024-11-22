module.exports = (sequelize, DataTypes) => {
    const ChecklistItem = sequelize.define('ChecklistItem', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_checked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    });

    ChecklistItem.associate = (models) => {
        ChecklistItem.hasMany(models.TaskChecklist,{foreignKey:'checklist_item_id', as:'taskChecklist'})
    };
    return ChecklistItem;
};
    