const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { sequelize, Company, User, Connection, Contact, Ticket, Message, AIAgent } = require('./models');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'whatsmiau2_super_secret_jwt_2026';

app.use(cors());
app.use(express.json());

// Socket.io injection middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ==============================================================================
// AUTHENTICATION MIDDLEWARE
// ==============================================================================
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token nao fornecido' });

  const [, token] = authHeader.split(' ');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.companyId = decoded.companyId;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalido ou expirado' });
  }
};

// ==============================================================================
// ROTAS DE AUTENTICACAO
// ==============================================================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha sao obrigatorios' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Credenciais invalidas' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Credenciais invalidas' });
  }

  const token = jwt.sign(
    { id: user.id, companyId: user.company_id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_id: user.company_id
    }
  });
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.userId, {
    attributes: ['id', 'name', 'email', 'role', 'avatar', 'company_id']
  });
  return res.json({ user });
});

// ==============================================================================
// ROTAS DO DASHBOARD & METRICAS
// ==============================================================================
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  const [totalTickets, openTickets, totalContacts, totalConnections] = await Promise.all([
    Ticket.count({ where: { company_id: req.companyId } }),
    Ticket.count({ where: { company_id: req.companyId, status: 'open' } }),
    Contact.count({ where: { company_id: req.companyId } }),
    Connection.count({ where: { company_id: req.companyId } })
  ]);

  return res.json({
    totalTickets,
    openTickets,
    pendingTickets: totalTickets - openTickets,
    totalContacts,
    totalConnections
  });
});

// ==============================================================================
// ROTAS DE TICKETS & ATENDIMENTO
// ==============================================================================
app.get('/api/tickets', authMiddleware, async (req, res) => {
  const tickets = await Ticket.findAll({
    where: { company_id: req.companyId },
    include: [{ model: Contact }, { model: User, attributes: ['id', 'name', 'avatar'] }],
    order: [['updated_at', 'DESC']]
  });
  return res.json(tickets);
});

app.post('/api/tickets', authMiddleware, async (req, res) => {
  const { contact_id, status } = req.body;
  const ticket = await Ticket.create({
    company_id: req.companyId,
    contact_id,
    user_id: req.userId,
    status: status || 'open'
  });

  const fullTicket = await Ticket.findByPk(ticket.id, {
    include: [{ model: Contact }]
  });

  io.emit('ticket:created', fullTicket);
  return res.status(201).json(fullTicket);
});

app.put('/api/tickets/:id/close', authMiddleware, async (req, res) => {
  const ticket = await Ticket.findOne({
    where: { id: req.params.id, company_id: req.companyId }
  });
  if (!ticket) return res.status(404).json({ error: 'Ticket nao encontrado' });

  ticket.status = 'closed';
  ticket.closed_at = new Date();
  await ticket.save();

  io.emit('ticket:updated', ticket);
  return res.json(ticket);
});

// ==============================================================================
// ROTAS DE MENSAGENS
// ==============================================================================
app.get('/api/tickets/:id/messages', authMiddleware, async (req, res) => {
  const messages = await Message.findAll({
    where: { ticket_id: req.params.id },
    order: [['timestamp', 'ASC']]
  });
  return res.json(messages);
});

app.post('/api/tickets/:id/messages', authMiddleware, async (req, res) => {
  const { body, media_url, media_type } = req.body;
  const ticket = await Ticket.findOne({
    where: { id: req.params.id, company_id: req.companyId }
  });
  if (!ticket) return res.status(404).json({ error: 'Ticket nao encontrado' });

  const msg = await Message.create({
    ticket_id: ticket.id,
    contact_id: ticket.contact_id,
    body,
    media_url,
    media_type,
    from_me: true,
    timestamp: new Date(),
    ack: 1
  });

  ticket.last_message = body;
  ticket.last_message_at = new Date();
  await ticket.save();

  io.emit('message:created', msg);
  io.emit('ticket:updated', ticket);

  return res.status(201).json(msg);
});

// ==============================================================================
// ROTAS DE CONTATOS / LEADS
// ==============================================================================
app.get('/api/contacts', authMiddleware, async (req, res) => {
  const contacts = await Contact.findAll({
    where: { company_id: req.companyId },
    order: [['createdAt', 'DESC']]
  });
  return res.json(contacts);
});

app.post('/api/contacts', authMiddleware, async (req, res) => {
  const { name, phone, email, custom_fields } = req.body;
  if (!phone) return res.status(400).json({ error: 'Telefone obrigatorio' });

  const contact = await Contact.create({
    company_id: req.companyId,
    name: name || 'Lead WhatsApp',
    phone: phone.replace(/\D/g, ''),
    email,
    custom_fields: custom_fields || {}
  });

  return res.status(201).json(contact);
});

// ==============================================================================
// ROTAS DE CONEXOES WHATSAPP (EVOLUTION API / WHATSMIAU)
// ==============================================================================
app.get('/api/connections', authMiddleware, async (req, res) => {
  const connections = await Connection.findAll({
    where: { company_id: req.companyId },
    order: [['createdAt', 'DESC']]
  });
  return res.json(connections);
});

// ==============================================================================
// ROTAS DE AGENTES DE IA (AI AGENTS)
// ==============================================================================
app.get('/api/ai-agents', authMiddleware, async (req, res) => {
  const agents = await AIAgent.findAll({
    where: { company_id: req.companyId }
  });
  return res.json(agents);
});

app.post('/api/ai-agents', authMiddleware, async (req, res) => {
  const { name, description, system_prompt, model, temperature } = req.body;
  const agent = await AIAgent.create({
    company_id: req.companyId,
    name,
    description,
    system_prompt,
    model: model || 'gpt-4o-mini',
    temperature: temperature || 0.7
  });
  return res.status(201).json(agent);
});

// ==============================================================================
// HEALTH & AUTO-INIT
// ==============================================================================
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'whatsmiau2-backend', timestamp: new Date() });
});

// WebSocket Connection Events
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);

  socket.on('joinTicket', (ticketId) => {
    socket.join(`ticket:${ticketId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

async function initServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL (banco crm) estabelecida com sucesso.');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados com o banco de dados.');

    // Seed inicial: Empresa e Usuário Admin padrão
    const [company] = await Company.findOrCreate({
      where: { name: 'ACI Automações Comerciais' },
      defaults: { plan: 'enterprise' }
    });

    const defaultAdminEmail = 'automacoescomerciais@gmail.com';
    const adminUser = await User.findOne({ where: { email: defaultAdminEmail } });
    if (!adminUser) {
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({
        company_id: company.id,
        name: 'Administrador ACI',
        email: defaultAdminEmail,
        password_hash: hash,
        role: 'admin',
        status: 'active'
      });
      console.log(`👤 Usuário administrador inicial criado: ${defaultAdminEmail} (senha: admin123)`);
    }

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 WhatsMiau2 CRM Backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro fatal ao iniciar o backend:', err);
    process.exit(1);
  }
}

initServer();
