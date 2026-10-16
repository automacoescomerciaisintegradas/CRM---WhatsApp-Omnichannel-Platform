-- 005_create_templates_table.sql
CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'whatsapp', -- 'whatsapp', 'email', 'pix'
    content TEXT NOT NULL,
    variables TEXT DEFAULT '[]', -- JSON array of variable names
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
