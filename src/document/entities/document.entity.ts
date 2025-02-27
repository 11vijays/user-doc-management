import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table({ tableName: 'document', timestamps: true, underscored: true })
export class Document extends Model<Document> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'file_url' })
  fileUrl: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;
}
