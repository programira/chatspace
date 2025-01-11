import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { Message } from '../models/Message';
import { Participant } from '../models/Participant';
import { Connection } from '../models/Connection';
import { defineAssociations } from '../models/associations';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  username: process.env.DATABASE_USER || 'programira',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'chatspace',
  logging: false,
  models: [User, Message, Participant, Connection], // Register all models here
});

 defineAssociations(); // Define associations between models

export default sequelize;
