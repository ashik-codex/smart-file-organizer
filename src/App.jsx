import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, Settings, Search, Plus, HardDrive, Menu, X, Trash2, Database, File, Image as ImageIcon } from 'lucide-react';

function App() {
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('smartFiles');
    return saved ? JSON.parse(saved) : [{ id: 1, name: "Project_Draft.pdf", size: "2.4 MB", type: "file" }];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('smartFiles', JSON.stringify(files));
  }, [files]);

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile = { 
        id: Date.now(), 
        name: file.name, 
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type.includes("image") ? "image" : "file" 
      };
      setFiles([...files, newFile]);
    }
  };

  const deleteFile = (id) => setFiles(files.filter(file => file.id !== id));
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getIcon = (type) => {
    if (type === "folder") return <Folder className="text-yellow-400" />;
    if (type === "image") return <ImageIcon className="text-green-400" />;
    return <FileText className="text-blue-400" />;
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans overflow-hidden">
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 w-64 h-full bg-gray-900 p-6 border-r border-gray-800 transition-transform`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2"><Database className="text-blue-500" /> Smart Files</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        <nav className="flex flex-col gap-2">
          {['My Files', 'Documents', 'Recent', 'Settings'].map(item => (
            <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-800 text-gray-400 hover:text-white">
              {item === 'My Files' ? <Folder size={20} /> : <FileText size={20} />} <span>{item}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu /></button>
              <div>
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <p className="text-gray-400">{files.length} total items</p>
              </div>
            </div>
            <button onClick={() => fileInputRef.current.click()} className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all">
              <Plus size={20} /> Upload
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          </div>
          <input type="text" placeholder="Search files..." className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 px-6 focus:outline-none focus:border-blue-500" onChange={(e) => setSearchQuery(e.target.value)} />
        </header>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8">
          <div className="flex justify-between mb-3 text-sm text-gray-400"><span>Storage Usage</span><span>{Math.min(files.length * 10, 100)}%</span></div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(files.length * 10, 100)}%` }}></div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredFiles.map(file => (
              <motion.div key={file.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 bg-gray-900 border border-gray-800 rounded-2xl flex justify-between items-center hover:border-blue-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-800 rounded-xl">{getIcon(file.type)}</div>
                  <div>
                    <h3 className="font-medium truncate">{file.name}</h3>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </div>
                <button onClick={() => deleteFile(file.id)} className="text-gray-600 hover:text-red-500"><Trash2 size={18} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;