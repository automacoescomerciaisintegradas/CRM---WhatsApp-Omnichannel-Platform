-- 004_create_email_campaigns_table.sql
CREATE TABLE IF NOT EXISTS email_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    provider TEXT NOT NULL DEFAULT 'resend',
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'opened', 'failed'
    resend_id TEXT DEFAULT '',
    error_message TEXT DEFAULT '',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_lead ON email_campaigns(lead_id);
