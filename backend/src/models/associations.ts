import { User } from './User';
import { Message } from './Message';
import { Participant } from './Participant';
import { Connection } from './Connection';

export function defineAssociations() {
  User.hasMany(Message, { foreignKey: 'senderId', as: 'userMessages' });
  User.hasMany(Connection, { foreignKey: 'userId', as: 'userConnections' });

  Message.belongsTo(User, { foreignKey: 'senderId', as: 'messageSender' });
  Participant.belongsTo(User, { foreignKey: 'userId', as: 'participantUser' });
  Connection.belongsTo(User, { foreignKey: 'userId', as: 'connectionUser' });
}