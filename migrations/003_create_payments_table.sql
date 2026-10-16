-- 003_create_payments_table.sql
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    provider TEXT NOT NULL DEFAULT 'mercadopago',
    external_id TEXT DEFAULT '',
    amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'refunded'
    payment_method TEXT DEFAULT 'pix',
    qr_code TEXT DEFAULT '',
    qr_code_base64 TEXT DEFAULT '',
    ticket_url TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payments_lead_id ON payments(lead_id);
CREATE INDEX IF NOT EXISTS idx_payments_external_id ON payments(external_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
