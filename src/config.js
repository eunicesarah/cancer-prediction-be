const {Firestore} = require('@google-cloud/firestore');
// const keyFilenamePath = require('../service__account.json');
// const path = require('path');
// const modelPath = path.join(__dirname, "service__account.json"); // Adjust the path as necessary

const db = new Firestore({
    projectId: 'submissionmlgc-eunice',
    keyFilename: "./service__account.json",
    });
module.exports = db;


