import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'participants', timestamps: true })
export class Participant extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User, { as: 'participantUser' })
  user!: User;

  @Column({ type: DataType.DATE, allowNull: true })
  joinedAt!: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;
}