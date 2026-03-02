import React, { useState } from 'react';
import { 
  Save, ArrowLeft, Image as ImageIcon, X, 
  Type, Video, Paperclip, Trash2, 
  MoveUp, MoveDown, UploadCloud, Star, Loader2 
} from 'lucide-react';
import api from '../../services/cmsApi';
import {  ContentBlock, BlockType, Category } from './newstypes';

interface ArticleFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ArticleForm = ({ initialData, onSave, onCancel, isLoading }: ArticleFormProps) => {
  // Form States
  const [title, setTitle] = useState(initialData?.title || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [category, setCategory] = useState<Category>(initialData?.category || 'Policy Update');
  const [isTopPick, setIsTopPick] = useState(initialData?.isTopPick || false);
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialData?.contentBlocks || [{ id: '1', type: 'text', value: '' }]);
  
  // Image States
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || "");
  const [imageId, setImageId] = useState<number | null>(initialData?.imageId || null);
  const [uploading, setUploading] = useState(false);

  //  Image Upload Logic 
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
      alert("Upload failed. Ensure Strapi is running on port 1337.");
    } finally {
      setUploading(false);
    }
  };

 
  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      value: '',
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, value: string, fileName?: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, value, fileName } : b));
  };

  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));

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
    
    onSave({
      title,
      summary,
      category,
      isTopPick,
      imageId,
      contentBlocks: blocks,
      status: initialData?.status || 'Published'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <button onClick={onCancel} className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[10px] uppercase tracking-[0.2em]">Exit Editor</span>
        </button>
        
        <div className="flex gap-4">
            <button 
                type="button"
                onClick={() => setIsTopPick(!isTopPick)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${isTopPick ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
            >
                <Star size={18} fill={isTopPick ? "currentColor" : "none"} />
                <span className="font-black text-[10px] uppercase tracking-widest">Mark as Top Pick</span>
            </button>
            <button 
                onClick={handleFinalSave} 
                disabled={isLoading || uploading}
                className="px-10 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-purple-700 transition-all flex items-center gap-3 disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Sync to Portal</>}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-50 p-12 space-y-10">
                {/* Title Area */}
                <section className="space-y-6">
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="ARTICLE HEADLINE..." 
                        className="w-full text-5xl font-black outline-none border-none placeholder:text-slate-100 text-slate-900 tracking-tighter" 
                    />
                    <textarea 
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Brief summary or deck for the article..."
                        className="w-full text-xl font-bold text-slate-400 outline-none resize-none h-24 italic leading-relaxed"
                    />
                    <div className="h-[1px] w-full bg-slate-50" />
                </section>

                {/* Dynamic Content Blocks */}
                <div className="space-y-12">
                {blocks.map((block, index) => (
                    <div key={block.id} className="group relative pl-10 border-l-4 border-transparent hover:border-purple-100 transition-all">
                        {/* Control Gutter */}
                        <div className="absolute -left-6 top-0 hidden group-hover:flex flex-col gap-2 bg-white border border-slate-100 rounded-xl shadow-2xl p-1.5 z-10">
                            <button onClick={() => moveBlock(index, 'up')} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg"><MoveUp size={16}/></button>
                            <button onClick={() => moveBlock(index, 'down')} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg"><MoveDown size={16}/></button>
                            <button onClick={() => removeBlock(block.id)} className="p-2 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={16}/></button>
                        </div>

                        {block.type === 'text' && (
                            <textarea 
                                placeholder="Start writing..."
                                className="w-full min-h-[120px] outline-none text-lg text-slate-700 font-medium resize-none leading-relaxed placeholder:text-slate-200"
                                value={block.value}
                                onChange={(e) => updateBlock(block.id, e.target.value)}
                            />
                        )}

                        {block.type === 'image' && (
                            <div className="space-y-4">
                                <div className="h-96 bg-slate-50 rounded-[2rem] flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner group/img relative">
                                    {block.value ? <img src={block.value} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="text-slate-200" size={64} />}
                                </div>
                                <input 
                                    placeholder="PASTE EXTERNAL IMAGE URL..." 
                                    value={block.value}
                                    className="text-[10px] font-black uppercase tracking-widest w-full p-4 bg-slate-50 rounded-xl border-none outline-none text-purple-600" 
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                />
                            </div>
                        )}
                       
                    </div>
                ))}
                </div>

                {/* Block Adder Toolbar */}
                <div className="mt-20 p-8 bg-slate-900 rounded-[2.5rem] flex items-center justify-center gap-12 shadow-2xl">
                    <ToolbarButton icon={<Type size={22}/>} label="Text" onClick={() => addBlock('text')} />
                    <ToolbarButton icon={<ImageIcon size={22}/>} label="Image" onClick={() => addBlock('image')} />
                    <ToolbarButton icon={<Video size={22}/>} label="Video" onClick={() => addBlock('video')} />
                    <ToolbarButton icon={<Paperclip size={22}/>} label="File" onClick={() => addBlock('attachment')} />
                </div>
            </div>
        </div>

        {/* Right Column*/}
        <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300">Article Poster</h3>
                <div className="relative aspect-[4/5] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group hover:border-purple-300 transition-all">
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => {setImagePreview(""); setImageId(null);}} className="p-4 bg-white rounded-2xl text-red-500 shadow-2xl hover:scale-110 transition-transform"><Trash2 size={24}/></button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6">
                            {uploading ? <Loader2 className="animate-spin text-purple-600 mx-auto" size={32} /> : (
                                <>
                                    <UploadCloud className="mx-auto text-slate-200 mb-4" size={48} />
                                    <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Drag or Click to Upload</p>
                                </>
                            )}
                        </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                </div>

                <div className="space-y-6 pt-4">
                    <div>
                        <label className="font-black text-[9px] uppercase tracking-widest text-slate-400 block mb-3">Classification</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none appearance-none"
                        >
                            {['Policy Update', 'Thought Leadership', 'Announcements', 'Ethics & Governance', 'SME Support'].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
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
    className="flex flex-col items-center gap-3 text-slate-500 hover:text-white transition group"
  >
    <div className="p-4 bg-slate-800 rounded-2xl group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-300 text-slate-400 group-hover:text-white shadow-lg">{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);