const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const MinecraftServerLog = sequelize.define('MinecraftServerLog', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mcserver: {
            type: DataTypes.STRING,
        },
        time:  {
            type: DataTypes.STRING,
            defaultValue: Date.now().toString(),
        },
        online: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        playersOnline: {
            type: DataTypes.STRING,
        },
        playerNamesOnline: {
            type: DataTypes.STRING,
        }
    });
    //adds table to db if it doesnt exist
    MinecraftServerLog.sync();
    return MinecraftServerLog;
};