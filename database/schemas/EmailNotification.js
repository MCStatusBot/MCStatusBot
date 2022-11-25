const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const EmailNotification = sequelize.define('EmailNotification', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user: {
            type: DataTypes.STRING,
        },
        mcserver: {
            type: DataTypes.STRING,
        },
        online: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        offline: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        maxmemberChange: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        memberChange: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        versionChange: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        motdChange: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });
    //adds table to db if it doesnt exist
    EmailNotification.sync();
    return EmailNotification;
};