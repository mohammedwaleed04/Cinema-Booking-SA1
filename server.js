const express = require('express');
const exhb = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes/route');
const { checkUser } = require('./middleWares/middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('static'));
app.use('/images', express.static(__dirname + '/static/images'));

app.engine('hbs', exhb.engine({
    extname: 'hbs',
    defaultLayout: false
}))
app.set('view engine', 'hbs');

app.get('/movies', (req, res) => {
    res.render('movies');
});

const url = 'mongodb://127.0.0.1:27017/cinema';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to the db...');
        const hostname = '192.168.1.3';
        const port = process.env.PORT || 3000;
        app.listen(port, hostname, () => console.log(`server is running on http://${hostname}:${port}`));
    })
    .catch((err) => console.log(err));

app.get('*', checkUser);
app.get('/', (req, res) => res.redirect('/home'));
app.use(routes);