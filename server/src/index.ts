import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import treeRoutes from './routes/treeRoutes';
import personRoutes from './routes/personRoutes';
import relationshipRoutes from './routes/relationshipRoutes';
import uploadRoutes from './routes/uploadRoutes';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/trees', treeRoutes);
app.use('/people', personRoutes);
app.use('/relationships', relationshipRoutes);
app.use('/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('Family Tree SaaS API');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
