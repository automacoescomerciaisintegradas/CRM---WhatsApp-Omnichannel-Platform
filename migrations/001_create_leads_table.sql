-- 001_create_leads_table.sql
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    whatsapp TEXT NOT NULL UNIQUE,
    email TEXT DEFAULT '',
    empresa TEXT DEFAULT '',
    valor REAL DEFAULT 0.0,
    fonte TEXT DEFAULT 'whatsapp',
    status TEXT DEFAULT 'novo',
    temperatura TEXT DEFAULT 'morno',
    observacoes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON leads(whatsapp);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_temperatura ON leads(temperatura);
