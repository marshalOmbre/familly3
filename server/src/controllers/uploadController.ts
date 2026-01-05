import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

export const upload = multer({ storage: storage });

export const uploadMedia = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { personId, type } = req.body;
        const url = `/uploads/${req.file.filename}`;

        // Verify person ownership
        const person = await prisma.person.findUnique({
            where: { id: personId },
            include: { tree: true },
        });

        if (!person || person.tree.ownerId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const media = await prisma.media.create({
            data: {
                url,
                type, // IMAGE, DOCUMENT
                personId,
            },
        });

        res.status(201).json(media);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file' });
    }
};
