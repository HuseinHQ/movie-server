const express = require('express');
const app = express();
const port = 3000;
const mainRoutes = require('./routes/')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRoutes)

app.listen(port, () => console.log(`App listens to localhost:${port}`));