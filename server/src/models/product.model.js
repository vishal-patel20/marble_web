import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,  // Primary thumbnail
      allowNull: true,
    },
    images: {
      type: DataTypes.JSONB,   // Array of additional image URLs
      defaultValue: [],
    },
    // Pricing
    pricePerSqft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'price_per_sqft',
    },
    minOrderQty: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 50,
      field: 'min_order_qty',
      comment: 'Minimum order in sq ft',
    },
    // Inventory
    stockQuantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'stock_quantity',
      comment: 'Available area in sq ft',
    },
    // Stone specifications
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Country / region of quarry e.g. Carrara, Italy',
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'e.g. Marble, Granite, Onyx, Quartzite',
    },
    finish: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'e.g. Polished, Honed, Leathered',
    },
    finishes: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'All available finish options',
    },
    thickness: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Thickness in mm',
    },
    slabSize: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'slab_size',
      comment: 'e.g. 3000x1800 mm',
    },
    colorFamily: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'color_family',
      comment: 'e.g. White, Black, Gold, Green',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'meta_title',
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'meta_description',
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    hooks: {
      beforeValidate: (product) => {
        if (product.name && !product.slug) {
          product.slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        }
      },
    },
  }
);

export default Product;
export { Product };
