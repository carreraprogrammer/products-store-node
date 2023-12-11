const path = require('path');

const express = require('express');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');

app.use('/admin', adminRoutes);

app.use(errorController.get404);

app.listen(3000);
