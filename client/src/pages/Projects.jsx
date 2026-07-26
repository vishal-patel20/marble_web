import React, { useState, useEffect } from 'react';
import { Award, MapPin, Calendar, User } from 'lucide-react';
import axiosInstance from '../api/axiosInstance.js';
import Skeleton from '../components/ui/Skeleton.jsx';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await axiosInstance.get('/inventory/categories');
        setCategories(catRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCat) params.category = selectedCat;
        const res = await axiosInstance.get('/misc/projects', { params });
        setProjects(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedCat]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold font-serif text-slate-800 dark:text-white">Our Creations</h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Explore customized stone installations cladding landmark private residences, hotels, lobbies, and premium corporate offices.
        </p>
      </div>

      {/* Categories filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => setSelectedCat('')}
          className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border ${
            selectedCat === ''
              ? 'bg-gold-400 border-gold-400 text-slate-950 shadow-sm'
              : 'bg-white border-slate-100 hover:border-gold-400 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
          }`}
        >
          All Collections
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border ${
              selectedCat === cat.id
                ? 'bg-gold-400 border-gold-400 text-slate-950 shadow-sm'
                : 'bg-white border-slate-100 hover:border-gold-400 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton count={2} />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
          <Award className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">No projects listed</h3>
          <p className="text-sm text-slate-400">Portfolio showcases for this category will be uploaded shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project) => (
            <div key={project.id} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <div className="p-8 space-y-4">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1.5 text-gold-400" />{project.location}</span>
                  <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1.5 text-gold-400" />{project.year}</span>
                  {project.client && (
                    <span className="flex items-center"><User className="h-3.5 w-3.5 mr-1.5 text-gold-400" />{project.client}</span>
                  )}
                </div>

                <h3 className="text-xl font-bold font-serif text-slate-800 dark:text-white group-hover:text-gold-400 transition-colors">
                  {project.name}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {project.description}
                </p>

                {project.category && (
                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Stones Leveraged</span>
                    <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">{project.category.name}</span>
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
