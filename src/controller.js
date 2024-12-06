const Prediction = require('./model');
const { v4: uuidv4 } = require('uuid');
const db = require('./config');
class Controller {
    async savePrediction(res, suggestion) {
        const id = uuidv4();
        const createdAt = new Date().toISOString();
        const prediction = new Prediction(id, res, suggestion, createdAt);
        // console.log('Saving prediction:', prediction);

        await db.collection('predictions').doc(id).set({
            id: prediction.id,
            result: prediction.result instanceof Object ? JSON.parse(JSON.stringify(prediction.result)) : prediction.result,
            suggestion: prediction.suggestion  !== undefined ? JSON.parse(JSON.stringify(prediction.suggestion)) : null ,
            createdAt: prediction.createdAt,
        });
        // console.log('Saving prediction:', prediction);
        
        return prediction;
    }

    async getAllPredictions(){
        const snapshot = await db.collection('predictions').get();
        const predictions = [];

        snapshot.forEach((doc) => {
            predictions.push(doc.data());
        });
        console.log('Getting all predictions:', predictions);

        return predictions;
    }
}

module.exports = new Controller();