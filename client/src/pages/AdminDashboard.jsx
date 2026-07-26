import React, { useState, useEffect } from 'react';
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
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance.js';
import Button from '../components/ui/Button.jsx';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Database Data lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [blogs, setBlogs] = useState([]);

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
    const res = await axiosInstance.get('/inventory/products?limit=100');
    setProducts(res.data.data.products);
  };
  const fetchCategories = async () => {
    const res = await axiosInstance.get('/inventory/categories');
    setCategories(res.data.data);
  };
  const fetchInquiries = async () => {
    const res = await axiosInstance.get('/leads/inquiries');
    setInquiries(res.data.data);
  };
  const fetchProjects = async () => {
    const res = await axiosInstance.get('/misc/projects');
    setProjects(res.data.data);
  };
  const fetchGallery = async () => {
    const res = await axiosInstance.get('/misc/gallery');
    setGallery(res.data.data);
  };
  const fetchBlogs = async () => {
    const res = await axiosInstance.get('/misc/blogs?status=');
    setBlogs(res.data.data);
  };

  useEffect(() => {
    fetchProducts().catch(console.error);
    fetchCategories().catch(console.error);
    fetchInquiries().catch(console.error);
    fetchProjects().catch(console.error);
    fetchGallery().catch(console.error);
    fetchBlogs().catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Backoffice Admin</div>
          
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', name: 'Products Slabs', icon: Gem },
              { id: 'categories', name: 'Categories', icon: FolderOpen },
              { id: 'inquiries', name: 'Inquiries leads', icon: MessageSquare },
              { id: 'projects', name: 'Portfolio Projects', icon: FolderOpen },
              { id: 'gallery', name: 'Gallery Showroom', icon: Image },
              { id: 'blogs', name: 'Blogs', icon: BookOpen },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedFile(null); }}
                className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gold-400 text-slate-950 shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon className="h-4.5 w-4.5 mr-3 shrink-0" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        
        {/* Tab 1: Dashboard Analytics */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <h2 className="text-3xl font-extrabold font-serif text-slate-800 dark:text-white">Workspace Analytics</h2>
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Total Products</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{products.length}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Categories</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{categories.length}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Inquiries</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{inquiries.length}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Portfolio installs</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{projects.length}</span>
              </div>
            </div>

            {/* Recent inquiries */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8">
              <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-white mb-6">Recent Customer Leads</h3>
              <div className="space-y-4">
                {inquiries.slice(0, 5).map(inq => (
                  <div key={inq.id} className="flex justify-between items-start border-b border-slate-50 dark:border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{inq.name} ({inq.email})</span>
                      <p className="text-xs text-slate-400 mt-1">{inq.subject}</p>
                      <p className="text-xs text-slate-500 italic mt-0.5">"{inq.message}"</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                      inq.status === 'Resolved' ? 'bg-green-150/10 text-green-600' : 'bg-yellow-150/10 text-yellow-600'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                ))}
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
                    <Upload className="h-6 w-6 text-gold-400" />
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
                      <td className="py-3.5 font-semibold">${parseFloat(prod.price).toFixed(2)}</td>
                      <td className="py-3.5 text-slate-400">{prod.stock} slabs</td>
                      <td className="py-3.5 text-right">
                        <button onClick={() => handleDeleteProduct(prod.id)} className="text-red-500 hover:text-red-600">
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
                    <Upload className="h-6 w-6 text-gold-400" />
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
                      <button onClick={() => handleDeleteInquiry(inq.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    <Upload className="h-6 w-6 text-gold-400" />
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
                    <Upload className="h-6 w-6 text-gold-400" />
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
                    <Upload className="h-6 w-6 text-gold-400" />
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
