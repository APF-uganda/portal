import React, { useState, useEffect } from 'react';
import { 
  Save, ArrowLeft, Image as ImageIcon, X, 
  Type, Trash2, MoveUp, UploadCloud, Star, Loader2,
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

  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrCreateCategories = async () => {
      try {
        const res = await api.get('/news-categories?populate=*');
        const existingCategories = res.data.data || [];
        
        if (existingCategories.length === 0) {
          const defaultCategories = [
            { name: 'Policy Update', description: 'Policy updates and regulatory changes' },
            { name: 'Thought Leadership', description: 'Industry insights and thought leadership' },
            { name: 'Announcements', description: 'Official announcements and news' },
            { name: 'SME Support', description: 'Small and Medium Enterprise support' }
          ];
          
          const createdCategories = [];
          for (const cat of defaultCategories) {
            try {
              const createRes = await api.post('/news-categories', {
                data: { ...cat, publishedAt: new Date().toISOString() }
              });
              createdCategories.push(createRes.data.data);
            } catch (err) {
              console.error('Failed to create category:', cat.name, err);
            }
          }
          setAvailableCategories(createdCategories);
        } else {
          setAvailableCategories(existingCategories);
        }
      } catch (err) {
        console.error('Failed to fetch/create categories:', err);
        setAvailableCategories([]);
      }
    };
    fetchOrCreateCategories();
  }, []);

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
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }
    
    const allBlocks = blocks.filter((block: any) => 
      block.value && block.value.toString().trim() !== ""
    );
    
    let categoryId = null;
    if (availableCategories.length > 0) {
      const foundCategory = availableCategories.find(cat => 
        cat.attributes?.name === category || cat.name === category
      );
      categoryId = foundCategory?.id || foundCategory?.attributes?.id;
    }
    
    if (!categoryId) {
      categoryId = CATEGORY_MAP[category] || 1;
    }
  
    onSave({ 
      title: title.trim(), 
      description: summary.trim(),    
      news: categoryId,         
      isFeatured: isTopPick,   
      readTime: Number(readTime), 
      featuredImage: imageId,  
      content: allBlocks, 
      publishDate: new Date().toISOString().split('T')[0] 
    }, status);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-center py-6 border-b border-slate-100 gap-6">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-purple-700 text-[11px] font-black uppercase tracking-[0.2em] transition-all">
          <ArrowLeft size={16} strokeWidth={3} /> Exit Editor
        </button>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsTopPick(!isTopPick)} 
            className={`p-3 rounded-2xl border transition-all ${isTopPick ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-slate-100 text-slate-300 hover:border-slate-200'}`}
          >
            <Star size={20} fill={isTopPick ? "currentColor" : "none"} />
          </button>
          
          <button onClick={() => handleSubmit('draft')} disabled={isLoading} className="flex-1 md:flex-none px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
            Save Draft
          </button>
          
          <button onClick={() => handleSubmit('published')} disabled={isLoading} className="flex-1 md:flex-none px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} strokeWidth={2.5} /> Publish</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Editor Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-slate-50">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="ARTICLE TITLE" 
              className="w-full text-3xl md:text-5xl font-black outline-none mb-6 uppercase tracking-tight placeholder:text-slate-100" 
            />
            <textarea 
              value={summary} 
              onChange={(e) => setSummary(e.target.value)} 
              placeholder="Write a short summary for the news card..." 
              className="w-full text-lg md:text-xl text-slate-500 outline-none h-24 border-none resize-none font-medium placeholder:text-slate-200 leading-relaxed" 
            />

            <div className="space-y-8 mt-12">
              {blocks.map((block: any, index: number) => (
                <div key={block.id} className="group relative bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all">
                  <div className="md:absolute md:-left-14 md:top-6 flex md:flex-col gap-2 mb-4 md:mb-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                    <button onClick={() => moveBlock(index, 'up')} className="p-2 bg-white shadow-sm rounded-xl text-slate-400 hover:text-purple-600 border border-slate-100"><MoveUp size={16}/></button>
                    <button onClick={() => removeBlock(block.id)} className="p-2 bg-white shadow-sm rounded-xl text-slate-400 hover:text-red-500 border border-slate-100"><Trash2 size={16}/></button>
                  </div>

                  {block.type === 'text' && (
                    <textarea 
                      value={block.value} 
                      onChange={(e) => updateBlock(block.id, e.target.value)} 
                      placeholder="Start typing your story..." 
                      className="w-full min-h-[150px] bg-transparent outline-none text-slate-700 leading-relaxed resize-none text-base md:text-lg" 
                    />
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-3">
                      {block.value ? (
                        <div className="relative group overflow-hidden rounded-[2rem]">
                          <img src={block.value} className="w-full h-auto max-h-[400px] object-cover" alt="" />
                          <button onClick={() => updateBlock(block.id, "")} className="absolute top-4 right-4 p-3 bg-white rounded-full text-red-500 shadow-md"><X size={18}/></button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-12 md:p-20 border-2 border-dashed rounded-[2rem] bg-white cursor-pointer hover:bg-slate-50 hover:border-purple-200 transition-all">
                          {blockUploading === block.id ? <Loader2 className="animate-spin text-purple-600" /> : <UploadCloud className="text-slate-300 mb-4" size={40} />}
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Upload Body Image</span>
                          <input type="file" className="hidden" onChange={(e) => handleBlockMediaUpload(e, block.id)} />
                        </label>
                      )}
                    </div>
                  )}

                  {block.type === 'video' && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-6 rounded-[1.5rem] border border-slate-100">
                      <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                        <PlayCircle size={28} />
                      </div>
                      <input 
                        value={block.value} 
                        onChange={(e) => updateBlock(block.id, e.target.value)} 
                        placeholder="PASTE VIDEO URL (YOUTUBE/VIMEO)" 
                        className="w-full bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-slate-600" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Content Toolbar */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-16 py-10 border-t border-slate-50">
              <ToolbarButton icon={<Type size={22}/>} label="Text" onClick={() => addBlock('text')} />
              <ToolbarButton icon={<ImageIcon size={22}/>} label="Image" onClick={() => addBlock('image')} />
              <ToolbarButton icon={<PlayCircle size={22}/>} label="Video" onClick={() => addBlock('video')} />
            </div>
          </div>
        </div>

        {/* Sidebar Settings Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-6">Featured Cover</label>
            <div className="relative aspect-[4/3] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center overflow-hidden group hover:border-purple-200 transition-all cursor-pointer">
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <UploadCloud className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <div className="text-center px-4">
                  <UploadCloud className="text-slate-200 mb-3 mx-auto" size={32} />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">Click to upload<br/>400x300 recommended</span>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" /></div>}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4 flex items-center gap-2">
              <Clock size={14} /> Read Time
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={readTime} 
                onChange={(e) => setReadTime(e.target.value)} 
                className="w-full p-5 bg-slate-50 rounded-2xl text-[11px] font-black outline-none border border-slate-100" 
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Minutes</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full p-5 bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] outline-none border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              {availableCategories.length > 0 
                ? availableCategories.map(cat => {
                    const name = cat.attributes?.name || cat.name;
                    return <option key={cat.id} value={name}>{name}</option>;
                  })
                : Object.keys(CATEGORY_MAP).map(c => <option key={c} value={c}>{c}</option>)
              }
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
    className="flex flex-col items-center gap-4 group"
  >
    <div className="p-6 md:p-8 bg-white rounded-[1.8rem] border border-slate-100 shadow-sm group-hover:border-purple-200 group-hover:text-purple-700 group-hover:-translate-y-1.5 transition-all duration-300 text-slate-400">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300 group-hover:text-slate-900 transition-colors">{label}</span>
  </button>
);