import React, { useState } from 'react';
import { 
  Save, ArrowLeft, Image as ImageIcon, X, 
  Type, Video, Paperclip, Trash2, 
  MoveUp, MoveDown, UploadCloud, Star, Loader2, Link as LinkIcon 
} from 'lucide-react';
import api from '../../services/cmsApi';

export const ArticleForm = ({ initialData, onSave, onCancel, isLoading }: any) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [category, setCategory] = useState(initialData?.category || 'Policy Update');
  const [isTopPick, setIsTopPick] = useState(initialData?.isTopPick || false);
  const [blocks, setBlocks] = useState(initialData?.contentBlocks || [{ id: '1', type: 'text', value: '' }]);
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || "");
  const [imageId, setImageId] = useState<number | null>(initialData?.imageId || null);
  const [uploading, setUploading] = useState(false);

  // --- LOGIC FOR BLOCK IMAGE UPLOAD ---
  const handleBlockImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);
    try {
      const res = await api.post('/upload', formData);
      const url = `http://localhost:1337${res.data[0].url}`;
      updateBlock(blockId, url);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);
    try {
      const res = await api.post('/upload', formData);
      const uploadedFile = res.data[0];
      setImageId(uploadedFile.id);
      setImagePreview(`http://localhost:1337${uploadedFile.url}`);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const addBlock = (type: string) => {
    const newBlock = { id: Math.random().toString(36).substr(2, 9), type, value: '' };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, value: string) => {
    setBlocks(blocks.map((b: any) => b.id === id ? { ...b, value } : b));
  };

  const removeBlock = (id: string) => setBlocks(blocks.filter((b: any) => b.id !== id));

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target >= 0 && target < newBlocks.length) {
      [newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const handleFinalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Title is required");
    onSave({ title, summary, category, isTopPick, imageId, contentBlocks: blocks });
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      {/* Action Header */}
      <div className="flex justify-between items-center py-4 border-b border-gray-100">
        <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-[#5C32A3] transition-colors text-xs font-bold">
          <ArrowLeft size={16} /> Exit Editor
        </button>
        
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={() => setIsTopPick(!isTopPick)}
            className={`p-2.5 rounded-xl border transition-all ${isTopPick ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-gray-200 text-gray-300'}`}
          >
            <Star size={18} fill={isTopPick ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleFinalSave} 
            disabled={isLoading || uploading}
            className="px-6 py-2.5 bg-[#5C32A3] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#4A2882] transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Article</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-10">
          <div className="bg-white">
            {/* Title & Summary Area  */}
            <div className="space-y-4 mb-10 px-4">
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title..." 
                className="w-full text-3xl font-bold outline-none border-none placeholder:text-gray-200 text-gray-900 py-2" 
              />
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Add a brief summary..."
                className="w-full text-base font-medium text-gray-500 outline-none resize-none h-16 leading-relaxed border-none py-1"
              />
            </div>

            {/* Content Blocks */}
            <div className="space-y-6">
              {blocks.map((block: any, index: number) => (
                <div key={block.id} className="group relative transition-all px-4">
                  {/* Floating Controls */}
                  <div className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity">
                    <button onClick={() => moveBlock(index, 'up')} className="p-1.5 text-gray-300 hover:text-gray-600"><MoveUp size={14}/></button>
                    <button onClick={() => removeBlock(block.id)} className="p-1.5 text-gray-300 hover:text-red-400"><Trash2 size={14}/></button>
                  </div>

                  {block.type === 'text' && (
                    <textarea 
                      placeholder="Start typing..."
                      className="w-full min-h-[120px] outline-none text-gray-700 leading-relaxed placeholder:text-gray-200 border-none resize-none px-2 py-2 bg-gray-50/30 rounded-lg focus:bg-white transition-colors"
                      value={block.value}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                    />
                  )}

                  {block.type === 'image' && (
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 border-dashed flex flex-col items-center justify-center min-h-[250px]">
                      {block.value ? (
                        <div className="relative group/img w-full">
                          <img src={block.value} className="rounded-xl max-h-80 w-full object-cover mb-4 mx-auto shadow-sm" />
                          <button onClick={() => updateBlock(block.id, "")} className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <X size={16}/>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex gap-4">
                             {/* Upload Option */}
                            <label className="flex flex-col items-center justify-center w-24 h-24 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-purple-300 transition-colors">
                              <UploadCloud className="text-gray-300" size={24} />
                              <span className="text-[9px] font-bold text-gray-400 uppercase mt-2">Upload</span>
                              <input type="file" className="hidden" onChange={(e) => handleBlockImageUpload(e, block.id)} />
                            </label>
                            <div className="flex items-center text-gray-200 text-xs font-bold">OR</div>
                            {/* Icon Placeholder */}
                            <div className="flex flex-col items-center justify-center w-24 h-24 bg-white border border-gray-200 rounded-xl">
                              <LinkIcon className="text-gray-300" size={24} />
                              <span className="text-[9px] font-bold text-gray-400 uppercase mt-2">Paste Link</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <input 
                        placeholder="Paste image URL here..." 
                        value={block.value}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        className="text-[10px] w-full max-w-sm p-3 bg-white rounded-xl border border-gray-100 outline-none text-center mt-4 shadow-sm focus:border-purple-200 transition-colors" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Simple Toolbar */}
            <div className="mt-12 flex items-center justify-center gap-8 py-6 border-t border-gray-50">
              <ToolbarButton icon={<Type size={20}/>} label="Text" onClick={() => addBlock('text')} />
              <ToolbarButton icon={<ImageIcon size={20}/>} label="Image" onClick={() => addBlock('image')} />
              <ToolbarButton icon={<Video size={20}/>} label="Video" onClick={() => addBlock('video')} />
              <ToolbarButton icon={<Paperclip size={20}/>} label="File" onClick={() => addBlock('attachment')} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Cover Image</label>
            <div className="relative aspect-square bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center overflow-hidden group hover:border-[#5C32A3] transition-colors cursor-pointer">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  {uploading ? <Loader2 className="animate-spin text-purple-600 mx-auto" size={24} /> : <><UploadCloud className="mx-auto text-gray-300 mb-2" size={24} /><span className="text-[9px] font-bold text-gray-400 uppercase">Upload</span></>}
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#5C32A3] appearance-none"
            >
              {['Policy Update', 'Thought Leadership', 'Announcements'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, label, onClick }: any) => (
  <button type="button" onClick={onClick} className="flex flex-col items-center gap-2 text-gray-400 hover:text-[#5C32A3] transition-all group">
    <div className="p-3 bg-white rounded-full group-hover:bg-purple-50 transition-colors border border-gray-100 shadow-sm">
      {icon}
    </div>
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);