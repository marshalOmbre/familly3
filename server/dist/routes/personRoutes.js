"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personController_1 = require("../controllers/personController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.post('/', personController_1.createPerson);
router.get('/:id', personController_1.getPerson);
router.put('/:id', personController_1.updatePerson);
router.delete('/:id', personController_1.deletePerson);
exports.default = router;
