const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 1. Company
const Company = sequelize.define('Company', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  plan: { type: DataTypes.STRING, defaultValue: 'free' },
  settings: { type: DataTypes.JSONB, defaultValue: {} }
}, { tableName: 'companies', timestamps: true });

// 2. User
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'agent' },
  avatar: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' },
  online: { type: DataTypes.BOOLEAN, defaultValue: false },
  last_login: { type: DataTypes.DATE }
}, { tableName: 'users', timestamps: true });

// 3. Connection
const Connection = sequelize.define('Connection', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'disconnected' },
  phone: { type: DataTypes.STRING },
  qrcode: { type: DataTypes.TEXT },
  evolution_instance_id: { type: DataTypes.STRING },
  whatsmiau_instance_id: { type: DataTypes.STRING },
  webhook_url: { type: DataTypes.TEXT }
}, { tableName: 'connections', timestamps: true });

// 4. Contact
const Contact = sequelize.define('Contact', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  avatar: { type: DataTypes.TEXT },
  profile_name: { type: DataTypes.STRING },
  is_group: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_fields: { type: DataTypes.JSONB, defaultValue: {} }
}, { tableName: 'contacts', timestamps: true });

// 5. Queue
const Queue = sequelize.define('Queue', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING(7), defaultValue: '#3498db' },
  greeting_message: { type: DataTypes.TEXT },
  order_num: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'queues', timestamps: true });

// 6. Tag
const Tag = sequelize.define('Tag', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING(7), defaultValue: '#3498db' }
}, { tableName: 'tags', timestamps: true });

// 7. Ticket
const Ticket = sequelize.define('Ticket', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, open, closed
  is_group: { type: DataTypes.BOOLEAN, defaultValue: false },
  unread_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  last_message: { type: DataTypes.TEXT },
  last_message_at: { type: DataTypes.DATE },
  closed_at: { type: DataTypes.DATE }
}, { tableName: 'tickets', timestamps: true });

// 8. Message
const Message = sequelize.define('Message', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  body: { type: DataTypes.TEXT },
  media_url: { type: DataTypes.TEXT },
  media_type: { type: DataTypes.STRING },
  from_me: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  wpp_message_id: { type: DataTypes.STRING },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  ack: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'messages', timestamps: true });

// 9. AIAgent
const AIAgent = sequelize.define('AIAgent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  system_prompt: { type: DataTypes.TEXT, allowNull: false },
  model: { type: DataTypes.STRING, defaultValue: 'gpt-4o-mini' },
  temperature: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.7 },
  max_tokens: { type: DataTypes.INTEGER, defaultValue: 1000 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'ai_agents', timestamps: true });

// Associations
Company.hasMany(User, { foreignKey: 'company_id' });
User.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(Connection, { foreignKey: 'company_id' });
Connection.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(Contact, { foreignKey: 'company_id' });
Contact.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(Ticket, { foreignKey: 'company_id' });
Ticket.belongsTo(Company, { foreignKey: 'company_id' });

Contact.hasMany(Ticket, { foreignKey: 'contact_id' });
Ticket.belongsTo(Contact, { foreignKey: 'contact_id' });

User.hasMany(Ticket, { foreignKey: 'user_id' });
Ticket.belongsTo(User, { foreignKey: 'user_id' });

Connection.hasMany(Ticket, { foreignKey: 'connection_id' });
Ticket.belongsTo(Connection, { foreignKey: 'connection_id' });

Queue.hasMany(Ticket, { foreignKey: 'queue_id' });
Ticket.belongsTo(Queue, { foreignKey: 'queue_id' });

Ticket.hasMany(Message, { foreignKey: 'ticket_id' });
Message.belongsTo(Ticket, { foreignKey: 'ticket_id' });

Contact.hasMany(Message, { foreignKey: 'contact_id' });
Message.belongsTo(Contact, { foreignKey: 'contact_id' });

Company.hasMany(AIAgent, { foreignKey: 'company_id' });
AIAgent.belongsTo(Company, { foreignKey: 'company_id' });

module.exports = {
  sequelize,
  Company,
  User,
  Connection,
  Contact,
  Queue,
  Tag,
  Ticket,
  Message,
  AIAgent
};
