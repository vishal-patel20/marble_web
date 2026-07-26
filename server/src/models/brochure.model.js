import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class BrochureDownload extends Model {}

BrochureDownload.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brochureType: {
      type: DataTypes.STRING, // e.g. 'Italian Slabs Collection', 'Granite Catalogs'
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BrochureDownload',
    tableName: 'brochure_downloads',
    timestamps: true,
    updatedAt: false, // Only tracks the initial download log creation timestamp
  }
);

export default BrochureDownload;
export { BrochureDownload };
