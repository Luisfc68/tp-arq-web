const logger = require('consola');
const express = require('express');

const loggingMiddleware = require("./middlewares/logger");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(loggingMiddleware);



app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message
    });
});

app.listen(PORT, () => {
    logger.start(`Servidor iniciado en ${PORT}`);
})
