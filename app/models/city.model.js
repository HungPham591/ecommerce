const { DataTypes } = require('sequelize');

const citySequelize = ( sequelize ) => {
    sequelize.City = sequelize.define('city', {
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
        shipping : {
          type: DataTypes.DECIMAL(2),
          allowNull: false,
        }
    }, {
        timestamps: false,
        tableName: 'city'
    })
}

module.exports = citySequelize;