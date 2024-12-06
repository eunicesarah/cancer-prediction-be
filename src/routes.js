const express = require('express');
const router = express.Router();
const multer = require('multer');
const Services = require('./services');
const Controller = require('./controller');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});

// Route to handle prediction
router.post('/predict', upload.single('image'), async (req, res) => {
    // console.log('Request file:', req.file); // Check if req.file is defined
    if (req.file.size > 1000000) {
        return res.status(413).json({
          status: "fail",
          message: "Payload content length greater than maximum allowed: 1000000",
        });
      }

    // Load the model if it hasn't been loaded yet
    if (!Services.model) {
        await Services.loadModel();
    }

    // Check if the file is present
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }


    // console.log("Image buffer:", req.file.buffer); // Log the image buffer

    try {
        // Use req.file.buffer to get the image data
        // console.log("Image buffer:", req.file.buffer); // Log the image buffer

        // console.log('Path argument:', paths[0], 'Type:', typeof paths[0]);
        const result = await Services.predictClassification(req.file.buffer);
        const prediction = await Controller.savePrediction(result, result.suggestion);

        // Send the response
        res.status(201).json({
            status: 'success',
            message: "Model is predicted successfully",
            data: {
                id: prediction.id,
                result: result.label,
                suggestion: result.suggestion,
                createdAt: prediction.createdAt
            }
        });
    } catch (err) {
        console.error('Error during prediction:', err);
        res.status(400).json({ status:"fail", message: 'Terjadi kesalahan dalam melakukan prediksi' });
    }
});

router.get('/predict/histories', async (req, res) => {
    try{
        const histories = await Controller.getAllPredictions();
        res.status(200).json({
            status: 'success',
            data: histories
        });
    }
    catch (err){
        console.error('Error getting histories:', err);
        res.status(500).json({ status:"fail", message: "Terjadi kesalahan dalam mengambil riwayat prediksi" });
    }
});

module.exports = router;
