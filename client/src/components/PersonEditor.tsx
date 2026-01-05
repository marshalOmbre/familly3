import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { X, Save, Trash2, Upload, Calendar, MapPin, User, FileText } from 'lucide-react';
import api from '../api';
import MediaGallery from './MediaGallery';

interface Person {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string | null;
    deathDate: string | null;
    birthPlace: string | null;
    deathPlace: string | null;
    bio: string | null;
}

interface PersonEditorProps {
    personId: string | null;
    treeId: string;
    onClose: () => void;
    onSave: () => void;
}

const PersonEditor: React.FC<PersonEditorProps> = ({ personId, treeId, onClose, onSave }) => {
    const { register, handleSubmit, reset, setValue } = useForm<Person>();

    useEffect(() => {
        if (personId) {
            fetchPerson();
        } else {
            reset({});
        }
    }, [personId]);

    const fetchPerson = async () => {
        try {
            const response = await api.get(`/people/${personId}`);
            const person = response.data;
            if (person.birthDate) person.birthDate = person.birthDate.split('T')[0];
            if (person.deathDate) person.deathDate = person.deathDate.split('T')[0];

            Object.keys(person).forEach(key => {
                setValue(key as keyof Person, person[key]);
            });
        } catch (error) {
            console.error('Error fetching person:', error);
        }
    };

    const onSubmit = async (data: Person) => {
        try {
            if (personId) {
                await api.put(`/people/${personId}`, data);
            } else {
                await api.post('/people', { ...data, treeId });
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving person:', error);
        }
    };

    const handleDelete = async () => {
        if (!personId || !window.confirm('Are you sure you want to delete this person? This cannot be undone.')) return;
        try {
            await api.delete(`/people/${personId}`);
            onSave();
            onClose();
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
            onClick={onClose}
        >
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100 p-4 flex justify-between items-center px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{personId ? 'Edit Profile' : 'New Person'}</h2>
                        <p className="text-sm text-slate-500">Manage details and memories</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">

                    {/* Identity Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <User size={16} className="text-primary-500" /> Identity
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                <input {...register('firstName', { required: true })} className="input-field w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="Jane" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                <input {...register('lastName', { required: true })} className="input-field w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select {...register('gender')} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white">
                                <option value="">Select gender...</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>
                    </section>

                    <div className="h-px bg-slate-100"></div>

                    {/* Life Events Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Calendar size={16} className="text-primary-500" /> Life Events
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-3">Birth</label>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Date</label>
                                        <input type="date" {...register('birthDate')} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Place</label>
                                        <input {...register('birthPlace')} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" placeholder="City, Country" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-3">Death (Optional)</label>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Date</label>
                                        <input type="date" {...register('deathDate')} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Place</label>
                                        <input {...register('deathPlace')} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" placeholder="City, Country" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-slate-100"></div>

                    {/* Bio Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <FileText size={16} className="text-primary-500" /> Biography
                        </h3>
                        <textarea
                            {...register('bio')}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm leading-relaxed"
                            rows={4}
                            placeholder="Write a short biography..."
                        />
                    </section>

                    {personId && (
                        <>
                            <div className="h-px bg-slate-100"></div>
                            <section className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <Upload size={16} className="text-primary-500" /> Media
                                </h3>
                                <MediaGallery personId={personId} media={[]} onUpdate={onSave} />
                            </section>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white p-4 border-t border-slate-100 -mx-6 -mb-6 mt-8">
                        <button
                            type="submit"
                            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                        {personId && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                title="Delete Person"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default PersonEditor;
