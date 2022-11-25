const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
        },
        discriminator: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        lan: {
            type: DataTypes.STRING,
            defaultValue: "EN"
        },
        theme: {
            type: DataTypes.STRING,
            defaultValue: "minecraft_ui"
        },
        created:  {
            type: DataTypes.STRING,
            defaultValue: Date.now().toString(),
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });
    //adds table to db if it doesnt exist
    User.sync();
    return User;
};