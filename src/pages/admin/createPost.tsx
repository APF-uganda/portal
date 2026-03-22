import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/common/adminSideNav';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CreatePostForm from '../../components/adminForum-components/CreatePostForm';
import { useCategories, useTags, useCreatePost } from '../../hooks/useForumData';

import { getForumPostDetail, updateForumPost } from '../../services/forum.service';
import { CreatePostRequest, ForumPost } from '../../components/adminForum-components/types';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

const CreatePost = () => {
  const { id } = useParams(); 
  const isEditMode = Boolean(id);
  
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Initialize as ForumPost | null to match the prop expected by the form
  const [initialData, setInitialData] = useState<ForumPost | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  
  const navigate = useNavigate();

  
  const { data: fetchedCategories, loading: categoriesLoading } = useCategories();
  const { data: tags, loading: tagsLoading } = useTags();
  const { createPost, loading: createLoading, error: createError } = useCreatePost();

  // 1. Fetching Logic for Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchPostForEdit = async () => {
        setPostLoading(true);
        try {
          const data = await getForumPostDetail(Number(id));
          if (data) {
            // Use 'as any' to bypass strict property checks on the API response
            const apiData = data as any;
            
            const postForForm: ForumPost = {
              ...apiData,
              // Ensure all required ForumPost fields exist
              tags: apiData.tags || [],
              is_pinned: apiData.is_pinned ?? false,
              is_locked: apiData.is_locked ?? false,
              comment_count: apiData.comment_count ?? 0,
              like_count: apiData.like_count ?? 0,
              updated_at: apiData.updated_at || apiData.created_at || new Date().toISOString()
            };
            
            setInitialData(postForForm);
          }
        } catch (err) {
          console.error("Failed to fetch post for editing:", err);
        } finally {
          setPostLoading(false);
        }
      };
      fetchPostForEdit();
    }
  }, [id, isEditMode]);

 
  // 2. Live Data Mapping
  const categories = useMemo(() => {
    // If there's no data yet, return an empty array (the Loading state handles the UI)
    if (!fetchedCategories || fetchedCategories.length === 0) {
      return [];
    }

   
    return fetchedCategories.map((category) => ({
      ...category, 
      value: Number(category.id), // Ensure ID is a number for the backend
      label: category.name // Ensure label is present for the UI dropdown
    }));
  }, [fetchedCategories]);

  //  Submit Logic Handles both Create and Update
  const handleSubmit = async (formData: CreatePostRequest) => {
    try {
      let result;
      if (isEditMode && id) {
        // Use the service function instead of api.put
        result = await updateForumPost(Number(id), formData);
      } else {
        // Use your original hook's create method
        result = await createPost(formData);
      }
      
      if (result) {
        setShowSuccess(true);
        setTimeout(() => navigate('/admin/communityForum'), 2000);
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleBack = () => navigate('/admin/communityForum');

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 min-w-0 bg-gray-50 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} min-h-screen flex flex-col`}>
        <Header 
          title={isEditMode ? "Edit Post" : "Create Post"} 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 bg-[#F4F7FE] px-3 md:px-4 py-3 md:py-6 lg:px-8 overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto">
            
            <div className="mb-6 md:mb-8">
              <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-[#5C32A3] mb-3 font-medium text-sm">
                <ArrowLeft size={18} /> Back to Forum
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {isEditMode ? 'Edit Draft Post' : 'Create New Post'}
              </h1>
            </div>

            {showSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl mb-6 flex items-center gap-3 animate-fade-in">
                <CheckCircle size={20} className="text-green-600" />
                <p className="font-bold">Post {isEditMode ? 'updated' : 'created'} successfully!</p>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
              {(categoriesLoading || tagsLoading || postLoading) ? (
                <div className="py-12 text-center">
                  <Loader2 className="animate-spin h-10 w-10 text-[#5C32A3] mx-auto mb-4" />
                  <p className="text-gray-500">Loading form data...</p>
                </div>
              ) : (
                <CreatePostForm
                  categories={categories}
                  tags={tags}
                  onSubmit={handleSubmit}
                  loading={createLoading}
                  error={createError}
                  initialData={initialData} 
                />
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default CreatePost;