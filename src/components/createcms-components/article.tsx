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
  const [useCoverLink, setUseCoverLink] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [blockUploading, setBlockUploading] = useState<string | null>(null);

  const STRAPI_URL = "http://localhost:1337";
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2070&auto=format&fit=crop";

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
      setUseCoverLink(false);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleBlockMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBlockUploading(blockId);
    const formData = new FormData();
    formData.append('files', file);
    try {
      const res = await api.post('/upload', formData);
      updateBlock(blockId, `${STRAPI_URL}${res.data[0].url}`);
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
    setBlocks([...blocks, { id: Math.random().toString(36).substr(2, 9), type, value: '' }]);
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
    if (!title) return alert("Title is required.");
    
    // Logic: If no image is provided, we can pass a fallback link 
    const finalImagePreview = imagePreview || FALLBACK_IMAGE;

    onSave({ 
      title, 
      summary, 
      category, 
      isTopPick, 
      imageId: useCoverLink ? null : imageId,
      imageLink: useCoverLink ? finalImagePreview : null, 
      contentBlocks: blocks 
    }, status);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      <div className="flex justify-between items-center py-4 border-b">
        <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-purple-700 text-xs font-bold uppercase">
          <ArrowLeft size={16} /> Exit Editor
        </button>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsTopPick(!isTopPick)} className={`p-2.5 rounded-xl border transition-all ${isTopPick ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white text-gray-300'}`}>
            <Star size={18} fill={isTopPick ? "currentColor" : "none"} />
          </button>
          <button onClick={() => handleSubmit('draft')} disabled={isLoading} className="px-6 py-2.5 bg-white border rounded-xl text-xs font-bold flex items-center gap-2">
            <Save size={16} /> Save Draft
          </button>
          <button onClick={() => handleSubmit('published')} disabled={isLoading} className="px-6 py-2.5 bg-[#5C32A3] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Publish</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article Title" className="w-full text-4xl font-black outline-none mb-4 uppercase tracking-tighter" />
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary..." className="w-full text-lg text-slate-500 outline-none h-20 border-none resize-none" />

            <div className="space-y-6 mt-8">
              {blocks.map((block: any, index: number) => (
                <div key={block.id} className="group relative bg-slate-50/50 p-4 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                  <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 flex flex-col gap-1">
                    <button onClick={() => moveBlock(index, 'up')} className="p-1 text-slate-400 hover:text-purple-600"><MoveUp size={14}/></button>
                    <button onClick={() => removeBlock(block.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>

                  {block.type === 'text' && (
                    <textarea value={block.value} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="Start writing..." className="w-full min-h-[100px] bg-transparent outline-none text-slate-700 leading-relaxed resize-none" />
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-3">
                      {block.value ? (
                        <div className="relative group">
                          <img src={block.value} className="w-full h-48 object-cover rounded-xl" alt="" />
                          <button onClick={() => updateBlock(block.id, "")} className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                            {blockUploading === block.id ? <Loader2 className="animate-spin" /> : <UploadCloud className="text-slate-300 mb-1" />}
                            <span className="text-[9px] font-bold uppercase text-slate-400">Upload</span>
                            <input type="file" className="hidden" onChange={(e) => handleBlockMediaUpload(e, block.id)} />
                          </label>
                          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-white">
                            <LinkIcon size={20} className="text-slate-300 mb-1" />
                            <input type="text" placeholder="Paste Link" className="w-full text-[9px] text-center outline-none" onChange={(e) => updateBlock(block.id, e.target.value)} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === 'video' && (
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border">
                      <PlayCircle className="text-purple-500" />
                      <input value={block.value} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="Paste YouTube Link" className="flex-1 bg-transparent outline-none text-sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-8 mt-12 py-6 border-t">
              <ToolbarButton icon={<Type size={20}/>} label="Text" onClick={() => addBlock('text')} />
              <ToolbarButton icon={<ImageIcon size={20}/>} label="Image" onClick={() => addBlock('image')} />
              <ToolbarButton icon={<PlayCircle size={20}/>} label="Video" onClick={() => addBlock('video')} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black uppercase text-slate-400">Cover Image</label>
              <button onClick={() => setUseCoverLink(!useCoverLink)} className="text-[9px] font-bold text-purple-600 underline uppercase">{useCoverLink ? 'Upload' : 'Use Link'}</button>
            </div>
            {useCoverLink ? (
              <input value={imagePreview} onChange={(e) => setImagePreview(e.target.value)} placeholder="Image URL..." className="w-full p-3 bg-slate-50 rounded-xl text-xs outline-none border" />
            ) : (
              <div className="relative aspect-video bg-slate-50 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden">
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <UploadCloud className="text-slate-300" />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-3">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold uppercase outline-none border">
              {['Policy Update', 'Thought Leadership', 'Announcements', 'SME Support'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, label, onClick }: any) => (
  <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-purple-700 transition-all">
    <div className="p-3 bg-slate-50 rounded-xl border group-hover:border-purple-200">{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);