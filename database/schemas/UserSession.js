const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const UserSession = sequelize.define('UserSession', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user: {
            type: DataTypes.STRING,
        },
        token: {
            type: DataTypes.STRING,
        },
        created:  {
            type: DataTypes.STRING,
            defaultValue: Date.now().toString(),
        },
        lastused:  {
            type: DataTypes.STRING,
            defaultValue: Date.now().toString(),
        },
        usecount:  {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        ip:  {
            type: DataTypes.STRING,
        },
        regon:  {
            type: DataTypes.STRING,
        },
        browser:  {
            type: DataTypes.STRING,
        },
        device:  {
            type: DataTypes.STRING,
        },
    });
    //adds table to db if it doesnt exist
    UserSession.sync();
    return UserSession;
};