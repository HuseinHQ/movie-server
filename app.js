require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const mainRoutes = require('./routes/');
const errorHandler = require('./middlewares/errorHandlers');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRoutes);
app.use(errorHandler);

app.listen(port, () => console.log(`App listens to localhost:${port}`));