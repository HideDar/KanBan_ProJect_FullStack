module.exports = (sequelize, DataTypes) => {    
    const Cols = sequelize.define('Cols', {
        name_col: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        position: { 
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false   ,

    });

    Cols.associate = (models) => 
        Cols.belongsTo(models.Board, {
            foreignKey: 'board_id',
            as: 'board'
        });

    return Cols;
};
