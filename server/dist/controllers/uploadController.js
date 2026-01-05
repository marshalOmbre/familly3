"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMedia = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { personId, type } = req.body;
        const url = `/uploads/${req.file.filename}`;
        // Verify person ownership
        const person = await prisma_1.default.person.findUnique({
            where: { id: personId },
            include: { tree: true },
        });
        if (!person || person.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const media = await prisma_1.default.media.create({
            data: {
                url,
                type, // IMAGE, DOCUMENT
                personId,
            },
        });
        res.status(201).json(media);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file' });
    }
};
exports.uploadMedia = uploadMedia;
