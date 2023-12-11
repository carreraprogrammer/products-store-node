const path = require('path');

const express = require('express');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(errorController.get404);

app.listen(3000);
