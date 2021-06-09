const path = require("path")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const app = express();

const PORT = process.env.PORT || 5000 

const corsOptions = {
    origin: "https://cs341-node-team.herokuapp.com/",
    optionsSuccessStatus: 200
};

const options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        family: 4
    };

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors(corsOptions))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const titleRoutes = require('./routes/titles');

app.use(titleRoutes)

//Test