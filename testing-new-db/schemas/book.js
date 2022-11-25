const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        author: {
            type: DataTypes.STRING,
        },
    });
    Book.sync();
    return Book;
};