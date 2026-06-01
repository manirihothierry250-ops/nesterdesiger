import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Download, Search, X, User, FileText, Info, ArrowRight, Eye } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useBooks, Book } from '../hooks/useBooks';

export function BooksPage() {
  const { books, loading } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = async (book: Book) => {
    try {
      // Trigger native download
      const link = document.createElement('a');
      link.href = book.pdfUrl;
      link.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Increment count in Firestore (safely)
      const bookRef = doc(db, 'books', book.id);
      await updateDoc(bookRef, {
        downloads: increment(1)
      });
    } catch (error) {
      console.error('Error recording download:', error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <main className="pt-32 pb-24 bg-brand-black min-h-screen text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-gold/5 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <div className="container mx-auto px-6 text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full mb-6 inline-block">
            Nesta Digital Library
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Knowledge <span className="text-brand-gold">Corner</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            Expand your horizon. Access our curated collection of textbooks, resources, digital art guides, and project planning materials. All free to view online or download.
          </p>
        </motion.div>

        {/* Search Input Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl mx-auto relative group"
        >
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500 group-focus-within:text-brand-gold transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by book title, author, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 focus:outline-none focus:border-brand-gold focus:bg-white/[0.08] transition-all text-sm outline-none placeholder-slate-500"
          />
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6">
        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-gold mx-auto mb-4"></div>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-black">Curating Bookstore...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-24 glass rounded-3xl p-12 max-w-lg mx-auto border border-white/5">
            <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">No resource found</h3>
            <p className="text-slate-500 text-sm">We couldn't find any books matching "{searchQuery}". Try updating your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book, index) => {
                const isBase64 = book.pdfUrl?.startsWith('data:');
                return (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="glass border border-white/5 rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-brand-gold/30 hover:shadow-[0_22px_40px_rgba(0,0,0,0.8)]"
                  >
                    {/* Cover Wrapper */}
                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-black to-neutral-900 border-b border-white/5 shrink-0 flex items-center justify-center">
                      {book.coverUrl ? (
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="p-6 text-center flex flex-col justify-between h-full w-full py-8 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-purple-500/5" />
                          <div className="text-slate-600 font-mono text-[9px] uppercase tracking-widest relative z-10 font-bold">Nesta Library</div>
                          <div className="relative z-10 px-4">
                            <BookOpen size={32} className="text-brand-gold/40 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="font-heading font-black text-sm tracking-tight text-white line-clamp-2 uppercase">
                              {book.title}
                            </h3>
                          </div>
                          <div className="text-slate-500 font-mono text-[9px] relative z-10 font-medium">By {book.author}</div>
                        </div>
                      )}

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSelectedBook(book)}
                          className="px-4 py-2 bg-white text-brand-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-gold transition-colors flex items-center gap-1.5"
                        >
                          <Info size={14} /> Details
                        </button>
                        <button
                          onClick={() => setReadingBook(book)}
                          className="p-3 bg-brand-gold hover:bg-white text-brand-black rounded-xl transition-colors"
                          title="Read Online"
                        >
                          <BookOpen size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Book Metadata */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1 mb-6">
                        <span className="text-[10px] text-brand-gold font-mono tracking-wider font-semibold block mb-1">
                          By {book.author}
                        </span>
                        <h3 className="font-heading font-bold text-base text-white group-hover:text-brand-gold transition-colors line-clamp-1 mb-2">
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
                          {book.description || "No description supplied."}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <span className="text-[10px] font-mono text-slate-500">
                          {book.downloads || 0} downloads
                        </span>
                        <button
                          onClick={() => handleDownload(book)}
                          className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-white font-bold tracking-wider uppercase transition-colors"
                        >
                          Download <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-lg bg-brand-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest block">Resource details</span>
                  <h3 className="text-xl font-bold text-white line-clamp-1">{selectedBook.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex gap-6">
                  {/* Miniature Cover */}
                  <div className="w-24 h-32 rounded-xl bg-slate-900 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                    {selectedBook.coverUrl ? (
                      <img src={selectedBook.coverUrl} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                      <BookOpen size={24} className="text-brand-gold/30" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-brand-gold font-bold">WRITTEN BY</div>
                    <div className="text-base text-white font-bold flex items-center gap-2">
                      <User size={16} className="text-slate-500" /> {selectedBook.author}
                    </div>
                    
                    <div className="pt-2 text-xs text-slate-500 flex items-center gap-3">
                      <span>Total Downloads: <strong className="text-white">{selectedBook.downloads || 0}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ABOUT THIS BOOK</div>
                  <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line max-h-40 overflow-y-auto custom-scrollbar">
                    {selectedBook.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
                <button
                  onClick={() => {
                    const bookToRead = selectedBook;
                    setSelectedBook(null);
                    setReadingBook(bookToRead);
                  }}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-white/5"
                >
                  <Eye size={16} /> Read Online
                </button>
                <button
                  onClick={() => {
                    handleDownload(selectedBook);
                    setSelectedBook(null);
                  }}
                  className="flex-1 py-3.5 bg-brand-gold text-brand-black rounded-xl font-black text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded PDF Viewer Modal */}
      <AnimatePresence>
        {readingBook && (
          <div className="fixed inset-0 z-[120] flex flex-col bg-brand-black">
            {/* Nav Header of PDF Reader */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="py-4 px-6 md:px-12 bg-black/80 border-b border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm md:text-base leading-none text-white">{readingBook.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Reading mode · By {readingBook.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleDownload(readingBook)}
                  className="px-4 py-2 bg-brand-gold text-brand-black hover:bg-white rounded-lg font-black text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <Download size={12} /> Download PDF
                </button>
                <button 
                  onClick={() => setReadingBook(null)}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>

            {/* Embedded Screen */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 w-full h-full bg-zinc-900 overflow-hidden relative"
            >
              {readingBook.pdfUrl?.startsWith('data:') ? (
                <iframe 
                  src={readingBook.pdfUrl}
                  className="w-full h-full border-0"
                  title={readingBook.title}
                />
              ) : (
                <object 
                  data={readingBook.pdfUrl} 
                  type="application/pdf"
                  className="w-full h-full border-0"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <FileText size={48} className="text-slate-600 mb-4" />
                    <h5 className="font-bold text-lg mb-2">Browser doesn't support embedded viewing</h5>
                    <p className="text-slate-400 text-sm max-w-md mb-6">You can download the book directly or use your local PDF reader application to view it.</p>
                    <a
                      href={readingBook.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs rounded-xl flex items-center gap-2"
                    >
                      Open PDF in a New Tab
                    </a>
                  </div>
                </object>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
