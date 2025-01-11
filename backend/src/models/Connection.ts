import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'connections', timestamps: true })
export class Connection extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User, { as: 'connectiontUser' }) 
  user!: User;

  @Column({ type: DataType.DATE, allowNull: true })
  connectedAt!: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;
}
