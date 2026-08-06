import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Gem,
  FolderOpen,
  MessageSquare,
  Image,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  Upload,
  Globe,
  DollarSign,
  Layers,
  Rotate3d,
  Sparkles,
  ChevronRight,
  Eye,
  X,
  Mail,
  Phone,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance.js';
import Button from '../components/ui/Button.jsx';
import {
  getAllCollectionItems,
  addCustomCollectionItem,
  deleteCustomCollectionItem
} from '../data/collections.js';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('collections');

  // Database Data lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Collection Items List (Loaded from collections.js + localStorage)
  const [collectionItemsList, setCollectionItemsList] = useState([]);
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    category: 'Premium Italian Marbles',
    origin: '',
    color: 'White',
    finishes: ['Polished'],
    description: '',
    density: '2710 kg/m³',
    waterAbsorption: '0.12 %',
    compressiveStrength: '135 MPa',
  });
  const [collectionFile, setCollectionFile] = useState(null);
  const [collectionImagePreview, setCollectionImagePreview] = useState(null);

  // Form inputs states
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', categoryId: '', dimensions: '', thickness: '', origins: '', featured: false });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [projectForm, setProjectForm] = useState({ name: '', description: '', location: '', year: '', client: '', categoryId: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', tag: 'Kitchen' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', author: '', tags: '', status: 'Draft' });

  // Selected file references
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch data utilities
  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/inventory/products?limit=100');
      const data = res.data?.data;
      setProducts(Array.isArray(data) ? data : (data?.products || []));
    } catch (err) {
      console.error('Failed to fetch products', err);
      setProducts([]);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/inventory/categories');
      setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setCategories([]);
    }
  };
  const fetchInquiries = async () => {
    try {
      const res = await axiosInstance.get('/leads/inquiries');
      setInquiries(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
      setInquiries([]);
    }
  };
  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get('/misc/projects');
      setProjects(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
      setProjects([]);
    }
  };
  const fetchGallery = async () => {
    try {
      const res = await axiosInstance.get('/misc/gallery');
      setGallery(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to fetch gallery', err);
      setGallery([]);
    }
  };
  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get('/misc/blogs?status=');
      setBlogs(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
      setBlogs([]);
    }
  };

  useEffect(() => {
    fetchProducts().catch(console.error);
    fetchCategories().catch(console.error);
    fetchInquiries().catch(console.error);
    fetchProjects().catch(console.error);
    fetchGallery().catch(console.error);
    fetchBlogs().catch(console.error);
    setCollectionItemsList(getAllCollectionItems());
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCollectionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCollectionFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCollectionImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinishToggle = (finishName) => {
    setCollectionForm((prev) => {
      const current = prev.finishes || [];
      const updated = current.includes(finishName)
        ? current.filter((f) => f !== finishName)
        : [...current, finishName];
      return { ...prev, finishes: updated };
    });
  };

  // ==========================================
  // Marble Collections CRUD
  // ==========================================
  const handleCreateCollectionItem = async (e) => {
    e.preventDefault();
    if (!collectionForm.name || !collectionForm.category) {
      toast.error('Marble Name and Category are required');
      return;
    }

    setSubmitting(true);
    try {
      let imagePath = '/images/stone_image_1.jpg';

      if (collectionImagePreview) {
        imagePath = collectionImagePreview;
      } else if (collectionFile) {
        imagePath = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(collectionFile);
        });
      }

      const slug = collectionForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newItem = {
        id: slug + '-' + Date.now(),
        slug,
        name: collectionForm.name,
        category: collectionForm.category,
        origin: collectionForm.origin || 'International Reserve',
        color: collectionForm.color || 'White',
        finish: (collectionForm.finishes && collectionForm.finishes.length) ? collectionForm.finishes.join(', ') : 'Polished',
        finishes: collectionForm.finishes || ['Polished'],
        description: collectionForm.description || `${collectionForm.name} is a luxury natural marble slab curated for high-end interior spaces.`,
        density: collectionForm.density || '2710 kg/m³',
        waterAbsorption: collectionForm.waterAbsorption || '0.12 %',
        compressiveStrength: collectionForm.compressiveStrength || '135 MPa',
        image: imagePath,
      };

      addCustomCollectionItem(newItem);
      toast.success(`"${newItem.name}" added to Collection successfully!`);

      // Reset form
      setCollectionForm({
        name: '',
        category: 'Premium Italian Marbles',
        origin: '',
        color: 'White',
        finishes: ['Polished'],
        description: '',
        density: '2710 kg/m³',
        waterAbsorption: '0.12 %',
        compressiveStrength: '135 MPa',
      });
      setCollectionFile(null);
      setCollectionImagePreview(null);
      setCollectionItemsList(getAllCollectionItems());
    } catch (err) {
      console.error(err);
      toast.error('Failed to add collection item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCollectionItem = (id) => {
    if (!window.confirm('Delete this marble from collection?')) return;
    deleteCustomCollectionItem(id);
    toast.success('Collection item removed');
    setCollectionItemsList(getAllCollectionItems());
  };

  // ==========================================
  // Product CRUD
  // ==========================================
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Product image is required');
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    Object.keys(productForm).forEach((key) => fd.append(key, productForm[key]));
    fd.append('image', selectedFile);

    try {
      await axiosInstance.post('/inventory/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product created successfully');
      setProductForm({ name: '', description: '', price: '', stock: '', categoryId: '', dimensions: '', thickness: '', origins: '', featured: false });
      setSelectedFile(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axiosInstance.delete(`/inventory/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  // ==========================================
  // Category CRUD
  // ==========================================
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    fd.append('name', categoryForm.name);
    fd.append('description', categoryForm.description);
    if (selectedFile) fd.append('image', selectedFile);

    try {
      await axiosInstance.post('/inventory/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Category created');
      setCategoryForm({ name: '', description: '' });
      setSelectedFile(null);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Deleting category will detach associated products. Continue?')) return;
    try {
      await axiosInstance.delete(`/inventory/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  // ==========================================
  // Inquiry updates
  // ==========================================
  const handleResolveInquiry = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
    try {
      await axiosInstance.put(`/leads/inquiries/${id}`, { status: nextStatus });
      toast.success(`Inquiry marked as ${nextStatus}`);
      fetchInquiries();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Remove this lead log?')) return;
    try {
      await axiosInstance.delete(`/leads/inquiries/${id}`);
      toast.success('Lead removed');
      fetchInquiries();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  // ==========================================
  // Project CRUD
  // ==========================================
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Feature project image is required');
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    Object.keys(projectForm).forEach(key => fd.append(key, projectForm[key]));
    fd.append('image', selectedFile);

    try {
      await axiosInstance.post('/misc/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Portfolio project added');
      setProjectForm({ name: '', description: '', location: '', year: '', client: '', categoryId: '' });
      setSelectedFile(null);
      fetchProjects();
    } catch (err) {
      toast.error('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axiosInstance.delete(`/misc/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  // ==========================================
  // Gallery Showroom CRUD
  // ==========================================
  const handleCreateGalleryItem = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Gallery image file is required');
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    Object.keys(galleryForm).forEach(key => fd.append(key, galleryForm[key]));
    fd.append('image', selectedFile);

    try {
      await axiosInstance.post('/misc/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Showroom design item added');
      setGalleryForm({ title: '', description: '', tag: 'Kitchen' });
      setSelectedFile(null);
      fetchGallery();
    } catch (err) {
      toast.error('Failed to create gallery item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm('Delete this showroom image?')) return;
    try {
      await axiosInstance.delete(`/misc/gallery/${id}`);
      toast.success('Gallery item deleted');
      fetchGallery();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  // ==========================================
  // Blogs CRUD
  // ==========================================
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.keys(blogForm).forEach(key => fd.append(key, blogForm[key]));
    if (selectedFile) fd.append('image', selectedFile);

    try {
      await axiosInstance.post('/misc/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Blog article created');
      setBlogForm({ title: '', content: '', author: '', tags: '', status: 'Draft' });
      setSelectedFile(null);
      fetchBlogs();
    } catch (err) {
      toast.error('Failed to create blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await axiosInstance.delete(`/misc/blogs/${id}`);
      toast.success('Article deleted');
      fetchBlogs();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-luxury-950 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar Control Panel */}
      <aside className="w-full md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-6">
          
          {/* Admin Brand Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-600/25">
                M
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Marble<span className="text-blue-600 dark:text-blue-400">Craft</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Backoffice Admin
                </p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" title="System Live" />
          </div>

          {/* Navigation Sections */}
          <div className="space-y-6">
            
            {/* Group 1: Catalog & Showcase */}
            <div>
              <div className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 flex items-center justify-between">
                <span>Catalog & Showcase</span>
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'collections', name: 'Add to Collection', icon: Layers, badge: collectionItemsList.length },
                  { id: 'products', name: 'Products Slabs', icon: Gem, badge: products.length },
                  { id: 'categories', name: 'Categories', icon: FolderOpen, badge: categories.length },
                  { id: 'gallery', name: 'Gallery Showroom', icon: Image, badge: gallery.length },
                ].map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSelectedFile(null); }}
                      className={`w-full group flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-bold translate-x-1'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40'
                        }`}>
                          <tab.icon className="h-4 w-4" />
                        </div>
                        <span>{tab.name}</span>
                      </div>
                      {tab.badge !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Group 2: Management & Leads */}
            <div>
              <div className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-3 mb-2">
                Management & Leads
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'dashboard', name: 'Dashboard Analytics', icon: LayoutDashboard },
                  { id: 'inquiries', name: 'Inquiries & Leads', icon: MessageSquare, badge: inquiries.length },
                  { id: 'projects', name: 'Portfolio Projects', icon: FolderOpen, badge: projects.length },
                  { id: 'blogs', name: 'Blogs & Articles', icon: BookOpen, badge: blogs.length },
                ].map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSelectedFile(null); }}
                      className={`w-full group flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-bold translate-x-1'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40'
                        }`}>
                          <tab.icon className="h-4 w-4" />
                        </div>
                        <span>{tab.name}</span>
                      </div>
                      {tab.badge !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Quick Links Footer: Back to Website & 3D Showroom */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center font-bold shadow-sm group-hover:-translate-x-0.5 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Back to Website</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Return to Homepage</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to="/showroom"
            target="_blank"
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 flex items-center justify-between text-blue-600 dark:text-blue-400 hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
                <Rotate3d className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Launch 3D Showroom</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Live Virtual Vision</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        
        {/* Tab 0: Add to Collection Section */}
        {activeTab === 'collections' && (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold font-serif text-slate-800 dark:text-white">
                  Marble Collections Management
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Add new marble slabs to the collection catalog with custom images, origins, colors, finishes, and technical specifications.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-xl text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-sm">
                {collectionItemsList.length} Marble Slabs Registered
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Add to Collection Form */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
                <h3 className="text-xl font-bold font-serif mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" /> Add to Collection
                </h3>

                <form onSubmit={handleCreateCollectionItem} className="space-y-5">

                  {/* Marble Image File Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Marble Image (Choose from Local) *
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-blue-600 transition-colors">
                      {collectionImagePreview ? (
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-2">
                          <img src={collectionImagePreview} alt="Marble Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => { setCollectionFile(null); setCollectionImagePreview(null); }}
                            className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full text-xs hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-1">Click or drag local marble image</p>
                          <p className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCollectionImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Marble Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Name of the Marble *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Statuario Extra White"
                      value={collectionForm.name}
                      onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Category (Available Categories) *
                    </label>
                    <select
                      value={collectionForm.category}
                      onChange={(e) => setCollectionForm({ ...collectionForm, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 dark:text-white cursor-pointer"
                    >
                      <option value="Premium Italian Marbles">Premium Italian Marbles</option>
                      <option value="Black Marbles">Black Marbles</option>
                      <option value="Beige & Cream Marbles">Beige & Cream Marbles</option>
                      <option value="Green Marbles">Green Marbles</option>
                      <option value="White Marbles">White Marbles</option>
                      <option value="Brown Marbles">Brown Marbles</option>
                      <option value="Red & Pink Marbles">Red & Pink Marbles</option>
                      <option value="Grey Marbles">Grey Marbles</option>
                      <option value="Indian Marbles">Indian Marbles</option>
                    </select>
                  </div>

                  {/* Origin & Primary Color */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Origin
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Carrara, Italy"
                        value={collectionForm.origin}
                        onChange={(e) => setCollectionForm({ ...collectionForm, origin: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Primary Color
                      </label>
                      <select
                        value={collectionForm.color}
                        onChange={(e) => setCollectionForm({ ...collectionForm, color: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 dark:text-white cursor-pointer"
                      >
                        <option value="White">White</option>
                        <option value="Black">Black</option>
                        <option value="Grey">Grey</option>
                        <option value="Green">Green</option>
                        <option value="Red">Red</option>
                        <option value="Pink">Pink</option>
                        <option value="Brown">Brown</option>
                        <option value="Yellow">Yellow/Beige</option>
                      </select>
                    </div>
                  </div>

                  {/* Available Finishes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Available Finishes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Polished', 'Honed', 'Leathered', 'Satin'].map((fin) => (
                        <button
                          type="button"
                          key={fin}
                          onClick={() => handleFinishToggle(fin)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            (collectionForm.finishes || []).includes(fin)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                          }`}
                        >
                          {fin}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Marble slab character, veining details, and architectural applications..."
                      value={collectionForm.description}
                      onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Technical Specifications */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block">
                      Technical Specifications
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-semibold mb-1">Density</label>
                        <input
                          type="text"
                          placeholder="2710 kg/m³"
                          value={collectionForm.density}
                          onChange={(e) => setCollectionForm({ ...collectionForm, density: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-2 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-semibold mb-1">Water Absorption</label>
                        <input
                          type="text"
                          placeholder="0.12 %"
                          value={collectionForm.waterAbsorption}
                          onChange={(e) => setCollectionForm({ ...collectionForm, waterAbsorption: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-2 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-semibold mb-1">Compressive Strength</label>
                        <input
                          type="text"
                          placeholder="135 MPa"
                          value={collectionForm.compressiveStrength}
                          onChange={(e) => setCollectionForm({ ...collectionForm, compressiveStrength: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-2 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md text-sm cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Adding Slab...' : 'Add to Collection Section'}
                  </button>

                </form>
              </div>

              {/* Collection Items Table */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
                <h3 className="text-xl font-bold font-serif mb-6 text-slate-800 dark:text-white">
                  Active Collection Registry ({collectionItemsList.length} Slabs)
                </h3>
                
                {collectionItemsList.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Layers className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No marble slabs in collection</p>
                    <p className="text-xs text-slate-400 mt-1">Use the form on the left to add your first marble entry to the collection!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 pb-3 text-slate-400 uppercase font-semibold">
                          <th className="py-3">Image</th>
                          <th className="py-3">Marble Name</th>
                          <th className="py-3">Category</th>
                          <th className="py-3">Origin</th>
                          <th className="py-3">Specs</th>
                          <th className="py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collectionItemsList.map((item) => (
                          <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-3">
                              <div className="h-10 w-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="py-3 font-bold text-slate-800 dark:text-white">
                              {item.name}
                              <span className="block text-[10px] font-normal text-slate-500">{item.finish}</span>
                            </td>
                            <td className="py-3">
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 text-[10px] font-medium px-2 py-0.5 rounded-full">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 text-slate-500 dark:text-slate-400">{item.origin || 'Italy'}</td>
                            <td className="py-3 text-[10px] text-slate-400">
                              <div>{item.density || '2710 kg/m³'}</div>
                              <div>{item.waterAbsorption || '0.12 %'}</div>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`/showroom?stoneId=${encodeURIComponent(item.name || item.id)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-accent/15 hover:bg-gold-accent/25 text-amber-700 dark:text-amber-300 border border-gold-accent/30 text-[11px] font-bold transition-all shadow-sm"
                                  title="Preview in 3D Showroom"
                                >
                                  <Rotate3d className="h-3.5 w-3.5" /> 3D View
                                </a>
                                <button
                                  onClick={() => handleDeleteCollectionItem(item.id)}
                                  className="text-red-500 hover:text-red-650 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                  title="Delete Marble"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 1: Dashboard Analytics */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <h2 className="text-3xl font-extrabold font-serif text-slate-800 dark:text-white">Workspace Analytics</h2>
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Total Products</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{(products || []).length}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Categories</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{(categories || []).length}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Inquiries</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{(inquiries || []).length}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Portfolio installs</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{(projects || []).length}</span>
              </div>
            </div>

            {/* Recent inquiries */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8">
              <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-white mb-6">Recent Customer Leads</h3>
              <div className="space-y-4">
                {(inquiries || []).length === 0 ? (
                  <p className="text-xs text-slate-400">No customer inquiries found.</p>
                ) : (
                  (inquiries || []).slice(0, 5).map(inq => (
                    <div key={inq.id} className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        {inq.image ? (
                          <a href={inq.image} target="_blank" rel="noopener noreferrer" className="shrink-0" title="View Cloudinary attachment/image">
                            <img
                              src={inq.image}
                              alt="Inquiry attachment preview"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://res.cloudinary.com/dvkpnexm1/image/upload/v1785819394/inquiries/stone_image_1_wvggp4.jpg';
                              }}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                            />
                          </a>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-semibold">
                            No Img
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{inq.name} ({inq.email})</span>
                          <p className="text-xs text-slate-400 mt-0.5">{inq.subject}</p>
                          <p className="text-xs text-slate-500 italic mt-0.5 max-w-sm truncate">"{inq.message}"</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                          inq.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {inq.status}
                        </span>
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold text-xs border border-blue-200 dark:border-blue-800 transition-colors shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Products Manager */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Create Product Form */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-800 dark:text-white">Add New Stone Slab</h3>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Product name (e.g. Statuario Extra White)"
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                />
                <textarea
                  placeholder="Slab description details..."
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    required
                    placeholder="Price per Sqm"
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Stock Qty (Slabs)"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Dimensions (3000 x 1800)"
                    value={productForm.dimensions}
                    onChange={e => setProductForm({ ...productForm, dimensions: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Thickness (18mm)"
                    value={productForm.thickness}
                    onChange={e => setProductForm({ ...productForm, thickness: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Origin Country"
                    value={productForm.origins}
                    onChange={e => setProductForm({ ...productForm, origins: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                  />
                  
                  <select
                    required
                    value={productForm.categoryId}
                    onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* File Upload Input */}
                <div className="border border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center">
                  <input type="file" onChange={handleFileChange} className="hidden" id="product-img" />
                  <label htmlFor="product-img" className="cursor-pointer text-xs text-slate-400 flex flex-col items-center gap-1.5">
                    <Upload className="h-6 w-6 text-blue-600" />
                    {selectedFile ? selectedFile.name : 'Upload main thumbnail image'}
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="feat"
                    checked={productForm.featured}
                    onChange={e => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <label htmlFor="feat" className="text-xs text-slate-400">Featured selection on Homepage</label>
                </div>

                <Button type="submit" variant="primary" loading={submitting} className="w-full">
                  Create Product
                </Button>
              </form>
            </div>

            {/* Product table grids (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl overflow-x-auto">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-850 dark:text-white">Active Catalog ({products.length})</h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800 pb-4 text-slate-400">
                    <th className="py-3 font-semibold uppercase">Product</th>
                    <th className="py-3 font-semibold uppercase">Price/Sqm</th>
                    <th className="py-3 font-semibold uppercase">Stock</th>
                    <th className="py-3 font-semibold uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => (
                    <tr key={prod.id} className="border-b border-slate-50 dark:border-slate-800">
                      <td className="py-3.5 font-bold text-slate-700 dark:text-slate-300">{prod.name}</td>
                      <td className="py-3.5 font-semibold">${parseFloat(prod.pricePerSqft || prod.price || 0).toFixed(2)}</td>
                      <td className="py-3.5 text-slate-400">{prod.stockQuantity ?? prod.stock ?? 0} slabs</td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/showroom?stoneId=${encodeURIComponent(prod.name || prod.slug || prod.id)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-accent/15 hover:bg-gold-accent/25 text-amber-700 dark:text-amber-300 border border-gold-accent/30 text-[11px] font-bold transition-all shadow-sm"
                            title="Preview in 3D Showroom"
                          >
                            <Rotate3d className="h-3.5 w-3.5" /> 3D View
                          </a>
                          <button onClick={() => handleDeleteProduct(prod.id)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 3: Categories CRUD */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-800 dark:text-white">Create Category</h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Category Name"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                />
                <textarea
                  placeholder="Category description detail..."
                  value={categoryForm.description}
                  onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                />
                <div className="border border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center">
                  <input type="file" onChange={handleFileChange} className="hidden" id="category-img" />
                  <label htmlFor="category-img" className="cursor-pointer text-xs text-slate-400 flex flex-col items-center gap-1.5">
                    <Upload className="h-6 w-6 text-blue-600" />
                    {selectedFile ? selectedFile.name : 'Upload Category cover image'}
                  </label>
                </div>
                <Button type="submit" variant="primary" loading={submitting} className="w-full">
                  Create Category
                </Button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-850 dark:text-white">Categories List</h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800 pb-3 text-slate-400">
                    <th className="py-2 font-semibold">Name</th>
                    <th className="py-2 font-semibold">Description</th>
                    <th className="py-2 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} className="border-b border-slate-50 dark:border-slate-800">
                      <td className="py-3 font-bold text-slate-700 dark:text-slate-350">{cat.name}</td>
                      <td className="py-3 text-slate-400 truncate max-w-[200px]">{cat.description}</td>
                      <td className="py-3 text-right">
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-650">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 4: Inquiries lists */}
        {activeTab === 'inquiries' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
            <h3 className="text-lg font-bold font-serif mb-6 text-slate-800 dark:text-white">Customer Leads logs</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800 pb-3 text-slate-400">
                  <th className="py-3 font-semibold">Attachment / Image</th>
                  <th className="py-3 font-semibold">Customer</th>
                  <th className="py-3 font-semibold">Subject</th>
                  <th className="py-3 font-semibold">Message</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(inq => (
                  <tr key={inq.id} className="border-b border-slate-50 dark:border-slate-800">
                    <td className="py-4">
                      {inq.image ? (
                        <a
                          href={inq.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block shrink-0 group relative"
                          title="Click to open Cloudinary image in new tab"
                        >
                          <img
                            src={inq.image}
                            alt="Attachment / Product Preview"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://res.cloudinary.com/dvkpnexm1/image/upload/v1785819394/inquiries/stone_image_1_wvggp4.jpg';
                            }}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform"
                          />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs italic">No image</span>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{inq.name}</div>
                      <div className="text-slate-400">{inq.email} | {inq.phone || 'No phone'}</div>
                    </td>
                    <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">{inq.subject}</td>
                    <td className="py-4 text-slate-450 italic max-w-xs truncate" title={inq.message}>"{inq.message}"</td>
                    <td className="py-4">
                      <button
                        onClick={() => handleResolveInquiry(inq.id, inq.status)}
                        className={`text-[10px] font-bold tracking-wide px-3 py-1 rounded-full ${
                          inq.status === 'Resolved' ? 'bg-green-150/10 text-green-600 border border-green-200' : 'bg-yellow-150/10 text-yellow-600 border border-yellow-250'
                        }`}
                      >
                        {inq.status}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold text-xs border border-blue-200 dark:border-blue-800 transition-colors shadow-sm"
                          title="View full inquiry card"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="text-red-500 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inquiry Detail View Modal Overlay */}
        {selectedInquiry && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedInquiry(null)}
          >
            <div 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedInquiry(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 pr-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">Customer Inquiry Details</h3>
                  <p className="text-xs text-slate-400">Received via MarbleCraft Portal</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Attached Image Preview */}
                <div className="sm:col-span-5 flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attached Image / Product</span>
                  {selectedInquiry.image ? (
                    <div className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                      <img
                        src={selectedInquiry.image}
                        alt="Inquiry Attachment"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://res.cloudinary.com/dvkpnexm1/image/upload/v1785819394/inquiries/stone_image_1_wvggp4.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <a
                        href={selectedInquiry.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5"
                      >
                        <ExternalLink className="w-4 h-4" /> Open Full Image
                      </a>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400 font-semibold">
                      No image attached
                    </div>
                  )}
                </div>

                {/* Inquiry Information Details */}
                <div className="sm:col-span-7 space-y-4 text-xs">
                  {/* Customer Info Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{selectedInquiry.name}</span>
                      <button
                        onClick={() => {
                          handleResolveInquiry(selectedInquiry.id, selectedInquiry.status);
                          setSelectedInquiry(prev => ({ ...prev, status: prev.status === 'Pending' ? 'Resolved' : 'Pending' }));
                        }}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-colors ${
                          selectedInquiry.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}
                      >
                        {selectedInquiry.status} (Toggle)
                      </button>
                    </div>
                    
                    <div className="space-y-1 text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        <a href={`mailto:${selectedInquiry.email}`} className="hover:underline font-medium text-slate-700 dark:text-slate-300">{selectedInquiry.email}</a>
                      </p>
                      {selectedInquiry.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          <a href={`tel:${selectedInquiry.phone}`} className="hover:underline font-medium text-slate-700 dark:text-slate-300">{selectedInquiry.phone}</a>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Subject</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-snug">{selectedInquiry.subject}</p>
                  </div>

                  {/* Message Detail */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Message</span>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 leading-relaxed font-normal italic">
                      "{selectedInquiry.message}"
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=RE: ${encodeURIComponent(selectedInquiry.subject || 'MarbleCraft Inquiry')}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Reply Email
                    </a>
                    {selectedInquiry.phone && (
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                      >
                        <Phone className="w-4 h-4" /> Call Lead
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Portfolio Projects CRUD */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-850 dark:text-white">Add Showcase Project</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Project Name"
                  value={projectForm.name}
                  onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                />
                <textarea
                  placeholder="Project Details description..."
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-805 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Location (e.g. Dallas, TX)"
                    value={projectForm.location}
                    onChange={e => setProjectForm({ ...projectForm, location: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl"
                  />
                  <input
                    type="number"
                    placeholder="Completion Year"
                    value={projectForm.year}
                    onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={projectForm.client}
                    onChange={e => setProjectForm({ ...projectForm, client: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl"
                  />
                  <select
                    value={projectForm.categoryId}
                    onChange={e => setProjectForm({ ...projectForm, categoryId: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm px-4 py-3.5 rounded-xl focus:outline-none"
                  >
                    <option value="">Detached Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="border border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center">
                  <input type="file" onChange={handleFileChange} className="hidden" id="project-img" />
                  <label htmlFor="project-img" className="cursor-pointer text-xs text-slate-400 flex flex-col items-center gap-1.5">
                    <Upload className="h-6 w-6 text-blue-600" />
                    {selectedFile ? selectedFile.name : 'Upload Project Image'}
                  </label>
                </div>
                <Button type="submit" variant="primary" loading={submitting} className="w-full">
                  Save Project
                </Button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-850 dark:text-white">Project Showcase List</h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800 pb-3 text-slate-400">
                    <th className="py-2">Project</th>
                    <th className="py-2">Location</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(proj => (
                    <tr key={proj.id} className="border-b border-slate-50 dark:border-slate-800">
                      <td className="py-3 font-bold text-slate-700 dark:text-slate-350">{proj.name}</td>
                      <td className="py-3 text-slate-400">{proj.location} ({proj.year})</td>
                      <td className="py-3 text-right">
                        <button onClick={() => handleDeleteProject(proj.id)} className="text-red-500 hover:text-red-650">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Gallery Showroom Manager */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-850 dark:text-white">Add Showroom Image</h3>
              <form onSubmit={handleCreateGalleryItem} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Image Title"
                  value={galleryForm.title}
                  onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl"
                />
                <textarea
                  placeholder="Image description context..."
                  value={galleryForm.description}
                  onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl"
                />
                <select
                  value={galleryForm.tag}
                  onChange={e => setGalleryForm({ ...galleryForm, tag: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm px-4 py-3.5 rounded-xl focus:outline-none"
                >
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <div className="border border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center">
                  <input type="file" onChange={handleFileChange} className="hidden" id="gallery-img" />
                  <label htmlFor="gallery-img" className="cursor-pointer text-xs text-slate-400 flex flex-col items-center gap-1.5">
                    <Upload className="h-6 w-6 text-blue-600" />
                    {selectedFile ? selectedFile.name : 'Upload Gallery Image'}
                  </label>
                </div>
                <Button type="submit" variant="primary" loading={submitting} className="w-full">
                  Save Item
                </Button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-850 dark:text-white">Active Showroom Files</h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800 pb-3 text-slate-400">
                    <th className="py-2">Title</th>
                    <th className="py-2">Tag</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gallery.map(item => (
                    <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800">
                      <td className="py-3 font-bold text-slate-700 dark:text-slate-350">{item.title}</td>
                      <td className="py-3 text-slate-400">{item.tag}</td>
                      <td className="py-3 text-right">
                        <button onClick={() => handleDeleteGalleryItem(item.id)} className="text-red-500 hover:text-red-650">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Blogs Manager */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-850 dark:text-white">Add Blog Post</h3>
              <form onSubmit={handleCreateBlog} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Article Title"
                  value={blogForm.title}
                  onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl"
                />
                <textarea
                  placeholder="Article Body content..."
                  value={blogForm.content}
                  onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Author"
                    value={blogForm.author}
                    onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl"
                  />
                  <select
                    value={blogForm.status}
                    onChange={e => setBlogForm({ ...blogForm, status: e.target.value })}
                    className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-slate-750 text-sm px-4 py-3.5 rounded-xl"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
                <div className="border border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center">
                  <input type="file" onChange={handleFileChange} className="hidden" id="blog-img" />
                  <label htmlFor="blog-img" className="cursor-pointer text-xs text-slate-400 flex flex-col items-center gap-1.5">
                    <Upload className="h-6 w-6 text-blue-600" />
                    {selectedFile ? selectedFile.name : 'Upload Article Feature Image'}
                  </label>
                </div>
                <Button type="submit" variant="primary" loading={submitting} className="w-full">
                  Publish Post
                </Button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-serif mb-6 text-slate-850 dark:text-white">Blog Articles</h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800 pb-3 text-slate-400">
                    <th className="py-2">Title</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(blog => (
                    <tr key={blog.id} className="border-b border-slate-50 dark:border-slate-800">
                      <td className="py-3 font-bold text-slate-700 dark:text-slate-350">{blog.title}</td>
                      <td className="py-3 text-slate-400">{blog.status}</td>
                      <td className="py-3 text-right">
                        <button onClick={() => handleDeleteBlog(blog.id)} className="text-red-500 hover:text-red-650">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
