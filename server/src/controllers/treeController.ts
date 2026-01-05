import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTrees = async (req: AuthRequest, res: Response) => {
    try {
        const trees = await prisma.familyTree.findMany({
            where: { ownerId: req.userId },
            include: { _count: { select: { people: true } } },
        });
        res.json(trees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trees' });
    }
};

export const createTree = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description } = req.body;
        const tree = await prisma.familyTree.create({
            data: {
                name,
                description,
                ownerId: req.userId as string,
            },
        });
        res.status(201).json(tree);
    } catch (error) {
        res.status(500).json({ message: 'Error creating tree' });
    }
};

export const getTree = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const tree = await prisma.familyTree.findUnique({
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
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tree' });
    }
};

export const updateTree = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const tree = await prisma.familyTree.findUnique({ where: { id } });
        if (!tree || tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedTree = await prisma.familyTree.update({
            where: { id },
            data: { name, description },
        });
        res.json(updatedTree);
    } catch (error) {
        res.status(500).json({ message: 'Error updating tree' });
    }
};

export const deleteTree = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const tree = await prisma.familyTree.findUnique({ where: { id } });
        if (!tree || tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await prisma.familyTree.delete({ where: { id } });
        res.json({ message: 'Tree deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tree' });
    }
};
