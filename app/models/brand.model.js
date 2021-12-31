const { DataTypes } = require('sequelize');

const brandSequelize = ( sequelize ) => {
    sequelize.Brand = sequelize.define('brand', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        }, 
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }, 
        avatar: {
            type: DataTypes.STRING(200),
        }, 
        description: {
            type: DataTypes.STRING(200),
        }, 
        founded_year: {
            type: DataTypes.INTEGER,
        },
        country: {
            type: DataTypes.STRING(50)
        }
    }, {
        timestamps: false,
        tableName: 'brand'
    })
}

module.exports = brandSequelize;