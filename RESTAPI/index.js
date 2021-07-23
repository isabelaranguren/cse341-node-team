const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const titleRoutes = require('./routes/titles');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 1000
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://isabelaranguren:lETdcaYRD9Pyvs5Z@cluster0.5zzkq.mongodb.net/list?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(titleRoutes);
app.use(authRoutes);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(
        MONGODB_URL, options
    )
    .then(result => {
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    })
    .catch(err => {
        console.log(err);
    });