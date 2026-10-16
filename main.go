package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "modernc.org/sqlite"
	"github.com/automacoescomerciaisintegradas/whatsmiau2/internal/crm"
)

func main() {
	// Abrir banco de dados SQLite com foreign keys ativas
	db, err := sql.Open("sqlite", "./data.db?_foreign_keys=on")
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}
	defer db.Close()

	// Configurar pool de conexões
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	// Inicializar CRM
	crmServer := crm.NewServer(db)

	// Executar migrations
	if err := crmServer.RunMigrations(); err != nil {
		log.Fatal("Failed to run CRM migrations:", err)
	}

	// Criar router HTTP
	mux := http.NewServeMux()

	// Registrar rotas do CRM (/api/crm/leads, /api/crm/leads/stats, /api/crm/messages, /api/crm/payments)
	crmServer.RegisterRoutes(mux)

	// Health check route
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","service":"whatsmiau2-crm"}`))
	})

	// Iniciar servidor
	log.Println("🚀 Server starting on :8081")
	log.Println("📊 CRM available at http://localhost:8081/api/crm/leads")
	log.Println("📈 Stats available at http://localhost:8081/api/crm/leads/stats")

	if err := http.ListenAndServe(":8081", mux); err != nil {
		log.Fatal("Server terminated:", err)
	}
}
