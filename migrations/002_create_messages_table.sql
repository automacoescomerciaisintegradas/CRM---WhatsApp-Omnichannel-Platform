-- 002_create_messages_table.sql
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    direction TEXT NOT NULL, -- 'inbound' or 'outbound'
    type TEXT NOT NULL DEFAULT 'text', -- 'text', 'audio', 'video', 'document', 'image'
    content TEXT DEFAULT '',
    media_url TEXT DEFAULT '',
    status TEXT DEFAULT 'sent', -- 'pending', 'sent', 'delivered', 'read', 'failed'
    external_id TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON messages(lead_id);
