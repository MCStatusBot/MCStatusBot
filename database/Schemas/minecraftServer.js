const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const MinecraftServer = sequelize.define('MinecraftServer', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        owner: {
            type: DataTypes.STRING,
        },
        mcserver: {
            type: DataTypes.STRING,
        },
        ip: {
            type: DataTypes.STRING,
        },
        port: {
            type: DataTypes.STRING,
        },
        domain: {
            type: DataTypes.STRING,
        },
        motd_html: {
            type: DataTypes.STRING,
        },
        motd_clean: {
            type: DataTypes.STRING,
        },
        online: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        members: {
            type: DataTypes.STRING,
        },
        maxMembers: {
            type: DataTypes.STRING,
        },
        lastUpadted: {
            type: DataTypes.STRING,
            defaultValue: "1104476400",
        },
        bluemapurl: {
            type: DataTypes.STRING, defaultValue: "NONE",
        },
        timezone: {
            type: DataTypes.STRING,
            defaultValue: "GMT",
        },
        Bedrock: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        logs: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    });
    //adds table to db if it doesnt exist
    MinecraftServer.sync();
    return MinecraftServer;
};