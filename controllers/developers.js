
'use strict';
const es = require('../utils/esHelper');
const router = require('express').Router();
const userSpeicializations = ['backend', 'frontend', 'ai', 'integrations'];
const userDetails = require('../defaultNames.json');

function getRandom(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

router.get('/available', (req, res, next) => {
    //console.log(res, req);
    let users = [];

    for (let index = 0; index < 10; index++) {
        let user = userDetails[index];

        user.motivation = getRandom(100, 50);
        user.velocity = getRandom(5, 1);
        user.status = 'available';
        user.specialization = userSpeicializations[getRandom(userSpeicializations.length)];
        while (!user.secodarySpecialization || user.secodarySpecialization === user.specialization) {
            user.secodarySpecialization = userSpeicializations[getRandom(userSpeicializations.length)];
        }
        
        
        users.push(user);
    }

    es.saveToDb(users, 'developers').then(() => {
        res.status(200).json({
            content: {
                users
            }
        });
    });

});

module.exports = router;