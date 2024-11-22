const { Sequelize, DataTypes } = require("sequelize"); 

module.exports = (sequelize) => {    
    const ProfileUsers = sequelize.define('ProfileUsers', {
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        avatar: {
            type: DataTypes.BLOB, // Use DataTypes instead of Sequelize
            allowNull: true
        }

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'profileUsers' 
    });

    ProfileUsers.associate = (models) => {
        ProfileUsers.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return ProfileUsers;
};
