"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const treeController_1 = require("../controllers/treeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.get('/', treeController_1.getTrees);
router.post('/', treeController_1.createTree);
router.get('/:id', treeController_1.getTree);
router.put('/:id', treeController_1.updateTree);
router.delete('/:id', treeController_1.deleteTree);
exports.default = router;
