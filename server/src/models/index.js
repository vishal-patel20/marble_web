import sequelize from '../config/database.js';
import User from './user.model.js';
import Category from './category.model.js';
import Product from './product.model.js';
import Project from './project.model.js';
import GalleryItem from './gallery.model.js';
import Blog from './blog.model.js';
import Testimonial from './testimonial.model.js';
import Inquiry from './inquiry.model.js';
import FAQ from './faq.model.js';
import BrochureDownload from './brochure.model.js';
import Wishlist from './wishlist.model.js';

// Setup relationships
// 1. Product -> Category
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category', onDelete: 'CASCADE' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

// 2. Project -> Category
Project.belongsTo(Category, { foreignKey: 'categoryId', as: 'category', onDelete: 'SET NULL' });
Category.hasMany(Project, { foreignKey: 'categoryId', as: 'projects' });

// 3. Wishlist -> User, Product
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlistItems' });

Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });
Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlistFor' });

// Compile models
const db = {
  sequelize,
  User,
  Category,
  Product,
  Project,
  GalleryItem,
  Blog,
  Testimonial,
  Inquiry,
  FAQ,
  BrochureDownload,
  Wishlist,
};

export {
  sequelize,
  User,
  Category,
  Product,
  Project,
  GalleryItem,
  Blog,
  Testimonial,
  Inquiry,
  FAQ,
  BrochureDownload,
  Wishlist,
};

export default db;
