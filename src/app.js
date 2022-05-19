const logger = require('consola');
const express = require('express');
const mongoose = require('mongoose');

const expressConfig = require('./configs/express.config');
const mongoConfig = require('./configs/mongo.config');

const loggingMiddleware = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');

const usersRouter = require('./routes/users.routes');
const restaurantsRouter = require('./routes/restaurant.routes');
const mealsRouter = require('./routes/meals.routes');

const app = express();

app.use(express.json());
app.use(loggingMiddleware);

// controllers
app.use(usersRouter);
app.use(restaurantsRouter);
app.use(mealsRouter);
app.use(errorHandler);

mongoose.connect(mongoConfig.getDbUri(), (error) => {
    if(error) {
        logger.error(`Error conecting to database ${error}`)
        return;
    }
    logger.start(`Conected to database ${mongoConfig.name}`);
    app.listen(expressConfig.port, () => {
        logger.start(`Server started on port ${expressConfig.port}`);
    })
});
