const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const WebsiteTheme = sequelize.define('WebsiteTheme', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        beta: {
            type: DataTypes.BOOLEAN,
        },
        created:  {
            type: DataTypes.STRING,
            defaultValue: Date.now().toString(),
        },
    });
    //adds table to db if it doesnt exist
    WebsiteTheme.sync();
    return WebsiteTheme;
};