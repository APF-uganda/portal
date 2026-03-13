import React, { useState } from 'react';
import { 
  Save, ArrowLeft, Image as ImageIcon, X, 
  Type, Trash2, MoveUp, UploadCloud, Star, Loader2, Link as LinkIcon,
  Send, PlayCircle, Clock
} from 'lucide-react';
import api from '../../services/cmsApi';
import { CMS_BASE_URL } from '../../config/api';

export const ArticleForm = ({ initialData, onSave, onCancel, isLoading }: any) => {
  
  const CATEGORY_MAP: Record<string, number> = {
    'Policy Update': 1,
    'Thought Leadership': 2,
    'Announcements': 3,
    'SME Support': 4
  };

  const getInitialCategory = () => {
  
    if (initialData?.news?.name) return initialData.news.name;
    if (initialData?.news_categories?.[0]?.name) return initialData.news_categories[0].name;
    return initialData?.displayCategory || 'Policy Update';
  };

  const [title, setTitle] = useState(initialData?.title || "");
  const [summary, setSummary] = useState(initialData?.description || initialData?.summary || "");
  const [category, setCategory] = useState(getInitialCategory());
  const [isTopPick, setIsTopPick] = useState(initialData?.isFeatured || initialData?.isTopic || false);
  const [blocks, setBlocks] = useState(initialData?.contentBlocks || [{ id: '1', type: 'text', value: '' }]);
  
  const [readTime, setReadTime] = useState(initialData?.readTime || 5);
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || "");
  const [imageId, setImageId] = useState<number | null>(initialData?.imageId || null);
  const [useCoverLink, setUseCoverLink] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [blockUploading, setBlockUploading] = useState<string | null>(null);

  const STRAPI_URL = CMS_BASE_URL;

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
      alert("Upload failed. Check file size and permissions.");
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
    if (!imageId && !useCoverLink) return alert("Featured Image is required for the News Card.");
    
    const categoryId = CATEGORY_MAP[category] || 1;

    
    onSave({ 
      title, 
      description: summary,    
      news: categoryId,         
      isFeatured: isTopPick,   
      readTime: Number(readTime), 
      featuredImage: imageId,  
      contentBlocks: blocks,   
      publishDate: new Date().toISOString().split('T')[0] 
    }, status);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center py-4 border-b border-slate-200">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-purple-700 text-[10px] font-black uppercase tracking-widest transition-colors">
          <ArrowLeft size={16} strokeWidth={3} /> Exit Editor
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsTopPick(!isTopPick)} 
            className={`p-2.5 rounded-xl border transition-all ${isTopPick ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-slate-100 text-slate-300 hover:border-slate-200'}`}
            title="Mark as Top Pick"
          >
            <Star size={18} fill={isTopPick ? "currentColor" : "none"} />
          </button>
          
          <button onClick={() => handleSubmit('draft')} disabled={isLoading} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
            Save Draft
          </button>
          
          <button onClick={() => handleSubmit('published')} disabled={isLoading} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} strokeWidth={2.5} /> Publish</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="ARTICLE TITLE" 
              className="w-full text-4xl font-black outline-none mb-6 uppercase tracking-tighter placeholder:text-slate-100" 
            />
            <textarea 
              value={summary} 
              onChange={(e) => setSummary(e.target.value)} 
              placeholder="Write a short summary for the news card..." 
              className="w-full text-lg text-slate-500 outline-none h-24 border-none resize-none placeholder:text-slate-200 leading-relaxed" 
            />

            <div className="space-y-6 mt-10">
              {blocks.map((block: any, index: number) => (
                <div key={block.id} className="group relative bg-slate-50/50 p-6 rounded-[1.5rem] border border-transparent hover:border-slate-200 transition-all">
                  <div className="absolute -left-12 top-4 opacity-0 group-hover:opacity-100 flex flex-col gap-2 transition-opacity">
                    <button onClick={() => moveBlock(index, 'up')} className="p-1.5 bg-white shadow-sm rounded-lg text-slate-400 hover:text-purple-600 border border-slate-100"><MoveUp size={14}/></button>
                    <button onClick={() => removeBlock(block.id)} className="p-1.5 bg-white shadow-sm rounded-lg text-slate-400 hover:text-red-500 border border-slate-100"><Trash2 size={14}/></button>
                  </div>

                  {block.type === 'text' && (
                    <textarea 
                      value={block.value} 
                      onChange={(e) => updateBlock(block.id, e.target.value)} 
                      placeholder="Start typing your story..." 
                      className="w-full min-h-[120px] bg-transparent outline-none text-slate-700 leading-relaxed resize-none text-base" 
                    />
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-3">
                      {block.value ? (
                        <div className="relative group overflow-hidden rounded-2xl">
                          <img src={block.value} className="w-full h-64 object-cover" alt="" />
                          <button onClick={() => updateBlock(block.id, "")} className="absolute top-4 right-4 p-2 bg-white rounded-full text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl bg-white cursor-pointer hover:bg-slate-50 hover:border-purple-200 transition-all">
                            {blockUploading === block.id ? <Loader2 className="animate-spin text-purple-600" /> : <UploadCloud className="text-slate-300 mb-2" size={32} />}
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Media</span>
                            <input type="file" className="hidden" onChange={(e) => handleBlockMediaUpload(e, block.id)} />
                          </label>
                          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl bg-white border-slate-100">
                            <LinkIcon size={32} className="text-slate-200 mb-2" />
                            <input 
                              type="text" 
                              placeholder="PASTE IMAGE URL" 
                              className="w-full text-[10px] font-bold text-center outline-none uppercase tracking-widest" 
                              onChange={(e) => updateBlock(block.id, e.target.value)} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === 'video' && (
                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                      <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                        <PlayCircle size={24} />
                      </div>
                      <input 
                        value={block.value} 
                        onChange={(e) => updateBlock(block.id, e.target.value)} 
                        placeholder="PASTE YOUTUBE OR VIMEO URL" 
                        className="flex-1 bg-transparent outline-none text-xs font-bold uppercase tracking-widest text-slate-600" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-10 mt-12 py-8 border-t border-slate-50">
              <ToolbarButton icon={<Type size={20}/>} label="Add Text" onClick={() => addBlock('text')} />
              <ToolbarButton icon={<ImageIcon size={20}/>} label="Add Image" onClick={() => addBlock('image')} />
              <ToolbarButton icon={<PlayCircle size={20}/>} label="Add Video" onClick={() => addBlock('video')} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card Cover</label>
              <button onClick={() => setUseCoverLink(!useCoverLink)} className="text-[9px] font-black text-purple-600 underline uppercase tracking-widest">
                {useCoverLink ? 'Upload' : 'Use Link'}
              </button>
            </div>
            {useCoverLink ? (
              <input 
                value={imagePreview} 
                onChange={(e) => setImagePreview(e.target.value)} 
                placeholder="https://..." 
                className="w-full p-4 bg-slate-50 rounded-2xl text-[10px] font-bold outline-none border border-slate-100" 
              />
            ) : (
              <div className="relative aspect-[4/3] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center overflow-hidden group hover:border-purple-200 transition-all">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <UploadCloud className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud className="text-slate-200 mb-2" size={24} />
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Upload 400x300</span>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" /></div>}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 flex items-center gap-2">
              <Clock size={12} /> Read Time
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={readTime} 
                onChange={(e) => setReadTime(e.target.value)} 
                className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-black outline-none border border-slate-100" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">Min</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full p-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              {Object.keys(CATEGORY_MAP).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, label, onClick }: any) => (
  <button 
    type="button" 
    onClick={onClick} 
    className="flex flex-col items-center gap-3 group"
  >
    <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:border-purple-200 group-hover:text-purple-700 group-hover:-translate-y-1 transition-all duration-300 text-slate-400">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-slate-900 transition-colors">{label}</span>
  </button>
);