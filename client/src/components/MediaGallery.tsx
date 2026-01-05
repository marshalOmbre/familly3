import React, { useState } from 'react';
import api from '../api';
import { Trash2, Upload } from 'lucide-react';

interface Media {
    id: string;
    url: string;
    type: string;
}

interface MediaGalleryProps {
    personId: string;
    media: Media[];
    onUpdate: () => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ personId, media, onUpdate }) => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('personId', personId);
        formData.append('type', file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT');

        setUploading(true);
        try {
            await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onUpdate();
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Media</h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
                {media.map((item) => (
                    <div key={item.id} className="relative group">
                        {item.type === 'IMAGE' ? (
                            <img src={`http://localhost:3000${item.url}`} alt="Media" className="w-full h-24 object-cover rounded" />
                        ) : (
                            <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded">
                                <span className="text-xs text-gray-500">Document</span>
                            </div>
                        )}
                        <a href={`http://localhost:3000${item.url}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition" />
                    </div>
                ))}
            </div>

            <div className="relative">
                <input
                    type="file"
                    onChange={handleUpload}
                    className="hidden"
                    id="media-upload"
                    disabled={uploading}
                />
                <label
                    htmlFor="media-upload"
                    className={`flex items-center justify-center gap-2 w-full p-2 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50 ${uploading ? 'opacity-50' : ''}`}
                >
                    <Upload size={20} />
                    {uploading ? 'Uploading...' : 'Upload Media'}
                </label>
            </div>
        </div>
    );
};

export default MediaGallery;
