"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTree = exports.updateTree = exports.getTree = exports.createTree = exports.getTrees = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getTrees = async (req, res) => {
    try {
        const trees = await prisma_1.default.familyTree.findMany({
            where: { ownerId: req.userId },
            include: { _count: { select: { people: true } } },
        });
        res.json(trees);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching trees' });
    }
};
exports.getTrees = getTrees;
const createTree = async (req, res) => {
    try {
        const { name, description } = req.body;
        const tree = await prisma_1.default.familyTree.create({
            data: {
                name,
                description,
                ownerId: req.userId,
            },
        });
        res.status(201).json(tree);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating tree' });
    }
};
exports.createTree = createTree;
const getTree = async (req, res) => {
    try {
        const { id } = req.params;
        const tree = await prisma_1.default.familyTree.findUnique({
            where: { id },
            include: {
                people: {
                    include: {
                        media: true,
                        relationshipsAsPerson1: true,
                        relationshipsAsPerson2: true,
                    },
                },
            },
        });
        if (!tree) {
            return res.status(404).json({ message: 'Tree not found' });
        }
        // Check ownership (or shared access in future)
        if (tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(tree);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tree' });
    }
};
exports.getTree = getTree;
const updateTree = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const tree = await prisma_1.default.familyTree.findUnique({ where: { id } });
        if (!tree || tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updatedTree = await prisma_1.default.familyTree.update({
            where: { id },
            data: { name, description },
        });
        res.json(updatedTree);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating tree' });
    }
};
exports.updateTree = updateTree;
const deleteTree = async (req, res) => {
    try {
        const { id } = req.params;
        const tree = await prisma_1.default.familyTree.findUnique({ where: { id } });
        if (!tree || tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await prisma_1.default.familyTree.delete({ where: { id } });
        res.json({ message: 'Tree deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting tree' });
    }
};
exports.deleteTree = deleteTree;
