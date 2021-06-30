const path = require("path")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const csrf = require('csurf');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

const PORT = process.env.PORT || 2000

const corsOptions = {
    origin: "https://my-list.herokuapp.com/",
    optionsSuccessStatus: 200
};

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

//const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://isabelaranguren:lETdcaYRD9Pyvs5Z@cluster0.5zzkq.mongodb.net/list?retryWrites=true&w=majority";
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://isabelaranguren:lETdcaYRD9Pyvs5Z@cluster0.5zzkq.mongodb.net/list?retryWrites=true&w=majority"; 
const store = new MongoDBStore({
     uri: MONGODB_URL,
      collection: 'sessions'
     });
const csrfProtection = csrf(); 
app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors(corsOptions))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
app.use(session({
    secret: 'afsgsdrerhsdfg',
    resave: false,
    saveUninitialized: false,
    store: store
})
);
    app.use(flash());

const titleRoutes = require('./routes/titles');
const authRoutes = require('./routes/auth');

app.use(titleRoutes);
app.use(authRoutes);

//Test
mongoose
    .connect(
        MONGODB_URL, options
    )
    .then(result => {
    })
    .catch(err => {
        console.log(err);
    });
