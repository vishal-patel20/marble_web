import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class GalleryItem extends Model {}

GalleryItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag: {
      type: DataTypes.ENUM('Kitchen', 'Bathroom', 'Living Room', 'Outdoor', 'Commercial'),
      defaultValue: 'Kitchen',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'GalleryItem',
    tableName: 'gallery_items',
    timestamps: true,
  }
);

export default GalleryItem;
export { GalleryItem };
