import { motion } from 'framer-motion';
import { FileText, Trash2, Folder, Image as ImageIcon } from 'lucide-react';

const FileCard = ({ file, onDelete }) => {
  const getIcon = (type) => {
    if (type === "folder") return <Folder className="text-yellow-400" />;
    if (type === "image") return <ImageIcon className="text-green-400" />;
    return <FileText className="text-blue-400" />;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-gray-900 border border-gray-800 rounded-2xl flex justify-between items-center hover:border-blue-500 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-800 rounded-xl">{getIcon(file.type)}</div>
        <div>
          <h3 className="font-medium truncate">{file.name}</h3>
          <p className="text-xs text-gray-500">{file.size}</p>
        </div>
      </div>
      <button onClick={() => onDelete(file.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
    </motion.div>
  );
};
export default FileCard;