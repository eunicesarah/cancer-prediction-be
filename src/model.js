class Prediction {
    constructor(id, result, suggestion, createdAt) {
        this.id = id;
        this.result = result;
        this.suggestion = suggestion;
        this.createdAt = createdAt;
    }
}

module.exports = Prediction;