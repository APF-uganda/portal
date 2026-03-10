import React, { useState } from 'react';
import { 
  Save, ArrowLeft, Image as ImageIcon, X, 
  Type, Video, Paperclip, Trash2, 
  MoveUp, MoveDown, UploadCloud, Star, Loader2, Link as LinkIcon,
  Send, FileText, PlayCircle
} from 'lucide-react';
import api from '../../services/cmsApi';

export const ArticleForm = ({ initialData, onSave, onCancel, isLoading }: any) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [category, setCategory] = useState(initialData?.displayCategory || 'Policy Update');
  const [isTopPick, setIsTopPick] = useState(initialData?.isTopic || false);
  const [blocks, setBlocks] = useState(initialData?.contentBlocks || [{ id: '1', type: 'text', value: '' }]);
  
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || "");
  const [imageId, setImageId] = useState<number | null>(initialData?.imageId || null);
  const [uploading, setUploading] = useState(false);
  const [blockUploading, setBlockUploading] = useState<string | null>(null);

  const STRAPI_URL = "http://localhost:1337";

  // --- Main Cover Image Upload ---
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
      setImagePreview(`${STRAPI_URL}${uploadedFile.url}`);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // --- In-Block Media Upload (Images/Files) ---
  const handleBlockMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setBlockUploading(blockId);
    const formData = new FormData();
    formData.append('files', file);
    
    try {
      const res = await api.post('/upload', formData);
      const fileUrl = `${STRAPI_URL}${res.data[0].url}`;
      updateBlock(blockId, fileUrl);
    } catch (err) {
      alert("Media upload failed.");
    } finally {
      setBlockUploading(null);
    }
  };

  const updateBlock = (id: string, value: string) => {
    setBlocks(blocks.map((b: any) => b.id === id ? { ...b, value } : b));
  };

  const addBlock = (type: string) => {
    const newBlock = { id: Math.random().toString(36).substr(2, 9), type, value: '' };
    setBlocks([...blocks, newBlock]);
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

  const handleSubmit = (status: 'draft' | 'published') => {
    if (!title) return alert("Title is required before saving.");
    onSave({ 
      title, 
      summary, 
      category, 
      isTopPick, 
      imageId, 
      contentBlocks: blocks 
    }, status);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      {/* Action Header */}
      <div className="flex justify-between items-center py-4 border-b border-gray-100">
        <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-[#5C32A3] transition-colors text-xs font-bold">
          <ArrowLeft size={16} /> Exit Editor
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => setIsTopPick(!isTopPick)}
            className={`p-2.5 rounded-xl border transition-all ${isTopPick ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-gray-200 text-gray-300'}`}
          >
            <Star size={18} fill={isTopPick ? "currentColor" : "none"} />
          </button>

          <button 
            onClick={() => handleSubmit('draft')} 
            disabled={isLoading || uploading}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Save size={16} /> Save as Draft
          </button>

          <button 
            onClick={() => handleSubmit('published')} 
            disabled={isLoading || uploading}
            className="px-6 py-2.5 bg-[#5C32A3] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#4A2882] transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Publish Now</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
            {/* Title & Summary */}
            <div className="space-y-4 mb-10">
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Article Title..." 
                className="w-full text-4xl font-black outline-none border-none placeholder:text-gray-200 text-slate-900 py-2 uppercase tracking-tighter" 
              />
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Add a brief summary..."
                className="w-full text-lg font-medium text-slate-500 outline-none resize-none h-20 leading-relaxed border-none py-1"
              />
            </div>

            {/* Content Blocks */}
            <div className="space-y-8">
              {blocks.map((block: any, index: number) => (
                <div key={block.id} className="group relative transition-all">
                  {/* Block Controls */}
                  <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                    <button onClick={() => moveBlock(index, 'up')} className="p-1.5 text-slate-400 hover:text-purple-600"><MoveUp size={14}/></button>
                    <button onClick={() => moveBlock(index, 'down')} className="p-1.5 text-slate-400 hover:text-purple-600"><MoveDown size={14}/></button>
                    <button onClick={() => removeBlock(block.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>

                  {/* Text Block */}
                  {block.type === 'text' && (
                    <textarea 
                      placeholder="Write your paragraph here..."
                      className="w-full min-h-[120px] outline-none text-slate-700 leading-relaxed placeholder:text-slate-200 border-none resize-none px-4 py-4 bg-slate-50/50 rounded-2xl focus:bg-white transition-all"
                      value={block.value}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                    />
                  )}

                  {/* Image Block */}
                  {block.type === 'image' && (
                    <div className="relative group/media bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 min-h-[200px] flex flex-col items-center justify-center overflow-hidden">
                      {block.value ? (
                        <div className="relative w-full">
                          <img src={block.value} alt="Content" className="w-full h-auto rounded-xl object-cover" />
                          <button onClick={() => updateBlock(block.id, "")} className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-red-500 shadow-md">
                            <X size={16}/>
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2 p-8">
                          {blockUploading === block.id ? <Loader2 className="animate-spin text-purple-600" /> : <UploadCloud className="text-slate-300" size={32} />}
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBlockMediaUpload(e, block.id)} />
                        </label>
                      )}
                    </div>
                  )}

                  {/* Video Block */}
                  {block.type === 'video' && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center gap-3 text-purple-600">
                        <PlayCircle size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Video Link (YouTube/Vimeo)</span>
                      </div>
                      <input 
                        type="url"
                        placeholder="Paste video URL here..."
                        className="w-full p-4 bg-white rounded-xl border border-slate-100 outline-none text-sm text-slate-600 focus:ring-2 focus:ring-purple-100 transition-all"
                        value={block.value}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                      />
                    </div>
                  )}

                  {/* Attachment/File Block */}
                  {block.type === 'attachment' && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400">
                           <FileText size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Document</span>
                          <span className="text-xs text-slate-600 truncate max-w-[200px]">{block.value ? block.value.split('/').pop() : 'No file selected'}</span>
                        </div>
                      </div>
                      <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                        {blockUploading === block.id ? "Uploading..." : "Select File"}
                        <input type="file" className="hidden" onChange={(e) => handleBlockMediaUpload(e, block.id)} />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="mt-12 flex items-center justify-center gap-8 py-8 border-t border-slate-50">
              <ToolbarButton icon={<Type size={20}/>} label="Text" onClick={() => addBlock('text')} />
              <ToolbarButton icon={<ImageIcon size={20}/>} label="Image" onClick={() => addBlock('image')} />
              <ToolbarButton icon={<PlayCircle size={20}/>} label="Video" onClick={() => addBlock('video')} />
              <ToolbarButton icon={<Paperclip size={20}/>} label="File" onClick={() => addBlock('attachment')} />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Cover Image</label>
            <div className="relative aspect-[4/3] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group hover:border-[#5C32A3] transition-all cursor-pointer">
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <UploadCloud className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  {uploading ? <Loader2 className="animate-spin text-purple-600 mx-auto" size={24} /> : <> <UploadCloud className="mx-auto text-slate-300 mb-2" size={32} /> <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Cover</span> </>}
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-700 uppercase tracking-wider outline-none focus:ring-2 focus:ring-purple-100 appearance-none"
            >
              {['Policy Update', 'Thought Leadership', 'Announcements', 'SME Support'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, label, onClick }: any) => (
  <button type="button" onClick={onClick} className="flex flex-col items-center gap-2 text-slate-400 hover:text-purple-700 transition-all group">
    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-purple-50 transition-colors border border-transparent group-hover:border-purple-100">
      {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-[0.15em]">{label}</span>
  </button>
);