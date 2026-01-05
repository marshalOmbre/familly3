"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerson = exports.deletePerson = exports.updatePerson = exports.createPerson = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createPerson = async (req, res) => {
    try {
        const { treeId, firstName, lastName, gender, birthDate, deathDate, birthPlace, deathPlace, bio } = req.body;
        // Verify tree ownership
        const tree = await prisma_1.default.familyTree.findUnique({ where: { id: treeId } });
        if (!tree || tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const person = await prisma_1.default.person.create({
            data: {
                treeId,
                firstName,
                lastName,
                gender,
                birthDate: birthDate ? new Date(birthDate) : null,
                deathDate: deathDate ? new Date(deathDate) : null,
                birthPlace,
                deathPlace,
                bio,
            },
        });
        res.status(201).json(person);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating person' });
    }
};
exports.createPerson = createPerson;
const updatePerson = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, gender, birthDate, deathDate, birthPlace, deathPlace, bio } = req.body;
        const person = await prisma_1.default.person.findUnique({
            where: { id },
            include: { tree: true },
        });
        if (!person || person.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updatedPerson = await prisma_1.default.person.update({
            where: { id },
            data: {
                firstName,
                lastName,
                gender,
                birthDate: birthDate ? new Date(birthDate) : null,
                deathDate: deathDate ? new Date(deathDate) : null,
                birthPlace,
                deathPlace,
                bio,
            },
        });
        res.json(updatedPerson);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating person' });
    }
};
exports.updatePerson = updatePerson;
const deletePerson = async (req, res) => {
    try {
        const { id } = req.params;
        const person = await prisma_1.default.person.findUnique({
            where: { id },
            include: { tree: true },
        });
        if (!person || person.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await prisma_1.default.person.delete({ where: { id } });
        res.json({ message: 'Person deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting person' });
    }
};
exports.deletePerson = deletePerson;
const getPerson = async (req, res) => {
    try {
        const { id } = req.params;
        const person = await prisma_1.default.person.findUnique({
            where: { id },
            include: {
                tree: true,
                media: true,
                relationshipsAsPerson1: { include: { person2: true } },
                relationshipsAsPerson2: { include: { person1: true } },
            },
        });
        if (!person || person.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(person);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching person' });
    }
};
exports.getPerson = getPerson;
