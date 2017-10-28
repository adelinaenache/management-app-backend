'use strict';

const elasticsearch = require('elasticsearch');
const express = require('express');
const esHelper = require('./utils/esHelper');
const bodyParser = require('body-parser');

const app = express();


const developersRoute = require('./controllers/developers'); 
const projectsRoute = require('./controllers/projects');
const sprintsRoute = require('./controllers/sprints');

app.use(bodyParser.json());
app.disable('x-powered-by');
app.enable('trust proxy');


app.use('/developers', developersRoute);
app.use('/projects', projectsRoute); 
app.use('/sprints', sprintsRoute);

module.exports = app;