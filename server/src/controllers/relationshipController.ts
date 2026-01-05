import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createRelationship = async (req: AuthRequest, res: Response) => {
    try {
        const { person1Id, person2Id, type } = req.body;

        // Verify ownership of both people (assuming they must belong to trees owned by the user)
        // For simplicity, we check if person1 belongs to a tree owned by the user.
        // Ideally, we should check both.
        const person1 = await prisma.person.findUnique({ where: { id: person1Id }, include: { tree: true } });
        if (!person1 || person1.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const relationship = await prisma.relationship.create({
            data: {
                person1Id,
                person2Id,
                type,
            },
        });
        res.status(201).json(relationship);
    } catch (error) {
        res.status(500).json({ message: 'Error creating relationship' });
    }
};

export const deleteRelationship = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const relationship = await prisma.relationship.findUnique({
            where: { id },
            include: { person1: { include: { tree: true } } },
        });

        if (!relationship || relationship.person1.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await prisma.relationship.delete({ where: { id } });
        res.json({ message: 'Relationship deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting relationship' });
    }
};
