import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Inquiry extends Model {}

Inquiry.init(
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
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Read', 'Resolved'),
      defaultValue: 'Pending',
    },
  },
  {
    sequelize,
    modelName: 'Inquiry',
    tableName: 'inquiries',
    timestamps: true,
  }
);

sequelize.query('ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS image TEXT;').catch(() => {});
sequelize.query('ALTER TABLE inquiries ALTER COLUMN image TYPE TEXT;').catch(() => {});

export default Inquiry;
export { Inquiry };
