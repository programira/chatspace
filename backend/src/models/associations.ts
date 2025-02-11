import { User } from './User';
import { Message } from './Message';
import { Participant } from './Participant';
import { Connection } from './Connection';

export function defineAssociations() {
  // User.hasMany(Message, { foreignKey: 'userId', as: 'userMessages' });
  User.hasMany(Connection, { foreignKey: 'userId', as: 'userConnections' });

  Message.belongsTo(User, { foreignKey: 'senderId', as: 'messageSender' });
  Message.belongsTo(User, { foreignKey: 'receiverId', as: 'messageReceiver' });
  Participant.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Connection.belongsTo(User, { foreignKey: 'userId', as: 'connectionUser' });
}