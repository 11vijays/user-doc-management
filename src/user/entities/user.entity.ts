// src/users/entities/user.entity.ts
import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'user_name',
  })
  userName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM('admin', 'editor', 'viewer'),
    allowNull: false,
    defaultValue: 'viewer',
  })
  role: 'admin' | 'editor' | 'viewer';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    field: 'user_id',
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'v1',
  })
  tokenVersion: string;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
}
