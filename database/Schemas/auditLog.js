const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user: {
            type: DataTypes.STRING,
        },
        guild: {
            type: DataTypes.STRING,
            defaultValue: "none"
        },
        error: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        date: {
            type: DataTypes.STRING,
            defaultValue: Date.now().toString(),
        },
        description: {
            type: DataTypes.STRING,
        },
        filters: {
            type: DataTypes.STRING,
            defaultValue: JSON.stringify(["all"]),
        },
    });
    //adds table to db if it doesnt exist
    AuditLog.sync();
    return AuditLog;
};