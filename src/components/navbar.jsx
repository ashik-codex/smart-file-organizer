import { Plus, Menu } from 'lucide-react'; // 'Menu' കൂടെ ഇംപോർട്ട് ചെയ്യുക

const Navbar = ({ setSidebarOpen, onUpload, totalFiles }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        {/* മൊബൈലിൽ മെനു തുറക്കാൻ ഈ ബട്ടൺ */}
        <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu />
        </button>
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-400">{totalFiles} total items</p>
        </div>
      </div>
      
      <button 
        onClick={onUpload} 
        className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all"
      >
        <Plus size={20} /> Upload
      </button>
    </header>
  );
};

export default Navbar;