module.exports = (sequelize, DataTypes) => {    
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        pass: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        tableName: 'users' 
    });

    User.associate = (models) => {
        User.hasOne(models.ProfileUsers, {
            foreignKey: 'user_id',
            as: 'profile'
        });
        User.hasMany(models.Board, {
            foreignKey: 'user_id',
            as: 'board'
        });
    };

    return User;
};
