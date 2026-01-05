import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Settings, ZoomIn, ZoomOut, Share2 } from 'lucide-react';
import api from '../api';
import TreeVisualization from '../components/TreeVisualization';
import PersonEditor from '../components/PersonEditor';

const TreeEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tree, setTree] = useState<any>(null);
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    useEffect(() => {
        fetchTree();
    }, [id]);

    const fetchTree = async () => {
        try {
            const response = await api.get(`/trees/${id}`);
            setTree(response.data);
        } catch (error) {
            console.error('Error fetching tree:', error);
        }
    };

    const handlePersonClick = (personId: string) => {
        console.log('Person clicked:', personId);
        setSelectedPersonId(personId);
        setIsEditorOpen(true);
    };

    const handleAddPerson = () => {
        setSelectedPersonId(null);
        setIsEditorOpen(true);
    };

    const handleSave = () => {
        fetchTree();
    };

    if (!tree) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-slate-50 relative overflow-hidden">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-between items-start">
                    <Link to="/" className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg hover:bg-white pointer-events-auto transition-transform hover:scale-105 text-slate-700">
                        <ArrowLeft size={20} />
                    </Link>

                    <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg pointer-events-auto flex items-center gap-4">
                        <h1 className="text-lg font-bold text-slate-800">{tree.name}</h1>
                        <button className="text-slate-400 hover:text-primary-600 transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Toolbar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2">
                    <button
                        onClick={handleAddPerson}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5"
                    >
                        <Plus size={20} /> Add Person
                    </button>
                    <div className="w-px h-8 bg-slate-200 mx-2"></div>
                    <button className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" title="Zoom In">
                        <ZoomIn size={20} />
                    </button>
                    <button className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" title="Zoom Out">
                        <ZoomOut size={20} />
                    </button>
                    <button className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" title="Share">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Tree Visualization Area */}
            <div className="flex-1 overflow-hidden relative">
                {/* Dotted Background */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}></div>

                <TreeVisualization data={tree.people} onPersonClick={handlePersonClick} />
            </div>

            {/* Person Editor Modal */}
            <AnimatePresence>
                {isEditorOpen && (
                    <PersonEditor
                        personId={selectedPersonId}
                        treeId={tree.id}
                        onClose={() => setIsEditorOpen(false)}
                        onSave={handleSave}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TreeEditor;
