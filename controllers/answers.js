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
