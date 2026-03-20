import React, { useState, useEffect } from 'react';
import { 
  Save, ArrowLeft, Image as ImageIcon, X, 
  Type, Trash2, MoveUp, UploadCloud, Star, Loader2,
  Send, PlayCircle, Clock, Plus, Grid
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
  const parseContentBlocks = (content: any) => {
    if (!content || !Array.isArray(content)) return [{ id: '1', type: 'text', value: '' }];
    
    const parsedBlocks: any[] = [];
    let galleryImages: string[] = [];
    
    content.forEach((block: any, index: number) => {
      const id = Math.random().toString(36).substr(2, 9);
      
      if (block.type === 'paragraph') {
        // If we have accumulated gallery images, create a gallery block first
        if (galleryImages.length > 0) {
          parsedBlocks.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'gallery',
            value: galleryImages
          });
          galleryImages = [];
        }
        
        const text = block.children?.[0]?.text || '';
        
        // Check if this is an image marker from our new format
        if (text.includes('__IMAGE__')) {
          const imageUrl = text.replace(/__IMAGE__/g, '');
          parsedBlocks.push({ id, type: 'image', value: imageUrl });
        } else {
          parsedBlocks.push({ id, type: 'text', value: text });
        }
      }
      else if (block.type === 'image') {
        const imageUrl = block.image?.url || block.url || '';
        
        // Check if the next block is also an image to group them into a gallery
        const nextBlock = content[index + 1];
        if (nextBlock && nextBlock.type === 'image') {
          galleryImages.push(imageUrl);
        } else {
          // If we have accumulated images, add them plus this one as a gallery
          if (galleryImages.length > 0) {
            galleryImages.push(imageUrl);
            parsedBlocks.push({
              id: Math.random().toString(36).substr(2, 9),
              type: 'gallery',
              value: galleryImages
            });
            galleryImages = [];
          } else {
            // Single image block
            parsedBlocks.push({ id, type: 'image', value: imageUrl });
          }
        }
      }
      else {
        // If we have accumulated gallery images, create a gallery block first
        if (galleryImages.length > 0) {
          parsedBlocks.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'gallery',
            value: galleryImages
          });
          galleryImages = [];
        }
        
        // Handle other block types
        parsedBlocks.push({ id, type: 'text', value: '' });
      }
    });
    
    // Handle any remaining gallery images
    if (galleryImages.length > 0) {
      parsedBlocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'gallery',
        value: galleryImages
      });
    }
    
    return parsedBlocks.length > 0 ? parsedBlocks : [{ id: '1', type: 'text', value: '' }];
  };

  const [blocks, setBlocks] = useState(() => {
    if (initialData?.content) {
      return parseContentBlocks(initialData.content);
    }
    return initialData?.contentBlocks || [{ id: '1', type: 'text', value: '' }];
  });
  
  const [readTime, setReadTime] = useState(initialData?.readTime || 5);
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || "");
  const [imageId, setImageId] = useState<number | null>(initialData?.imageId || null);
  const [uploading, setUploading] = useState(false);
  const [blockUploading, setBlockUploading] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

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

  const handleBlockMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string, isMultiple: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setBlockUploading(blockId);
    
    try {
      if (isMultiple) {
        // Handle multiple image uploads sequentially to avoid overwhelming the server
        const uploadedImages: any[] = [];
        
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append('files', file);
          
          try {
            const res = await api.post('/upload', formData);
            if (res.data && res.data[0]) {
              const uploadedFile = res.data[0];
              uploadedImages.push({
                id: uploadedFile.id,
                url: `${STRAPI_URL}${uploadedFile.url}`,
                name: uploadedFile.name,
                alternativeText: uploadedFile.alternativeText || ""
              });
            }
          } catch (uploadError) {
            console.error('Failed to upload file:', file.name, uploadError);
            // Continue with other files even if one fails
          }
        }
        
        if (uploadedImages.length > 0) {
          // Update block with array of image objects
          setBlocks(blocks.map((b: any) => 
            b.id === blockId ? { 
              ...b, 
              value: Array.isArray(b.value) ? [...b.value, ...uploadedImages] : uploadedImages, 
              type: 'gallery' 
            } : b
          ));
        }
      } else {
        // Handle single image upload
        const formData = new FormData();
        formData.append('files', files[0]);
        const res = await api.post('/upload', formData);
        if (res.data && res.data[0]) {
          const uploadedFile = res.data[0];
          const imageData = {
            id: uploadedFile.id,
            url: `${STRAPI_URL}${uploadedFile.url}`,
            name: uploadedFile.name,
            alternativeText: uploadedFile.alternativeText || ""
          };
          updateBlock(blockId, imageData);
        }
      }
    } catch (err) {
      console.error("Media upload failed:", err);
      alert("Media upload failed. Please try again.");
    } finally {
      setBlockUploading(null);
    }
  };

  const updateBlock = (id: string, value: string | any) => {
    setBlocks(blocks.map((b: any) => b.id === id ? { ...b, value } : b));
  };

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    setDragOver(blockId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = async (e: React.DragEvent, blockId: string, isMultiple: boolean = false) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;

    setBlockUploading(blockId);
    
    try {
      if (isMultiple) {
        // Handle multiple image uploads sequentially
        const uploadedImages: any[] = [];
        
        for (const file of files) {
          const formData = new FormData();
          formData.append('files', file);
          
          try {
            const res = await api.post('/upload', formData);
            if (res.data && res.data[0]) {
              const uploadedFile = res.data[0];
              uploadedImages.push({
                id: uploadedFile.id,
                url: `${STRAPI_URL}${uploadedFile.url}`,
                name: uploadedFile.name,
                alternativeText: uploadedFile.alternativeText || ""
              });
            }
          } catch (uploadError) {
            console.error('Failed to upload file:', file.name, uploadError);
            // Continue with other files even if one fails
          }
        }
        
        if (uploadedImages.length > 0) {
          setBlocks(blocks.map((b: any) => 
            b.id === blockId ? { 
              ...b, 
              value: Array.isArray(b.value) ? [...b.value, ...uploadedImages] : uploadedImages, 
              type: 'gallery' 
            } : b
          ));
        }
      } else {
        const formData = new FormData();
        formData.append('files', files[0]);
        const res = await api.post('/upload', formData);
        if (res.data && res.data[0]) {
          const uploadedFile = res.data[0];
          const imageData = {
            id: uploadedFile.id,
            url: `${STRAPI_URL}${uploadedFile.url}`,
            name: uploadedFile.name,
            alternativeText: uploadedFile.alternativeText || ""
          };
          updateBlock(blockId, imageData);
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setBlockUploading(null);
    }
  };

  const removeImageFromGallery = (blockId: string, imageIndex: number) => {
    setBlocks(blocks.map((b: any) => {
      if (b.id === blockId && b.type === 'gallery' && Array.isArray(b.value)) {
        const newImages = b.value.filter((_: any, index: number) => index !== imageIndex);
        return { ...b, value: newImages.length > 0 ? newImages : [] };
      }
      return b;
    }));
  };

  const addBlock = (type: string) => {
    const newBlock = { 
      id: Math.random().toString(36).substr(2, 9), 
      type, 
      value: type === 'gallery' ? [] : '' 
    };
    console.log('Adding new block:', newBlock);
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
    console.log('=== SUBMIT DEBUG ===');
    console.log('All blocks before processing:', blocks);
    
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    // Filter out empty blocks before validation
    const nonEmptyBlocks = blocks.filter((block: any) => {
      if (block.type === 'text') {
        return block.value && typeof block.value === 'string' && block.value.trim();
      }
      if (block.type === 'image') {
        // Handle both string URLs and image objects
        if (typeof block.value === 'string') {
          return block.value && block.value.trim();
        } else if (typeof block.value === 'object' && block.value !== null) {
          return block.value.url || block.value.id;
        }
        return false;
      }
      if (block.type === 'gallery') {
        return Array.isArray(block.value) && block.value.length > 0;
      }
      if (block.type === 'video') {
        return block.value && typeof block.value === 'string' && block.value.trim();
      }
      return false;
    });

    console.log('Non-empty blocks:', nonEmptyBlocks);
  
    // Define categoryId with a fallback
    let categoryId: number | string | null = null;
  
    //  Try to find the ID from the fetched categories list
    if (availableCategories && availableCategories.length > 0) {
      const foundCategory = availableCategories.find(cat => {
        const name = cat.attributes?.name || cat.name;
        return name === category;
      });
      // Strapi nests ID in attributes 
      categoryId = foundCategory?.id || foundCategory?.attributes?.id || null;
    }
  
    
    if (!categoryId) {
      categoryId = CATEGORY_MAP[category] || 1;
    }
  
    // Process only non-empty blocks
    const processedBlocks = nonEmptyBlocks.map((block: any) => {
      if (block.type === 'text') {
        return {
          type: 'paragraph',
          children: [{ type: 'text', text: block.value.trim() }]
        };
      }
      if (block.type === 'image') {
        // Handle both string URLs (legacy) and image objects (new format)
        if (typeof block.value === 'string') {
          return {
            type: 'paragraph',
            children: [{ 
              type: 'text', 
              text: `__IMAGE__${block.value}__IMAGE__`
            }]
          };
        } else if (block.value && typeof block.value === 'object') {
          // For image objects, use the URL from the object
          const imageUrl = block.value.url || '';
          if (imageUrl) {
            return {
              type: 'paragraph',
              children: [{ 
                type: 'text', 
                text: `__IMAGE__${imageUrl}__IMAGE__`
              }]
            };
          }
        }
        return null;
      }
      if (block.type === 'gallery' && Array.isArray(block.value)) {
        // Convert gallery to multiple individual image blocks
        return block.value.map((image: any) => {
          if (typeof image === 'string') {
            return {
              type: 'image',
              image: {
                url: image,
                alternativeText: ""
              }
            };
          } else if (image && image.id) {
            return {
              type: 'image',
              image: image.id // Use the Strapi file ID
            };
          }
          return null;
        }).filter((img: any) => img !== null);
      }
      if (block.type === 'video') {
        return {
          type: 'paragraph',
          children: [{ 
            type: 'text', 
            text: `__VIDEO__${block.value}__VIDEO__`
          }]
        };
      }
     
      return null;
    }).filter((block: any) => block !== null).flat(); // Remove null blocks and flatten gallery conversions

    console.log('Final processed blocks for Strapi:', processedBlocks);
    
    onSave({ 
      title: title.trim(), 
      description: summary.trim(),    
      news: categoryId, 
      isFeatured: isTopPick,   
      readTime: Number(readTime), 
      featuredImage: imageId,  
      content: processedBlocks, 
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
                          <img 
                            src={typeof block.value === 'string' ? block.value : block.value.url} 
                            className="w-full h-auto max-h-[400px] object-cover" 
                            alt="" 
                          />
                          <button onClick={() => updateBlock(block.id, "")} className="absolute top-4 right-4 p-3 bg-white rounded-full text-red-500 shadow-md"><X size={18}/></button>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => handleDragOver(e, block.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, block.id, false)}
                          className={`transition-all ${dragOver === block.id ? 'border-purple-400 bg-purple-50' : ''}`}
                        >
                          <label className="flex flex-col items-center justify-center p-12 md:p-20 border-2 border-dashed rounded-[2rem] bg-white cursor-pointer hover:bg-slate-50 hover:border-purple-200 transition-all">
                            {blockUploading === block.id ? <Loader2 className="animate-spin text-purple-600" /> : <UploadCloud className="text-slate-300 mb-4" size={40} />}
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Upload Body Image</span>
                            <span className="text-[9px] font-medium text-slate-300 mt-1">Click to select or drag & drop</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBlockMediaUpload(e, block.id)} />
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === 'gallery' && (
                    <div className="space-y-4">
                      {Array.isArray(block.value) && block.value.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {block.value.map((image: any, index: number) => (
                            <div key={index} className="relative group overflow-hidden rounded-[1.5rem]">
                              <img 
                                src={typeof image === 'string' ? image : image.url} 
                                className="w-full h-48 object-cover" 
                                alt={`Gallery image ${index + 1}`} 
                              />
                              <button 
                                onClick={() => removeImageFromGallery(block.id, index)} 
                                className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14}/>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      
                      <div
                        onDragOver={(e) => handleDragOver(e, block.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, block.id, true)}
                        className={`transition-all ${dragOver === block.id ? 'border-purple-400 bg-purple-50' : ''}`}
                      >
                        <label className="flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-[2rem] bg-white cursor-pointer hover:bg-slate-50 hover:border-purple-200 transition-all">
                          {blockUploading === block.id ? (
                            <Loader2 className="animate-spin text-purple-600" />
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-4">
                                <UploadCloud className="text-slate-300" size={32} />
                                <Plus className="text-slate-300" size={20} />
                              </div>
                              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                                {Array.isArray(block.value) && block.value.length > 0 ? 'Add More Images' : 'Upload Multiple Images'}
                              </span>
                              <span className="text-[9px] font-medium text-slate-300 mt-1">Select multiple files or drag & drop</span>
                            </>
                          )}
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            className="hidden" 
                            onChange={(e) => handleBlockMediaUpload(e, block.id, true)} 
                          />
                        </label>
                      </div>
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
              <ToolbarButton icon={<Grid size={22}/>} label="Gallery" onClick={() => addBlock('gallery')} />
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