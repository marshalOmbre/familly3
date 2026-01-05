"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const treeRoutes_1 = __importDefault(require("./routes/treeRoutes"));
const personRoutes_1 = __importDefault(require("./routes/personRoutes"));
const relationshipRoutes_1 = __importDefault(require("./routes/relationshipRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/auth', authRoutes_1.default);
app.use('/trees', treeRoutes_1.default);
app.use('/people', personRoutes_1.default);
app.use('/relationships', relationshipRoutes_1.default);
app.use('/upload', uploadRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Family Tree SaaS API');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
