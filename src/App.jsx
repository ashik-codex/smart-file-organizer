import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FileText,
  Plus,
  Menu,
  X,
  Trash2,
  Database,
  Image as ImageIcon,
  Search,
} from "lucide-react";

function safeParseLocalStorage(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    // corrupted JSON or access denied, return fallback
    return fallback;
  }
}

function safeWriteLocalStorage(key, value) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore write errors in restricted environments
  }
}

const DEFAULT_FILES = [
  { id: 1, name: "Project_Draft.pdf", size: "2.4 MB", type: "file" },
];

function App() {
  const [files, setFiles] = useState(() =>
    safeParseLocalStorage("smartFiles", DEFAULT_FILES)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  // persist files safely
  useEffect(() => {
    safeWriteLocalStorage("smartFiles", files);
  }, [files]);

  const handleFileUpload = (e) => {
    const filesList = e?.target?.files;
    if (!filesList || filesList.length === 0) return;

    const file = filesList[0];
    const newFile = {
      id: Date.now(),
      name: file.name,
      size: file.size
        ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
        : "—",
      type: file.type?.includes("image") ? "image" : "file",
    };

    // use functional update to avoid stale closures
    setFiles((prev) => [newFile, ...prev]);
    // clear input so same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    const q = searchQuery.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, searchQuery]);

  const getIcon = (type) => {
    if (type === "folder") return <Folder className="text-yellow-400" />;
    if (type === "image") return <ImageIcon className="text-green-400" />;
    return <FileText className="text-blue-400" />;
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] text-white font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:relative z-50 w-64 h-full bg-[#111827] border-r border-gray-800 p-6 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Database className="text-blue-500" />
            SmartFile Pro
          </div>

          <button
            className="md:hidden"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {["My Files", "Documents", "Recent", "Settings"].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-all text-gray-400 hover:text-white"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  /* placeholder for nav action */
                }
              }}
              onClick={() => {
                /* placeholder for nav action */
                setSidebarOpen(false);
              }}
            >
              {item === "My Files" ? <Folder size={18} /> : <FileText size={18} />}
              <span>{item}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* TOP BAR */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-6 border-b border-gray-800 flex flex-col md:flex-row gap-4 md:items-center md:justify-between"
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </button>

            <div>
              <h1 className="text-2xl font-bold">SmartFile Pro</h1>
              <p className="text-gray-400 text-sm">{files.length} items</p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="flex items-center bg-[#111827] border border-gray-800 rounded-xl px-4 py-2 w-full md:w-1/2">
            <Search size={18} className="text-gray-500" />
            <input
              aria-label="Search files"
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full ml-2 outline-none text-sm"
            />
          </div>

          {/* UPLOAD */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl flex items-center gap-2 transition-all"
            >
              <Plus size={18} /> Upload
            </button>

            <input
              aria-hidden="true"
              className="hidden"
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        </motion.header>

        {/* STORAGE */}
        <div className="p-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Storage Usage</span>
              <span>{Math.min(files.length * 10, 100)}%</span>
            </div>

            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{ width: `${Math.min(files.length * 10, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* FILE GRID */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.18 }}
                className="group bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:border-blue-500 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-4 min-w-0">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-3 bg-gray-900 rounded-xl">{getIcon(file.type)}</div>

                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-sm" title={file.name}>
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteFile(file.id)}
                    aria-label={`Delete ${file.name}`}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* empty state */}
          {filteredFiles.length === 0 && (
            <div className="col-span-full text-center text-gray-400 mt-6">
              No files found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
