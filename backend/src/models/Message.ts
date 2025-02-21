import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'messages', timestamps: true })
export class Message extends Model {
  @Column({ type: DataType.TEXT, allowNull: false })
  text!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  senderId!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  receiverId!: number | null;

  @BelongsTo(() => User, { as: 'messageAuthor' }) 
  sender!: User;

  @BelongsTo(() => User, { as: 'messageRecipient' }) 
  receiver!: User | null;
}