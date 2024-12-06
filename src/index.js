const express = require('express');
const predictRouter = require('./routes');
const app = express();
const multer = require('multer');
const port = 3000;
const cors = require('cors');

app.use(cors({
    origin: 'https://submissionmlgc-eunice.et.r.appspot.com/',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(express.json());
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          status: "fail",
          message: "Payload content length greater than maximum allowed: 1000000",
        });
      }
    }
    next(err);
  });
app.use(predictRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);