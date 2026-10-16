// Package crm provides the CRM core server, migrations, and handlers for WhatsMiau2.
package crm

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// Server holds the database connection and configuration for the CRM.
type Server struct {
	db *sql.DB
}

// NewServer initializes and returns a new CRM Server instance.
func NewServer(db *sql.DB) *Server {
	return &Server{
		db: db,
	}
}

// RunMigrations executes all .sql migration files in the migrations directory.
func (s *Server) RunMigrations() error {
	// Find migrations directory: check ./migrations or ../migrations
	possibleDirs := []string{
		"migrations",
		filepath.Join(".", "migrations"),
		filepath.Join("..", "migrations"),
		filepath.Join("whatsmiau2", "migrations"),
	}

	var migrationsDir string
	for _, dir := range possibleDirs {
		if stat, err := os.Stat(dir); err == nil && stat.IsDir() {
			migrationsDir = dir
			break
		}
	}

	if migrationsDir == "" {
		log.Println("[CRM] Warning: migrations directory not found, executing embedded fallback migrations")
		return s.runEmbeddedMigrations()
	}

	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		return fmt.Errorf("failed to read migrations dir: %w", err)
	}

	var sqlFiles []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".sql") {
			sqlFiles = append(sqlFiles, entry.Name())
		}
	}
	sort.Strings(sqlFiles)

	for _, file := range sqlFiles {
		filePath := filepath.Join(migrationsDir, file)
		content, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("failed to read %s: %w", file, err)
		}

		log.Printf("[CRM] Running migration: %s\n", file)
		if _, err := s.db.Exec(string(content)); err != nil {
			// If already exists, ignore error
			if strings.Contains(strings.ToLower(err.Error()), "already exists") {
				log.Printf("[CRM] Table already exists in %s, skipping.\n", file)
				continue
			}
			return fmt.Errorf("migration %s failed: %w", file, err)
		}
	}

	log.Println("[CRM] All migrations completed successfully.")
	return nil
}

// runEmbeddedMigrations runs embedded SQL statements if directory is missing.
func (s *Server) runEmbeddedMigrations() error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS leads (
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
		);`,
		`CREATE TABLE IF NOT EXISTS messages (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			lead_id INTEGER NOT NULL,
			direction TEXT NOT NULL,
			type TEXT NOT NULL DEFAULT 'text',
			content TEXT DEFAULT '',
			media_url TEXT DEFAULT '',
			status TEXT DEFAULT 'sent',
			external_id TEXT DEFAULT '',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE CASCADE
		);`,
		`CREATE TABLE IF NOT EXISTS payments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			lead_id INTEGER NOT NULL,
			provider TEXT NOT NULL DEFAULT 'mercadopago',
			external_id TEXT DEFAULT '',
			amount REAL NOT NULL,
			status TEXT NOT NULL DEFAULT 'pending',
			payment_method TEXT DEFAULT 'pix',
			qr_code TEXT DEFAULT '',
			qr_code_base64 TEXT DEFAULT '',
			ticket_url TEXT DEFAULT '',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE CASCADE
		);`,
		`CREATE TABLE IF NOT EXISTS email_campaigns (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			lead_id INTEGER,
			provider TEXT NOT NULL DEFAULT 'resend',
			recipient_email TEXT NOT NULL,
			subject TEXT NOT NULL,
			status TEXT NOT NULL DEFAULT 'pending',
			resend_id TEXT DEFAULT '',
			error_message TEXT DEFAULT '',
			sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE SET NULL
		);`,
		`CREATE TABLE IF NOT EXISTS templates (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			category TEXT NOT NULL DEFAULT 'whatsapp',
			content TEXT NOT NULL,
			variables TEXT DEFAULT '[]',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS activities (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			lead_id INTEGER NOT NULL,
			type TEXT NOT NULL,
			description TEXT NOT NULL,
			metadata TEXT DEFAULT '{}',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE CASCADE
		);`,
	}

	for i, q := range queries {
		if _, err := s.db.Exec(q); err != nil {
			return fmt.Errorf("embedded migration %d failed: %w", i+1, err)
		}
	}
	return nil
}

// RegisterRoutes registers all CRM endpoints onto the given HTTP ServeMux.
func (s *Server) RegisterRoutes(mux *http.ServeMux) {
	// Leads CRUD
	mux.HandleFunc("/api/crm/leads", s.withCORS(s.HandleLeads))
	mux.HandleFunc("/api/crm/leads/stats", s.withCORS(s.HandleLeadStats))

	// Messages & Payments
	mux.HandleFunc("/api/crm/messages", s.withCORS(s.HandleMessages))
	mux.HandleFunc("/api/crm/payments", s.withCORS(s.HandlePayments))

	// Subscriptions & Plans (SaaS Monetization)
	mux.HandleFunc("/api/v1/plans", s.withCORS(s.HandlePlans))
	mux.HandleFunc("/api/v1/subscription/me", s.withCORS(s.HandleSubscriptionMe))
	mux.HandleFunc("/api/v1/subscriptions", s.withCORS(s.HandleSubscriptionsList))
	mux.HandleFunc("/api/v1/subscription/checkout", s.withCORS(s.HandleSubscriptionCheckout))
	mux.HandleFunc("/api/v1/subscriptions/action", s.withCORS(s.HandleSubscriptionsAction))

	// Payment Webhooks (Mercado Pago / Gateway)
	mux.HandleFunc("/api/v1/webhooks/mercadopago", s.withCORS(s.HandlePaymentWebhook))
	mux.HandleFunc("/webhook/payment", s.withCORS(s.HandlePaymentWebhook))

	// WhatsApp Transactional API (Exact curl specs)
	mux.HandleFunc("/api/actions/sendMessage", s.withCORS(s.HandleActionSendMessage))
	mux.HandleFunc("/message/sendText", s.withCORS(s.HandleMessageSendText))
}

// withCORS is a middleware that injects CORS headers and handles preflight OPTIONS requests.
func (s *Server) withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}
