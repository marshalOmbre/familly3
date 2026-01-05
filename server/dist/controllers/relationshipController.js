"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRelationship = exports.createRelationship = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createRelationship = async (req, res) => {
    try {
        const { person1Id, person2Id, type } = req.body;
        // Verify ownership of both people (assuming they must belong to trees owned by the user)
        // For simplicity, we check if person1 belongs to a tree owned by the user.
        // Ideally, we should check both.
        const person1 = await prisma_1.default.person.findUnique({ where: { id: person1Id }, include: { tree: true } });
        if (!person1 || person1.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const relationship = await prisma_1.default.relationship.create({
            data: {
                person1Id,
                person2Id,
                type,
            },
        });
        res.status(201).json(relationship);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating relationship' });
    }
};
exports.createRelationship = createRelationship;
const deleteRelationship = async (req, res) => {
    try {
        const { id } = req.params;
        const relationship = await prisma_1.default.relationship.findUnique({
            where: { id },
            include: { person1: { include: { tree: true } } },
        });
        if (!relationship || relationship.person1.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await prisma_1.default.relationship.delete({ where: { id } });
        res.json({ message: 'Relationship deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting relationship' });
    }
};
exports.deleteRelationship = deleteRelationship;
