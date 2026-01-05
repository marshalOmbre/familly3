import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FolderGit2, LogOut, Trees, Trash2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface Tree {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
}

const Dashboard: React.FC = () => {
    const [trees, setTrees] = useState<Tree[]>([]);
    const [newTreeName, setNewTreeName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrees();
    }, []);

    const fetchTrees = async () => {
        try {
            const response = await api.get('/trees');
            setTrees(response.data);
        } catch (error) {
            console.error('Error fetching trees:', error);
        }
    };

    const handleCreateTree = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/trees', { name: newTreeName });
            setNewTreeName('');
            setIsCreating(false);
            fetchTrees();
        } catch (error) {
            console.error('Error creating tree:', error);
        }
    };

    const handleDeleteTree = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to tree
        e.stopPropagation();
        if (!window.confirm('Are you sure? This will delete the entire tree.')) return;
        try {
            await api.delete(`/trees/${id}`);
            fetchTrees();
        } catch (error) {
            console.error('Error deleting tree:', error);
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-600 p-2 rounded-lg text-white">
                        <Trees size={24} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                        FamilyTree SaaS
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-slate-600 font-medium">Hello, {user?.name || 'User'}</span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Your Trees</h1>
                        <p className="text-slate-500 mt-2">Manage your family histories and genealogies</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-primary-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-1"
                    >
                        <Plus size={20} /> New Tree
                    </button>
                </div>

                {/* Create Tree Form (Inline/Expandable) */}
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-10 bg-white border border-primary-100 p-6 rounded-2xl shadow-lg max-w-2xl"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-slate-800">Start a New Lineage</h3>
                        <form onSubmit={handleCreateTree} className="flex gap-4">
                            <input
                                type="text"
                                value={newTreeName}
                                onChange={(e) => setNewTreeName(e.target.value)}
                                placeholder="E.g. The Windsors"
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none bg-slate-50"
                                autoFocus
                                required
                            />
                            <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors font-medium">
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-6 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trees.map((tree, index) => (
                        <motion.div
                            key={tree.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={`/tree/${tree.id}`} className="group block h-full">
                                <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full hover:shadow-xl hover:border-primary-200 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-200 group-hover:bg-primary-500 transition-colors" />

                                    <div className="flex justify-between items-start mb-4 pl-4">
                                        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl group-hover:bg-primary-100 transition-colors">
                                            <FolderGit2 size={24} />
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteTree(tree.id, e)}
                                            className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                            title="Delete Tree"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="pl-4">
                                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-700 transition-colors">
                                            {tree.name}
                                        </h2>
                                        <p className="text-sm text-slate-400">
                                            Created {new Date(tree.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {trees.length === 0 && !isCreating && (
                        <div className="col-span-full py-20 text-center text-slate-400 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                            <FolderGit2 size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No trees found. Create your first one above!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
