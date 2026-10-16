# 🔌 Guia de Integração do CRM Go - WhatsMiau2

## 📦 Estrutura Implementada

```
whatsmiau2/
├── go.mod                                # Módulo Go (github.com/automacoescomerciaisintegradas/whatsmiau2)
├── go.sum                                # Checksums das dependências
├── main.go                               # Ponto de entrada do servidor HTTP (:8081)
├── whatsmiau2-crm.exe                    # Binário executável compilado
├── data.db                               # Banco SQLite com foreign keys ativas
├── migrations/                           # Migrations SQL versionadas
│   ├── 001_create_leads_table.sql
│   ├── 002_create_messages_table.sql
│   ├── 003_create_payments_table.sql
│   ├── 004_create_email_campaigns_table.sql
│   ├── 005_create_templates_table.sql
│   └── 006_create_activities_table.sql
└── internal/crm/                         # Pacote CRM
    ├── server.go                         # Server struct, NewServer, RunMigrations, RegisterRoutes, CORS middleware
    ├── leads.go                          # Lead model, CRUD handlers e Stats (/api/crm/leads)
    ├── messages.go                       # Message model e handlers (/api/crm/messages)
    └── payments.go                       # Payment model e handlers (/api/crm/payments)
```

---

## 🚀 Como Executar

### 1. Iniciar o Servidor
```bash
cd c:\typebot\whatsmiau2
go run main.go
# ou executar o binário direto:
.\whatsmiau2-crm.exe
```

O servidor inicializa na porta `:8081` executando automaticamente todas as migrations pendentes no banco `./data.db?_foreign_keys=on`.

---

## 📡 Endpoints Verificados

### 1. Health Check
```http
GET http://localhost:8081/health
```
**Resposta:**
```json
{"status":"ok","service":"whatsmiau2-crm"}
```

---

### 2. Criar Lead
```http
POST http://localhost:8081/api/crm/leads
Content-Type: application/json

{
  "nome": "Maria Santos",
  "whatsapp": "5511988888888",
  "email": "maria@example.com",
  "empresa": "Tech Solutions",
  "valor": 10000.00,
  "fonte": "google",
  "temperatura": "quente"
}
```
**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "lead": {
    "id": 1,
    "nome": "Maria Santos",
    "whatsapp": "5511988888888",
    "email": "maria@example.com",
    "empresa": "Tech Solutions",
    "valor": 10000,
    "fonte": "google",
    "status": "novo",
    "temperatura": "quente",
    "observacoes": "",
    "created_at": "2026-10-16 15:36:24",
    "updated_at": "2026-10-16 15:36:24"
  }
}
```

---

### 3. Listar Leads (Filtros & Paginação)
```http
GET http://localhost:8081/api/crm/leads
GET http://localhost:8081/api/crm/leads?status=novo
GET http://localhost:8081/api/crm/leads?temperatura=quente
GET http://localhost:8081/api/crm/leads?search=Maria
GET http://localhost:8081/api/crm/leads?limit=10&offset=0
```
**Resposta:**
```json
{
  "success": true,
  "count": 1,
  "leads": [...]
}
```

---

### 4. Buscar Lead por ID
```http
GET http://localhost:8081/api/crm/leads?id=1
```
**Resposta:**
```json
{
  "success": true,
  "lead": { ... }
}
```

---

### 5. Atualizar Lead
```http
PUT http://localhost:8081/api/crm/leads?id=1
Content-Type: application/json

{
  "status": "fechado",
  "observacoes": "Venda concluída!"
}
```
**Resposta:**
```json
{
  "success": true,
  "message": "Lead updated successfully"
}
```

---

### 6. Estatísticas Consolidadas
```http
GET http://localhost:8081/api/crm/leads/stats
```
**Resposta:**
```json
{
  "success": true,
  "stats": {
    "total": 1,
    "novos": 0,
    "em_contato": 0,
    "negociacao": 0,
    "fechados": 1,
    "perdidos": 0,
    "valor_total": 10000.00,
    "conversao": 100.0
  }
}
```

---

### 7. Deletar Lead
```http
DELETE http://localhost:8081/api/crm/leads?id=1
```
**Resposta:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

### 8. Mensagens & Pagamentos Adicionais
- `GET /api/crm/messages?lead_id=1`
- `POST /api/crm/messages` (registra mensagens e activities)
- `GET /api/crm/payments?lead_id=1`
- `POST /api/crm/payments` (registra cobranças PIX Mercado Pago)
