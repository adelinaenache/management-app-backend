
'use strict';
const es = require('../utils/esHelper');
const router = require('express').Router();
const specializations = ['backend', 'frontend', 'ai', 'integrations'];
const userDetails = require('../defaultNames.json');
const uuid = require('uuid');
const skills = ['backend', 'frontend', 'ai', 'integrations']
const MIN_BACKLOG = 300;
const MAX_BACKLOG = 500;

function checkWin(project) {
    if (project.metrics.teamSatisfaction < 70 && project.metrics.customerSatisfaction < 70 && project.metrics.investment < -1000) {
        return 'lose';
    }
    let backlog = percentage(project.metrics.backlog, project.initialBacklog);

    if (project.metrics.teamSatisfaction > 85 && project.metrics.investment > 0 && project.metrics.customerSatisfaction > 90 && backlog > 85) {
        return 'win';
    }

    if (backlog > 95) {
        return 'finished';
    }

    return 'continue';
}

function getRandom(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

function percentage(num, amount) {
    return roundNumber(roundNumber(num / amount, 5) * 100);
}

function roundNumber(num, dec = 2) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function inversePercentage(num, amount) {
    return roundNumber((amount * num) / 100);
}

router.post('/planning', (req, res, next) => {
    let questions = [];

    questions.push({
        title: 'Team tehnical training',
        id: 1,
        actions: ['Project investment fund - 20 * team size', 'Team velocity +10%', 'Team motivation +5%']
    });

    questions.push({
        title: 'Introduce Dev Ops',
        id: 2,
        actions: ['Project investment fund = - 50 * team size', 'Team velocity +20%', 'Customer satisfaction -15%']
    });

    questions.push({
        title: 'Team building',
        id: 3,
        actions: ['Team motivation +5%']
    });

    questions.push({
        title: 'Diversity & inclusion training',
        id: 4,
        actions: ['Project investment fund - 5 * team size', 'Team velocity +5%', 'Team motivation +5%']
    });

    questions.push({
        title: 'Stretch goals',
        id: 5,
        actions: ['Team motivation -10%', 'Customer satisfaction +10%']
    });

    questions.push({
        title: 'Team soft-skills training',
        id: 6,
        actions: ['Project investment fund -10 * team size', 'Team velocity +5%', 'Team motivation +5%']
    });

    res.status(200).json(questions);
});

let questions = {};

questions[0] = [];

questions[0].push({
    'question': 'During clarifications for a user story the team asks questions to Product Owner which he cannot answer. What does the PO do?',
    'id': 7,
    'actions': ['a. Contacts one of the stakeholders for clarifications: no impact',
        'b. Abandons the story: -3% customer satisfaction',
        'c. Shrugs his shoulders and says “let’s work with what we have”: –3% team satisfaction, -3% customer satisfaction']
});

questions[0].push({
    'question': 'During the estimation for a user story the developers have different estimations and big differences between their estimations. What should be the next steps?',
    'id': 8,
    'actions': ['PO chooses one estimation that a developer provided and says: ”This is the one!”: -3% team satisfaction',
        'b. PO will explain with more details what the expectations are for the functionality to be developed and then the development team will re-estimate: +5 team velocity',
        'c. PO will speak with a SME for helping the team with this issue: +5 team velocity']
});

questions[0].push({
    'question': 'During estimation the PO says that it’s mandatory to use the “man-hour” estimation method. What is the most appropriate answer?',
    'id': 9,
    'actions': ['a. The development team estimates using “manhour” procedure instead of story points. : -5% team satisfaction, -5 team velocity',
        'b. The scrum master explains the advantage of a generic method for estimations and the team will keep their estimations. No impact',
        'c. The scrum master agrees with PO and says: if they will not be using the “manhour” estimation method, then they will not know the number of user stories that will be delivered in the next sprint: -5% team satisfaction, -5 team velocity']
});


questions[1] = [];

questions[1].push({
    'question': 'One developers task is getting delayed because of technical issues he cannot solve. What should the Scrum Master do:',
    'id': 10,
    'actions': ['a. The Scrum Master notes the problem and asks who could help with the issue +2% team satisfaction',
        'b. The developer is told he has to solve the issue himself: -2% team satisfaction, -5 team velocity.',
        'c. Everybody ignores the issue and they move on: -5 team velocity.']
});

questions[1].push({
    'question': 'One developer complains about his laptop, he doesn’t know what are the next steps for his issue.',
    'id': 11,
    'actions': ['a. The scrum master documents the issue and recommends to the developer to contact IT support: -3p team velocity',
        'b. The other developers start complaining as well about their laptops: - 5% team motivation',
        'c. The other developers start laughing about their team member, because the issue with the laptop was caused by him, because he doesn’t know how to use a laptop: -10% team motivation']
});

questions[1].push({
    'question': 'The developers complain about the fact that they don’t have enough time for development, because they attend the “daily scrum” meeting. (25 minutes). What will decide the Scrum master?',
    'id': 12,
    'actions': ['a. The scrum master agrees with what the developers said, because the “daily scrum” meeting should have maxim 15 minutes, even if some problems will appear. -5p team velocity',
        'b. The scrum master says that they will attend “daily scrum” meeting no matter what is the duration of the meeting, because they need to solve the problems. – 5p team velocity',
        'c. The scrum master says that the “daily scrum” meeting can be shorter, only fi they will talk about the tasks, not the unexpected issues. No impact']
});

questions[2] = [];

questions[2].push({
    'question': 'During the sprint retrospective one developer complains about another team member, because a component was not developed in time. What should do the scrum master?',
    'id': 13,
    'actions': ['a. The scrum master needs more details to understand this issue and asks the team member about this issue and propose to the other colleagues to give the developer a solution. +3% team satisfaction',
        'b. The scrum master said that the “trouble maker” is a good colleague, and the story it’s not true. -5% team satisfaction',
        'c. The other colleagues said they will help much more in the next sprint and this issue will not persist. +5% team satisfaction.']
});

questions[2].push({
    'question': 'During the sprint retrospective the developers agreed that the description of the tasks can improve. What should the scrum master do to improve the description of the tasks in the next sprint?',
    'id': 14,
    'actions': ['a. The scrum master said the developers need to prepare more questions for the PO. +2% team satisfaction',
        'b. The scrum master said he will contact the client more often for the new questions and details required by development team. +5% team satisfaction',
        'c. The scrum master said he and the development team need to revise the tasks description until the developers will start implementing the requirements. +5% team satisfaction']
});

questions[2].push({
    'question': '',
    'id': 15,
    'actions': ['a. The scrum master said the developers need to prepare more questions for the PO. +2% team satisfaction',
        'b. The scrum master said he will contact the client more often for the new questions and details required by development team. +5% team satisfaction',
        'c. The scrum master said he and the development team need to revise the tasks description until the developers will start implementing the requirements. +5% team satisfaction']
});

questions[3] = [];

questions[3].push({
    'question': 'The PO said that one component was not developed as well as he described it to the development team. What Scrum master or development team should do to fix this issue?',
    'id': 16,
    'actions': ['a. The development team said they understand well and they are trying to explain the PO that the component is developed right. No impact',
        'b. The scrum master said that the impact of the component that was not developed well, will not impact the sprint review. -5% customer satisfaction',
        'c. The development team said they can fix the problem right away, but first they need to askthe other clients as well. +5% customer satisfaction']

});

questions[3].push({
    'question': 'Two developers start a fight because each of them wants to present the sprint components to the customer team and PO. What should do the scrum master next?',
    'id': 17,
    'actions': [
        'a. The scrum master tells other developers to present the functionality. -3% team satisfaction',
        'b. The scrum master suggests splitting the functionality between the developers and then each of them will present. No impact',
        'c. The scrum master will present himself, because he knows the business flow of the application. No impact']
});

router.post('/new', async (req, res, next) => {
    let plannings = req.body.plannings;
    let project_id = req.body.project_id;
    let project;

    await es.getById(project_id, 'projects').then(res => {
        project = res._source;
    });

    //project.currentMetrics = project.metrics;
    project.currentSprint = project.currentSprint + 1;

    let randomEvents = getRandom(5, 0);
    let shuff = [0, 1, 2, 3];

    shuff = shuffleArray(shuff);
    let events = [];

    for (let i = 0; i < 4; i++) {
        events.push([]);
    }
    for (let i of shuff) {
        if (randomEvents) {
            let nrQ = getRandom(2, 0);
            let toShuffle = [];

            for (let j = 0; j < questions[shuff[i]].length; j++) {
                toShuffle.push(j);
            }

            toShuffle = shuffleArray(toShuffle);
            for (let j = 0; j < nrQ; j++) {
                events[shuff[i]].push(questions[shuff[i]][j]);
            }
        }
    }
    let updatedMetrics = {};
    updatedMetrics.velocityProcent = updatedMetrics.motivationProcent = updatedMetrics.customerSatisfactionProcent = 0;
    //    console.log(events);
    plannings.forEach(planning => {
        if (planning == 1) {
            project.investment -= 20 * project.devCount;
            updatedMetrics.velocityProcent += 10;
            updatedMetrics.motivationProcent += 5;

        } else if (planning == 2) {
            project.investment -= 50 * project.devCount;
            updatedMetrics.velocityProcent += 20;
            updatedMetrics.customerSatisfactionProcent -= 15;
        } else if (planning == 3) {
            updatedMetrics.motivationProcent += 5;
        } else if (planning == 4) {
            project.investment -= 5 * project.devCount;
            updatedMetrics.velocityProcent += 5;
            updatedMetrics.motivationProcent += 5;
        } else if (planning == 5) {
            updatedMetrics.customerSatisfactionProcent += 10;
            updatedMetrics.motivationProcent -= 10;
        } else if (planning == 6) {
            updatedMetrics.velocityProcent += 5;
            updatedMetrics.motivationProcent += 5;
            project.investment -= 10 * project.devCount;
        }
    });

    project.metrics.velocity = roundNumber(project.metrics.velocity + inversePercentage(updatedMetrics.velocityProcent, project.metrics.velocity));
    project.metrics.motivation = roundNumber(project.metrics.motivation + inversePercentage(updatedMetrics.motivationProcent, project.metrics.motivation));
    project.metrics.customerSatisfaction = roundNumber(project.metrics.customerSatisfaction + inversePercentage(updatedMetrics.customerSatisfactionProcent, project.metrics.customerSatisfaction));

    es.updateById(projectId, 'projects').then(() => {
        res.status(200).json({

            'Sprint planning': events[0],
            'Daily scrum': events[1],
            'Sprint retrospective': events[2],
            'Sprint review': events[3],
            'metrics': project.metrics,
            'gameStatus': checkWin(project)
        });
    });


    // await es.updateById('project_id', {currentMetrics: {}})
    //console.log(project);
});

router.post('/event', async (req, res, next) => {
    let questionId = req.body.question_id;
    let answerId = req.body.answer_id;
    let projectId = req.body.project_id;
    //console.log('sd');
    let updatedMetrics = {};

    updatedMetrics.customerSatisfaction = updatedMetrics.teamSatisfaction = updatedMetrics.velocityPoints = 0;
    updatedMetrics.motivation = 0;

    if (questionId === 7) {
        if (answerId == 1) {
            updatedMetrics.customerSatisfaction -= 3;
        } else if (answerId == 2) {
            updatedMetrics.teamSatisfaction -= 3;
            updatedMetrics.customerSatisfaction -= 3;
        }
    }

    if (questionId === 8) {
        if (answerId == 0) {
            updatedMetrics.teamSatisfaction -= 3;
        } else {
            updatedMetrics.velocityPoints += 5;
        }
    }

    if (questionId === 9) {
        if (answerId == 0) {
            updatedMetrics.velocityPoints -= 5;
            updatedMetrics.teamSatisfaction -= 5;
        } else if (answerId == 2) {
            updatedMetrics.velocityPoints -= 5;
            updatedMetrics.teamSatisfaction -= 5;
        }
    }

    if (questionId === 10) {
        if (answerId === 0) {
            updatedMetrics.teamSatisfaction += 2;
        } else if (answerId === 1) {
            updatedMetrics.teamSatisfaction -= 2;
            updatedMetrics.velocityPoints -= 5;
        } else {
            updatedMetrics.velocityPoints -= 5;
        }
    }

    if (questionId === 11) {
        if (answerId === 0) {
            updatedMetrics.velocityPoints -= 3;
        } else if (answerId === 1) {
            updatedMetrics.motivation -= 5;
        } else {
            updatedMetrics.motivation -= 10;
        }
    }

    if (questionId === 12) {
        if (answerId === 0) {
            updatedMetrics.velocityPoints -= 5;
        } else if (answerId === 1) {
            updatedMetrics.velocityPoints -= 5;
        }
    }

    if (questionId === 13) {
        if (answerId === 0) {
            updatedMetrics.teamSatisfaction += 3;
        } else if (answerId === 1) {
            updatedMetrics.teamSatisfaction -= 5;
        } else if (answerId === 2) {
            updatedMetrics.teamSatisfaction += 5;
        }
    }

    if (questionId === 14) {
        if (answerId === 0) {
            updatedMetrics.teamSatisfaction += 2;
        } else {
            updatedMetrics.teamSatisfaction += 5;
        }
    }

    if (questionId === 15) {
        if (answerId === 1) {
            updatedMetrics.customerSatisfaction -= 5;
        } else if (answerId === 2) {
            updatedMetrics.customerSatisfaction += 5;
        }
    }

    if (questionId === 16) {
        if (answerId === 0) {
            updatedMetrics.teamSatisfaction -= 3;
        }
    }

    let project;

    await es.getById(projectId, 'projects').then(res => {
        project = res._source;
        console.log(project);
    });

    project.metrics.velocity = roundNumber(project.metrics.velocity + updatedMetrics.velocityPoints);
    project.metrics.customerSatisfaction = roundNumber(project.metrics.customerSatisfaction + inversePercentage(updatedMetrics.customerSatisfaction, project.metrics.customerSatisfaction));
    project.metrics.motivation = roundNumber(project.metrics.motivation + inversePercentage(updatedMetrics.motivation, project.metrics.motivation));
    //TODO: velocity take care of penalization
    //TODO: wtf if developersSatisfaction
    //TODO: calculate estimated completiton 
    es.updateById(projectId, { metrics: project.metrics }, 'projects').then(() => {
        res.status(200).json({ metrics: project.metrics, gameStatus: checkWin(project) });
    });

});

router.post('/end', async (req, res, next) => {
    //TODO: add sprint size to project
    let projectId = req.body.projectId;
    let project;

    await es.getById(projectId, 'projects').then(res => {
        project = res._source;
    });

    project.metrics.backlog = roundNumber(project.metrics.backlog - roundNumber(project.metrics.velocity, 0) * project.sprintDuration, 0);
    let totalDecrease = project.penalities.velocity;

    if (project.teamSatisfaction < 75) {
        totalDecrease += 20;
    } else if (project.teamSatisfaction < 85) {
        totalDecrease += 10;
    } else if (project.teamSatisfaction > 90) {
        totalDecrease -= 10;
    } else if (project.teamSatisfaction > 100) {
        totalDecrease += 30;
    }

    totalDecrease = -totalDecrease;

    project.metrics.velocity += roundNumber(inversePercentage(totalDecrease, project.metrics.velocity));

    let customerSatisfaction = 0;

    if (project.clientExpectedTime - (project.sprintDuration * (project.currentSprint + 1)) - project.metrics.playerEstimatedTime < -4) {
        customerSatisfaction -= 10;
    }

    if (project.clientExpectedTime - (project.sprintDuration * (project.currentSprint + 1)) - project.metrics.playerEstimatedTime > 1) {
        customerSatisfaction += 10;
    }

    if (project.clientExpectedTime - (project.sprintDuration * (project.currentSprint + 1)) - project.metrics.playerEstimatedTime > 3) {
        customerSatisfaction += 25;
    }

    project.metrics.customerSatisfaction = roundNumber(project.metrics.customerSatisfaction + inversePercentage(customerSatisfaction, project.metrics.customerSatisfaction));

    es.saveById(projectId, { metrics: project.metrics }, 'projects').then(() => {
        res.status(200).json({ metrics: project.metrics, gameStatus: checkWin(project) });
    });

});

module.exports = router;