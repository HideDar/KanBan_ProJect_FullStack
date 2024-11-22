module.exports = (sequelize, DataTypes) => {    
    const Board = sequelize.define('Board', {
        name_board: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        }
    },{
        timestamps: false
    });

    Board.associate = (models) => 
        Board.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

    return Board;
};
