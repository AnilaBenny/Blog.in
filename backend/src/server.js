"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./middleware/logger"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const database_1 = require("./config/database");
const path = require('path');
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:3001','https://persual.vercel.app'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.url}`);
    next();
});
app.use('/', authRoute_1.default, articleRoutes_1.default);
app.use('/uploads', express_1.default.static(path.default.join(__dirname, 'uploads')));
app.use((err, req, res, next) => {
    logger_1.default.error(`${err.status || 500} - ${err.message}`);
    res.status(err.status || 500).send('Something went wrong!');
});
const PORT = process.env.PORT || 8080;
(0, database_1.connectToDatabase)().then(() => {
    app.listen(PORT, () => {
        logger_1.default.info(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    logger_1.default.error('Failed to connect to the database:', error);
});
