import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, UploadCloud, Trash2, Loader2, BookOpen, User, Link as LinkIcon, FileText } from 'lucide-react';
import { collection, addDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useBooks, Book } from '../hooks/useBooks';
import { ConfirmationModal } from './ConfirmationModal';

export function BooksManager() {
  const { books, loading: booksLoading } = useBooks();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string>('');
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    pdfUrl: '',
    coverUrl: ''
  });

  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSizeErr, setPdfFileSizeErr] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Handle PDF file selection and conversion to base64 Data URL
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a valid PDF file.');
        return;
      }

      // Firestore document is limited to 1MB. Base64 adds ~33% overhead.
      // So file should be well under 750KB to fit comfortably inside the 1MB limit.
      const sizeKB = file.size / 1024;
      if (sizeKB > 750) {
        setPdfFileSizeErr(
          `File is ${Math.round(sizeKB)}KB. Direct uploads to Firestore must be under 750KB due to database limits. Please paste an external PDF download link (e.g., Google Drive) instead.`
        );
        return;
      }

      setPdfFileSizeErr('');
      setPdfFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBook(prev => ({ ...prev, pdfUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cover image upload (similar to Gallery resize)
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 400; // Small size is plenty for book covers
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setCoverPreview(resizedDataUrl);
          setNewBook(prev => ({ ...prev, coverUrl: resizedDataUrl }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.pdfUrl) {
      alert('Please upload a PDF file or provide a valid PDF link');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'books'), {
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        pdfUrl: newBook.pdfUrl,
        coverUrl: newBook.coverUrl || '',
        downloads: 0,
        createdAt: serverTimestamp()
      });

      // Reset
      setNewBook({
        title: '',
        author: '',
        description: '',
        pdfUrl: '',
        coverUrl: ''
      });
      setCoverPreview(null);
      setPdfFileName('');
      setPdfFileSizeErr('');
      setShowAdd(false);
      alert('Book added to digital library successfully.');
    } catch (err) {
      console.error("Failed to add book:", err instanceof Error ? err.message : String(err));
      alert('Failed to insert book to Firestore.');
      handleFirestoreError(err, OperationType.CREATE, 'books');
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (id: string, title: string) => {
    setDeleteTargetId(id);
    setDeleteTargetTitle(title);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'books', id));
      alert('Book deleted successfully.');
    } catch (err) {
      console.error("Failed to delete book:", err instanceof Error ? err.message : String(err));
      alert('Failed to delete book. Make sure you are authorized.');
      handleFirestoreError(err, OperationType.DELETE, `books/${id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Quick Info */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading font-black">Digital Bookstore</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Total Books: {books.length}</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 py-2 px-4 bg-brand-gold text-brand-black hover:bg-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? 'Cancel' : 'Post Book'}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="glass p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
          >
            {/* Book Info Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Book Information</h3>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white outline-none focus:border-brand-gold placeholder-slate-500"
                placeholder="Book Title *"
                type="text"
                value={newBook.title}
                onChange={e => setNewBook({...newBook, title: e.target.value})}
                required
              />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white outline-none focus:border-brand-gold placeholder-slate-500"
                placeholder="Author Name *"
                type="text"
                value={newBook.author}
                onChange={e => setNewBook({...newBook, author: e.target.value})}
                required
              />
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white outline-none focus:border-brand-gold resize-none placeholder-slate-500"
                placeholder="Write a brief synopsis about the book..."
                rows={4}
                value={newBook.description}
                onChange={e => setNewBook({...newBook, description: e.target.value})}
              />
            </div>

            {/* File Upload Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Media & Files</h3>
              
              {/* PDF upload or Link choice */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-left">PDF Source</label>
                
                {pdfFileSizeErr && (
                  <p className="text-[11px] text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20 leading-relaxed">
                    {pdfFileSizeErr}
                  </p>
                )}

                {/* File picker */}
                <div className="flex gap-4">
                  <label className="flex-1 border-2 border-dashed border-white/15 hover:border-brand-gold/50 rounded-xl px-4 py-3 flex items-center justify-center gap-3 cursor-pointer group transition-colors">
                    <UploadCloud size={18} className="text-slate-500 group-hover:text-brand-gold transition-colors" />
                    <span className="text-xs text-slate-400 group-hover:text-white font-semibold truncate max-w-[150px]">
                      {pdfFileName || 'Select PDF File'}
                    </span>
                    <input type="file" className="hidden" accept="application/pdf" onChange={handlePdfFileChange} />
                  </label>

                  <div className="flex items-center text-slate-600 text-[10px] font-black uppercase">OR</div>

                  {/* External Url field */}
                  <input
                    className="flex-[1.5] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold placeholder-slate-500"
                    placeholder="Paste PDF link (e.g. Google Drive)"
                    type="url"
                    value={newBook.pdfUrl?.startsWith('data:') ? '' : newBook.pdfUrl}
                    onChange={e => {
                      setNewBook({...newBook, pdfUrl: e.target.value});
                      setPdfFileName('');
                      setPdfFileSizeErr('');
                    }}
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-left">Cover Artwork (Optional)</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-xl border border-white/5 bg-slate-900/40 flex items-center justify-center overflow-hidden shrink-0">
                    {coverPreview ? (
                      <img src={coverPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <BookOpen size={16} className="text-slate-600" />
                    )}
                  </div>
                  
                  <label className="flex-1 py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-widest rounded-xl text-center text-slate-300 cursor-pointer transition-colors block">
                    Upload Cover
                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverFileChange} />
                  </label>
                  
                  {coverPreview && (
                    <button 
                      type="button"
                      onClick={() => { setCoverPreview(null); setNewBook({...newBook, coverUrl: ''}); }}
                      className="text-red-500/50 hover:text-red-500 text-[10px] uppercase font-bold tracking-widest"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="md:col-span-2 py-4 bg-brand-gold text-brand-black rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 mt-4 text-xs"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Publishing Book...' : 'Save & Publish Book'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Book Grid List */}
      {booksLoading ? (
        <div className="text-center py-12 text-slate-500">Retrieving digital vault...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 text-slate-500 italic">No books posted yet. Hit the 'Post Book' button to upload templates or booklets.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map(book => (
            <div key={book.id} className="glass p-4 rounded-2xl flex items-center gap-6 group hover:border-white/20 transition-all text-white">
              {/* Cover mini representation */}
              <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 glass border border-white/5 flex items-center justify-center bg-slate-900/50">
                {book.coverUrl ? (
                  <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} referrerPolicy="no-referrer" />
                ) : (
                  <BookOpen size={20} className="text-brand-gold/40" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{book.title}</h4>
                <p className="text-xs text-brand-gold/70 mt-0.5">By {book.author}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-slate-500 font-mono">Downloads: {book.downloads || 0}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                    {book.pdfUrl?.startsWith('data:') ? 'Hosted Document' : 'External Link'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => initiateDelete(book.id, book.title)} 
                  className="p-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Delete Book"
        message={`Are you absolutely sure you want to delete "${deleteTargetTitle}"? This action is permanent and cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
