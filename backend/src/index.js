"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const exchange_1 = __importDefault(require("./exchange"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/dist')));
// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../frontend/dist/index.html'));
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use('/api/exchange', exchange_1.default);
app.listen(7000, () => {
    console.log('Server is running on port 7000');
});
