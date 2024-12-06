const Services = require('./services');


const predict = async (req, res) => {
    console.log('Predicting...');
    if (!Services.model) {
        await Services.loadModel();
    }
    console.log("image buffer " + req.file);
    const result = await Services.predictClassification(req.image.buffer);
    const prediction = await Controller.savePrediction(result, result.suggestion);

    res.status(200).json(
        {
            id: prediction.id,
            createdAt: prediction.createdAt,
            result: prediction.result,
            suggestion: prediction.suggestion,
        }
    );
}

module.exports = { predict };