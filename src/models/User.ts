import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelizeInstance from '../../config/database';

//Define the attibutes for the User Model

interface UserAttribures {
  id?: string; //UUID
  email: string;
  passwordHash: string;
  role: 'shopper' | 'admin';
  //createdAt and updatedAt are handled by Sequelize timestamp
}

class User extends Model<UserAttribures> implements UserAttribures {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: 'shopper' | 'admin';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      // As per PRD: role: enum { "shopper", "admin" } [cite: 9]
      type: DataTypes.ENUM('shopper', 'admin'),
      allowNull: false,
      defaultValue: 'shopper', // Default role for new users
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;
