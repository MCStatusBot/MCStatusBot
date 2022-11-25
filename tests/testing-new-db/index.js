require('dotenv').config();
const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL) // Example for mysql


const schemas = {
    Book: require('./schemas/book')(sequelize)
}


async function main() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }



}
main();
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    console.log('API is up');
})

app.get('/books', async (req,res) => {
    try {
        const books = await sequelize.models.Book.findAll();
        res.send(books)
    }catch (err) {
        res.send(err);
    }
})

app.get('/books/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const book = await sequelize.models.Book.findOne({
            where: {
                id
            }
        });
        res.send(book);
    } catch (err) {
        res.send(err);
    }
});

app.put('/books/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const book = await sequelize.models.Book.update(data, {
            where: {
                id
            }
        });
        res.send('book updated');
    } catch (err) {
        res.send(err);
    }
});

app.post('/books', async (req, res) => {
    const data = req.body;
    try {
        const book = await sequelize.models.Book.create(data);
        res.send(book);
    } catch (err) {
        res.send(err);
    }
})

app.delete("/books/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const book = await sequelize.models.Book.destroy({
            where: {
                id
            }
        });
        if (book === 0) {
            res.send('No records were deleted');
        } else {
            res.send(`{book} number of records were deleted`);
        }
    } catch (err) {
        res.send(err.stack||err);
    }
    console.log("delete book")
});


app.listen(3000, (req, res) => {
    console.log('server started');
})