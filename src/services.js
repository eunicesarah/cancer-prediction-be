const path = require("path");
const tf = require("@tensorflow/tfjs-node");

class Services {
  constructor() {
    this.model = null;
  }

  async loadModel() {
    // console.log("Loading model...");
    // Use path.join to create a valid path
    // const modelPath = path.join(__dirname, "models/model.json"); // Adjust the path as necessary

    try {
      this.model = await tf.loadGraphModel(
        `https://storage.googleapis.com/cancer-predict-model/model/model.json`
      ); // Use file:// protocol
      // console.log('Model loaded successfully:', this.model);
    } catch (error) {
      console.error("Error loading model:", error);
    }
  }

  async predictClassification(img) {
    // Decode the image and resize it to 224x224
    const tensor = tf.node
      .decodeJpeg(img)
      .resizeNearestNeighbor([224, 224]) // Resize to 224x224
      .expandDims() // Add batch dimension
      .toFloat()
    // console.log("Tensor:", tensor);

    // Ensure the tensor has 3 channels (RGB)
    if (tensor.shape[3] === 4) {
      // If the image has 4 channels (RGBA), convert to RGB
      const rgbTensor = tensor.slice([0, 0, 0, 0], [-1, -1, -1, 3]);
      const prediction = this.model.predict(rgbTensor);
      const score = await prediction.data();
      const confidence_score = Math.max(...score) * 100;
      const label = confidence_score > 50 ? "Cancer" : "Non-cancer";
      let suggestion;
      if (label === "Cancer") {
        suggestion = "Segera periksa ke dokter!";
      } else {
        suggestion = "Penyakit kanker tidak terdeteksi.";
      }

      return { confidence_score, label, suggestion };
    }
    // console.log("Predicting...");
    const prediction = this.model.predict(tensor);
    // console.log("Prediction:", prediction);
    const score = await prediction.data();
    // console.log("Score:", score);
    const confidence_score = Math.max(...score) * 100;
    // console.log("Confidence score:", confidence_score);
    const label = confidence_score > 50 ? "Cancer" : "Non-cancer";
    let suggestion = null;
    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    } else {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    }
    return {
      confidence_score,
      label,
      suggestion,
    };
  }
}

module.exports = new Services();
