import { useEffect, useState } from 'react';
import { X, Plus, Edit2, Trash2, Save, XCircle } from 'lucide-react';
import { API_V1_BASE_URL } from '../../config/api';
import { getAuth } from '../../utils/authStorage';

interface AdminNote {
  id: number;
  note_text: string;
  admin_name: string;
  admin_email: string;
  created_at: string;
  updated_at: string;
}

interface AdminNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const AdminNotesModal = ({ isOpen, onClose, userId, userName }: AdminNotesModalProps) => {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen, userId]);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      if (!auth?.access_token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_V1_BASE_URL}/admin-management/members/${userId}/notes/`, {
        headers: {
          'Authorization': `Bearer ${auth.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNoteText.trim()) {
      alert('Please enter note text');
      return;
    }

    setIsAddingNote(true);
    try {
      const auth = getAuth();
      if (!auth?.access_token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_V1_BASE_URL}/admin-management/members/${userId}/notes/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note_text: newNoteText }),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setNewNoteText('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleUpdateNote = async (noteId: number) => {
    if (!editNoteText.trim()) {
      alert('Please enter note text');
      return;
    }

    try {
      const auth = getAuth();
      if (!auth?.access_token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_V1_BASE_URL}/admin-management/notes/${noteId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${auth.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note_text: editNoteText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const updatedNote = await response.json();
      setNotes(notes.map(note => note.id === noteId ? updatedNote : note));
      setEditingNoteId(null);
      setEditNoteText('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const auth = getAuth();
      if (!auth?.access_token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_V1_BASE_URL}/admin-management/notes/${noteId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const startEditing = (note: AdminNote) => {
    setEditingNoteId(note.id);
    setEditNoteText(note.note_text);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditNoteText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Admin Notes</h2>
            <p className="text-sm text-gray-500 mt-1">Notes for {userName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Add New Note Section */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add New Note
            </label>
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Enter note about this member..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2590] focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddNote}
                disabled={isAddingNote || !newNoteText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-[#5E2590] text-white rounded-lg hover:bg-[#4a1d73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                {isAddingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#5E2590] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Notes List */}
          {!loading && notes.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No notes yet. Add the first note above.
            </div>
          )}

          {!loading && notes.length > 0 && (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingNoteId === note.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <textarea
                        value={editNoteText}
                        onChange={(e) => setEditNoteText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2590] focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEditing}
                          className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateNote(note.id)}
                          disabled={!editNoteText.trim()}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#5E2590] text-white rounded-lg hover:bg-[#4a1d73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{note.admin_name}</p>
                          <p className="text-xs text-gray-500">{note.admin_email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditing(note)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit note"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">{note.note_text}</p>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Created: {new Date(note.created_at).toLocaleString()}</span>
                        {note.updated_at !== note.created_at && (
                          <span>Updated: {new Date(note.updated_at).toLocaleString()}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotesModal;
