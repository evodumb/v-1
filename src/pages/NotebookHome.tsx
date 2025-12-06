import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, NotebookPen, Trash2, Upload } from 'lucide-react';
import { api } from '../api';
import type { Note } from '../data/types';
import { extractTextFromPdf } from '../utils/pdfUtils';

const NotebookHome = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        setLoading(true);
        try {
            const data = await api.getNotes();
            setNotes(data);
        } catch (error) {
            console.error("Failed to load notes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this note?')) {
            try {
                await api.deleteNote(id);
                loadNotes();
            } catch (error) {
                console.error("Failed to delete note", error);
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file');
            return;
        }

        setImporting(true);
        try {
            const text = await extractTextFromPdf(file);
            const newNote = await api.createNote({
                title: file.name.replace('.pdf', ''),
                content: `> **Imported from ${file.name}**\n\n${text}`
            });
            navigate(`/notebook/${newNote.id}`);
        } catch (error) {
            console.error(error);
            alert(`Failed to import PDF: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="p-6 space-y-6 pb-24">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-text-primary">My Notebook</h2>

                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={importing}
                        className="bg-white text-gray-600 p-3 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                        title="Import PDF"
                    >
                        {importing ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div> : <Upload size={24} />}
                    </button>
                    <button
                        onClick={() => navigate('/notebook/new')}
                        className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading notes...</div>
            ) : notes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <NotebookPen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-text-secondary font-medium">No notes yet.</p>
                    <div className="flex justify-center gap-3 mt-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
                        >
                            <Upload size={16} /> Import PDF
                        </button>
                        <button
                            onClick={() => navigate('/notebook/new')}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90"
                        >
                            <Plus size={16} /> Create Note
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => navigate(`/notebook/${note.id}`)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-40 cursor-pointer active:scale-95 transition-transform relative group"
                        >
                            <h3 className="font-bold text-lg text-text-primary line-clamp-2 mb-2">{note.title}</h3>
                            <p className="text-xs text-text-secondary line-clamp-3 mb-auto">
                                {note.content || "No content"}
                            </p>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                                <span className="text-[10px] text-gray-400">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={(e) => handleDelete(e, note.id)}
                                    className="p-1 px-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotebookHome;
