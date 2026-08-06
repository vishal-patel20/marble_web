import React, { useState, useEffect } from 'react';
import { Layers, X, Info } from 'lucide-react';
import axiosInstance from '../api/axiosInstance.js';
import Skeleton from '../components/ui/Skeleton.jsx';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const tags = ['', 'Kitchen', 'Bathroom', 'Living Room', 'Commercial'];

  const FALLBACK_GALLERY = [
    {
      id: 'g-1',
      title: 'Calacatta Gold Luxury Kitchen Island',
      description: 'Bespoke waterfall kitchen island clad in polished Calacatta Gold Supreme marble veining.',
      tag: 'Kitchen',
      image: '/images/stone_image_1.jpg'
    },
    {
      id: 'g-2',
      title: 'Nero Marquina Executive Master Bath',
      description: 'Deep black Spanish Nero Marquina marble with crisp white geometric calcite veining.',
      tag: 'Bathroom',
      image: '/images/stone_image_2.jpg'
    },
    {
      id: 'g-3',
      title: 'Royal Blue Onyx Backlit Wall Feature',
      description: 'Dramatic translucent backlit Royal Blue Onyx statement wall in modern penthouse foyer.',
      tag: 'Living Room',
      image: '/images/stone_image_3.jpg'
    },
    {
      id: 'g-4',
      title: 'Statuario Extra White Grand Lobby Floor',
      description: 'Italian Statuario marble flooring with broad graphite veining for commercial headquarters.',
      tag: 'Commercial',
      image: '/images/stone_image_4.jpg'
    },
    {
      id: 'g-5',
      title: 'Verde Guatemala Emerald Dining Nook',
      description: 'Deep rainforest green serpentine marble table top with honed antique patina finish.',
      tag: 'Kitchen',
      image: '/images/stone_image_5.jpg'
    },
    {
      id: 'g-6',
      title: 'Pietra Grey Minimalist Vanity Basin',
      description: 'Seamless charcoal grey Persian marble vanity integrated with brushed bronze brassware.',
      tag: 'Bathroom',
      image: '/images/stone_image_6.jpg'
    }
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedTag) params.tag = selectedTag;
        const res = await axiosInstance.get('/misc/gallery', { params });
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        if (data.length > 0) {
          setItems(data);
        } else {
          const filteredFallback = selectedTag
            ? FALLBACK_GALLERY.filter((i) => i.tag.toLowerCase() === selectedTag.toLowerCase())
            : FALLBACK_GALLERY;
          setItems(filteredFallback);
        }
      } catch (err) {
        console.error('Gallery loading failed', err);
        const filteredFallback = selectedTag
          ? FALLBACK_GALLERY.filter((i) => i.tag.toLowerCase() === selectedTag.toLowerCase())
          : FALLBACK_GALLERY;
        setItems(filteredFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [selectedTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold font-serif text-slate-800 dark:text-white">Design Showroom</h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Get inspired by luxury spaces cladding our premium Italian marbles, exotic granites, and luminous onyx slabs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
              selectedTag === tag
                ? 'bg-gold-400 border-gold-400 text-slate-950 shadow-md'
                : 'bg-white border-slate-100 hover:border-gold-400 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            {tag === '' ? 'All Spaces' : tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton count={3} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
          <Layers className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">No items found</h3>
          <p className="text-sm text-slate-400">We will add new visual references for this category shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative cursor-pointer aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-850"
            >
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-6 text-white" >
                <span className="text-gold-400 font-semibold tracking-wider text-[10px] uppercase mb-1">{item.tag}</span>
                <h4 className="text-base font-bold font-serif leading-tight">{item.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-1 leading-relaxed">{item.description}</p>
              </div>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Full-screen Lightbox overlay */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="max-w-4xl w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative">
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full max-h-[70vh] object-contain mx-auto"
            />
            <div className="p-6 bg-slate-950 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-gold-400 font-semibold tracking-wider text-xs uppercase">{selectedImage.tag}</span>
                <h3 className="text-xl font-bold font-serif mt-1">{selectedImage.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedImage.description}</p>
              </div>
              <a
                href={`https://wa.me/919057283248?text=Hello,%20I%20like%20your%20design%20installation%20reference:%20${selectedImage.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-400 hover:bg-gold-500 text-slate-950 text-xs tracking-wider uppercase font-semibold px-5 py-3 rounded-full transition-colors flex items-center shrink-0"
              >
                Inquire Space design
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
