const path = require('path');

const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('In the middleware!');
  res.send('<h1>Hello from Express!</h1>'); 
})

app.listen(3000);
