'use strict';

const elasticsearch = require('elasticsearch');
const express = require('express');
const es = require('./utils/esHelper');
const bodyParser = require('body-parser');
const uuid = require('uuid'); 

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

// unexpected: {
//     'title': '',  
//     'id': 
//     'answers': [
//         {
//             'text': 
//             'affectsFields': [
//                 {
//                     'fieldType': 'metric/field/number'
//                     'value': '', 
//                     ''
//                 }
//             ]
//         }
//     ]
// }

app.post('/unexpected', (req, res, next) => {
    let question = req.body;
    question.id = uuid.v4();
    es.saveToDb([question], 'unexpected').then(() => {
        res.status(200).json({id: question.id});
    });
});
module.exports = app;