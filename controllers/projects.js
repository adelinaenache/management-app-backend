
'use strict';
const es = require('../utils/esHelper');
const router = require('express').Router();
const specializations = ['backend', 'frontend', 'ai', 'integrations'];
const userDetails = require('../defaultNames.json');
const uuid = require('uuid');
const skills = ['backend', 'frontend', 'ai', 'integrations']
const MIN_BACKLOG = 300;
const MAX_BACKLOG = 500;

function getRandom(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

function percentage(num, amount) {
    return roundNumber(roundNumber(num / amount, 5) * 100);
}


function roundNumber(num, dec = 2) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

function calculateInitialMetrics(project, developers) {
    console.log('p');
    if (!project.metrics) {
        project.metrics = {};
    }
    if (!project.penalities) {
        project.penalities = {};
    }
    let genders = {};

    project.metrics.velocity = 0;
    project.metrics.motivation = 0.0;
    project.metrics.backend = project.metrics.frontend = project.metrics.ai = project.metrics.integrations = 0;
    project.penalities.velocity = 0;

    developers.forEach(developer => {
        console.log(developer);
        project.metrics.velocity += developer.velocity;
        project.metrics.motivation += developer.motivation;
        genders[developer.gender]++;
        project.metrics[developer.specialization] += 2;
        project.metrics[developer.secodarySpecialization] += 1;
    });
    //console.log(metrics);

    skills.forEach(skill => {
        project.metrics[skill] = project.metrics[skill] / (3 * developers.length) * 100;
        project.metrics[skill] = roundNumber(project.metrics[skill]);

        if (percentage(project.metrics[skill], project[skill]) < 75) {
            project.penalities.velocity += 10;
        }

        delete project.metrics[skill];
    });

    project.metrics.motivation = roundNumber(project.metrics.motivation / developers.length);

    if (developers.length === 5) {
        project.penalities.velocity += 5;
    } else if (developers.length === 6) {
        project.penalities.velocity += 10;
    } else if (developers.length === 7) {
        project.penalities.velocity = 15;
    } else if (developers.length >= 8) {
        project.penalities.velocity += 20;
    }

    let gendersPercent = percentage(genders[0].length, developers.length);

    if (gendersPercent < 40 || gendersPercent > 60) {
        project.penalities.velocity += 20;
    }

    return project;
}


router.post('/assign', (req, res, next) => {
    let ids = req.body.developers_id;
    let projectId = req.body.project_id;
    let devs = [];
    let object;

    es.getById(projectId, 'projects').then(async res => {
        object = res._source;
        //  console.log(object);

        if (!devs || !devs.length) {
            devs = [];
        }

        await Promise.all(ids.map(developerId => {
            return es.getById(developerId, 'developers').then(res => {
                devs.push(res._source);
            });
        }));

        object.sprintDuration = req.body.sprint_duration;
        object = calculateInitialMetrics(object, devs);

        object.metrics.playerEstimatedTime = roundNumber(object.metrics.backlog / object.metrics.velocity);
        return object;

    }).then(object => {
        return es.updateById(projectId, {
            sprintDuration: object.sprintDuration,
            metrics: object.metrics,
            penalities: object.penalities,
            sprintDuration: object.sprint_duration,
            devCount: devs.length
        }, 'projects');
    }).then(resp => {
        res.status(200).json({
            metrics: object.metrics
        });
    });

});


router.get('/new', (req, res, next) => {
    let object = {};
    object.metrics = {};
    object.name = `Project#${getRandom(900004, 10000)}`;
    object.id = uuid.v4();
    object.metrics.customerSatisfaction = getRandom(90, 50);
    object.metrics.teamSatisfaction = getRandom(90,30);
    object.metrics.investment = getRandom(1000, 500);
    object.clientExpectedTime = getRandom(15, 8);
    object.currentSprint = 0;
    let totalTehnologies = 0;

    specializations.forEach((specialization) => {
        object[specialization] = getRandom(100 - totalTehnologies);
        totalTehnologies += object[specialization];
    });

    if (totalTehnologies !== 100) {
        object[specializations[specializations.length - 1]] = 100 - totalTehnologies;
    }
    let userStories = getRandom(100, 20);
    let tasks = [];
    let userStoryPoints = getRandom(500, 300);
    let totalSum = 0;

    while (totalSum <= userStoryPoints) {
        let userStory = {};

        userStory.id = uuid.v4();
        userStory.name = `Task ${tasks.length}`;
        userStory.points = getRandom(20, 10);
        totalSum += userStory.points;
        tasks.push(userStory);
    }

    if (totalSum >= MAX_BACKLOG) {
        totalSum -= tasks[tasks.length - 1].points;
        tasks.pop();
    }

    object.initalBacklog = totalSum;
    object.metrics.backlog = totalSum;
    object.metrics.initalBacklog = totalSum;

    es.saveToDb([object], 'projects').then(() => {
        res.status(200).json({
            context: object,
            tasks: tasks
        });
    });
});

router.post('/initial', async (req, res, next) => {
    let devIds = req.body.developers_id;
    let projectId = req.body.project_id;

    let project;

    await es.getById(projectId, 'projects').then(res => {
        project = res._source;
    });

    let developers = [];

    await Promise.all(devIds.map(devId => {
        return es.getById(devId, 'developers').then(dev => {
            developers.push(dev._source);
        });
    }));
    //console.log(project, developers);
    let metrics = calculateInitialMetrics(project, developers);

    res.status(200).json({ metrics: metrics });
});

router.post('/', (req, res, next) => {
    let id = req.body.project_id;
    //    console.log(req, req.body);

    es.getById(id, 'projects').then(response => {
        //     console.log('here');
        res.status(200).json(response._source);
    });
});

module.exports = router;