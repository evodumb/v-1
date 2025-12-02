import { useState } from 'react';
import { Calendar, Plus, Clock, Trash2, Mic, Bell } from 'lucide-react';
import clsx from 'clsx';
import { TIMETABLE } from '../data/mockData';
import type { TimetableItem } from '../data/types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Timetable = () => {
    const [items, setItems] = useState<TimetableItem[]>(TIMETABLE);
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', time: '', type: 'Class' as const });

    const filteredItems = items.filter(item => item.day === selectedDay);

    const handleAddItem = () => {
        if (!newItem.title || !newItem.time) return;

        const item: TimetableItem = {
            id: Date.now().toString(),
            title: newItem.title,
            time: newItem.time,
            day: selectedDay,
            type: newItem.type
        };

        setItems([...items, item]);
        setShowAddModal(false);
        setNewItem({ title: '', time: '', type: 'Class' });
    };

    const handleDelete = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div className="p-6 pb-24 min-h-screen bg-background relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-text-primary">Timetable</h2>
                <button className="p-2 bg-white rounded-full shadow-sm text-primary">
                    <Bell size={20} />
                </button>
            </div>

            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                {DAYS.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={clsx(
                            "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                            selectedDay === day
                                ? "bg-primary text-white shadow-md shadow-primary/30"
                                : "bg-white text-text-secondary border border-gray-100"
                        )}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Timetable List */}
            <div className="space-y-4">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12 text-text-light">
                        <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No classes scheduled for {selectedDay}</p>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 animate-fade-in">
                            <div className={clsx(
                                "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs",
                                item.type === 'Class' ? "bg-blue-500" : item.type === 'Quiz' ? "bg-red-500" : "bg-green-500"
                            )}>
                                {item.time}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-text-primary">{item.title}</h3>
                                <p className="text-xs text-text-secondary">{item.type}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Button */}
            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform"
            >
                <Plus size={28} />
            </button>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 animate-slide-up">
                        <h3 className="text-xl font-bold mb-4">Add Schedule</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Title</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newItem.title}
                                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                        placeholder="e.g. Math Class"
                                        className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                                    />
                                    <button className="p-3 bg-gray-100 rounded-xl text-text-secondary">
                                        <Mic size={20} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Time</label>
                                <div className="flex items-center gap-2 p-3 rounded-xl border border-gray-200">
                                    <Clock size={20} className="text-gray-400" />
                                    <input
                                        type="time"
                                        value={newItem.time}
                                        onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                                        className="flex-1 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Type</label>
                                <div className="flex gap-2">
                                    {['Class', 'Study', 'Quiz'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setNewItem({ ...newItem, type: type as any })}
                                            className={clsx(
                                                "flex-1 py-2 rounded-lg text-sm font-bold border transition-colors",
                                                newItem.type === type
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white text-text-secondary border-gray-200"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 font-bold text-text-secondary bg-gray-100 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddItem}
                                className="flex-1 py-3 font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/30"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timetable;
