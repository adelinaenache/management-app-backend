const elasticSearch = require('elasticsearch');
const AgentKeepAlive = require('agentkeepalive');
const async = require('async');
const moment = require('moment');
const config = require('../config.json');
const uuid = require('uuid');

const DBConnection = new elasticSearch.Client(Object.assign(config.elasticsearch, {
    createNodeAgent: (connection, configuration) => {
        return new AgentKeepAlive(connection.makeAgentConfig(configuration));
    }
}));


function saveToDb(objects, index) {
    if (!objects.length) {
        return Promise.resolve();
    }

    let bulkOperations = [];

    objects.forEach(object => {
        if (!object.id) {
            object.id = uuid.v4();
        }
        bulkOperations.push({ index: { _type: 'user', _id: object.id } });

        bulkOperations.push(object);
    });

    return new Promise((resolve, reject) => {
        DBConnection.bulk({
            index: index,
            body: bulkOperations
        }, (err, result) => {
            if (err) {
                return reject(err);
            }

            let errors = 0;

            if (result.errors) {
                result.items.forEach(item => {
                    if (item.index.error) {
                        console.log(`Could not save object to DB: ${item.index.error}`);
                    }
                });
            }

            console.log(`Saved ${result.items.length - errors} objects with ${errors} errors`);

            return resolve(result.items.length);
        });
    });
}


function getById(id, index) {
    let query = {
        index: index,
        type: 'user',
        id: id
    };

    return new Promise((resolve, reject) => {
        DBConnection.get(query, (error, response) => {
            // console.log(error, response);
            // console.log(query, error, query);
            //console.log(response);
            if (error) {
                return reject(error);
            } else {
                return resolve(response);
            }
        });
    });
}

function updateById(id, object, index) {
    let query = {
        index: index,
        type: 'user',
        id: id,
        body: { doc: object }
    };

    return new Promise((resolve, reject) => {
        DBConnection.update(query, (error, response) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(response);
            }
        });
    });
}

function getAll(index) {
    let query = {
        index: index,
        type: 'user'
    }

    return new Promise((resolve, reject) => {
        DBConnection.search(query, (error, response) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(response.hits.hits);
            }
        });

    });
}
module.exports = {
    saveToDb,
    getById,
    updateById,
    getAll
}
