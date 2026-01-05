import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createPerson = async (req: AuthRequest, res: Response) => {
    try {
        const { treeId, firstName, lastName, gender, birthDate, deathDate, birthPlace, deathPlace, bio } = req.body;

        // Verify tree ownership
        const tree = await prisma.familyTree.findUnique({ where: { id: treeId } });
        if (!tree || tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const person = await prisma.person.create({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating person' });
    }
};

export const updatePerson = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, gender, birthDate, deathDate, birthPlace, deathPlace, bio } = req.body;

        const person = await prisma.person.findUnique({
            where: { id },
            include: { tree: true },
        });

        if (!person || person.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedPerson = await prisma.person.update({
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
    } catch (error) {
        res.status(500).json({ message: 'Error updating person' });
    }
};

export const deletePerson = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const person = await prisma.person.findUnique({
            where: { id },
            include: { tree: true },
        });

        if (!person || person.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await prisma.person.delete({ where: { id } });
        res.json({ message: 'Person deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting person' });
    }
};

export const getPerson = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const person = await prisma.person.findUnique({
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
    } catch (error) {
        res.status(500).json({ message: 'Error fetching person' });
    }
};
