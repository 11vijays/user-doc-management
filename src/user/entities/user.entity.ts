import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'user_name',
  })
  userName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  lastName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.ENUM('admin', 'editor', 'viewer'),
    allowNull: false,
    defaultValue: 'viewer',
  })
  role!: 'admin' | 'editor' | 'viewer';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  tokenVersion!: number;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    const plainPassword = user.getDataValue('password');
    if (!plainPassword) return;

    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      user.setDataValue('password', hashedPassword);
    }
  }
}
