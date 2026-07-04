import { Folder, FileText, Settings, Search, X, Database } from 'lucide-react';

const Sidebar = ({ isOpen, setSidebarOpen }) => {
  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 w-64 h-full bg-gray-900 p-6 border-r border-gray-800 transition-transform`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2"><Database className="text-blue-500" /> Smart Files</h2>
        <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
      </div>
      <nav className="flex flex-col gap-2">
        {['My Files', 'Documents', 'Recent', 'Settings'].map(item => (
          <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
            {item === 'My Files' ? <Folder size={20} /> : <FileText size={20} />} <span>{item}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};
export default Sidebar;