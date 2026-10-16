-- 007_create_subscriptions_and_plans.sql
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    interval_days INTEGER NOT NULL DEFAULT 30,
    grace_period_days INTEGER NOT NULL DEFAULT 2,
    max_instances INTEGER NOT NULL DEFAULT 1,
    max_messages_month INTEGER NOT NULL DEFAULT 5000,
    features TEXT DEFAULT '{}',
    vip_group_jid TEXT DEFAULT '',
    active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    lead_id INTEGER,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'grace_period', 'past_due', 'canceled'
    current_period_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    current_period_end DATETIME,
    grace_until DATETIME,
    api_key TEXT NOT NULL UNIQUE,
    auto_renew INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    FOREIGN KEY(plan_id) REFERENCES plans(id)
);

CREATE TABLE IF NOT EXISTS subscription_invoices (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'expired', 'refunded'
    gateway_provider TEXT NOT NULL DEFAULT 'mercadopago',
    external_transaction_id TEXT DEFAULT '',
    pix_qr_code TEXT DEFAULT '',
    pix_qr_code_base64 TEXT DEFAULT '',
    due_date DATETIME,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_subscription_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'ACCESS_GRANTED', 'GRACE_WARNING', 'ACCESS_REVOKED', 'GROUP_REMOVED', 'REACTIVATED'
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subs_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subs_api_key ON subscriptions(api_key);
CREATE INDEX IF NOT EXISTS idx_invoices_sub ON subscription_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_ext ON subscription_invoices(external_transaction_id);

-- Inserir planos padrão se não existirem
INSERT OR IGNORE INTO plans (id, name, price, interval_days, grace_period_days, max_instances, max_messages_month, features, active)
VALUES 
('plan_starter', 'Starter WhatsApp API', 97.00, 30, 2, 1, 3000, '{"webhooks": true, "auto_notifications": true}', 1),
('plan_pro', 'Pro Omnichannel & PIX', 197.00, 30, 2, 3, 15000, '{"webhooks": true, "auto_notifications": true, "ai_agent": true, "priority_support": true}', 1),
('plan_enterprise', 'Enterprise High-Scale', 497.00, 30, 3, 10, 100000, '{"webhooks": true, "auto_notifications": true, "ai_agent": true, "multi_agent": true, "sla_vip": true}', 1);
