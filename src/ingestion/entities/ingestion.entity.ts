import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { IngestionStatus } from '../dto/create-ingestion.dto';

@Table({
  tableName: 'ingestion_processes',
  timestamps: true,
  underscored: true,
})
export class IngestionProcess extends Model<IngestionProcess> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  source!: string;

  @Column({
    type: DataType.ENUM(...Object.values(IngestionStatus)),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: 'pending' | 'in_progress' | 'completed' | 'failed';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resultMessage?: string;
}
