package crm

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Lead represents a prospect or customer record in the CRM.
type Lead struct {
	ID          int64   `json:"id"`
	Nome        string  `json:"nome"`
	Whatsapp    string  `json:"whatsapp"`
	Email       string  `json:"email"`
	Empresa     string  `json:"empresa"`
	Valor       float64 `json:"valor"`
	Fonte       string  `json:"fonte"`
	Status      string  `json:"status"`
	Temperatura string  `json:"temperatura"`
	Observacoes string  `json:"observacoes"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}

// StatsResponse represents aggregated metrics for leads.
type StatsResponse struct {
	Total      int     `json:"total"`
	Novos      int     `json:"novos"`
	EmContato  int     `json:"em_contato"`
	Negociacao int     `json:"negociacao"`
	Fechados   int     `json:"fechados"`
	Perdidos   int     `json:"perdidos"`
	ValorTotal float64 `json:"valor_total"`
	Conversao  float64 `json:"conversao"`
}

// HandleLeads routes GET, POST, PUT, DELETE for /api/crm/leads.
func (s *Server) HandleLeads(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		idStr := r.URL.Query().Get("id")
		if idStr != "" {
			s.getLeadByID(w, r, idStr)
			return
		}
		s.listLeads(w, r)

	case http.MethodPost:
		s.createLead(w, r)

	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, `{"success":false,"error":"missing lead id"}`, http.StatusBadRequest)
			return
		}
		s.updateLead(w, r, idStr)

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, `{"success":false,"error":"missing lead id"}`, http.StatusBadRequest)
			return
		}
		s.deleteLead(w, r, idStr)

	default:
		http.Error(w, `{"success":false,"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func (s *Server) createLead(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Nome        string  `json:"nome"`
		Whatsapp    string  `json:"whatsapp"`
		Email       string  `json:"email"`
		Empresa     string  `json:"empresa"`
		Valor       float64 `json:"valor"`
		Fonte       string  `json:"fonte"`
		Status      string  `json:"status"`
		Temperatura string  `json:"temperatura"`
		Observacoes string  `json:"observacoes"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusBadRequest)
		return
	}

	if payload.Nome == "" || payload.Whatsapp == "" {
		http.Error(w, `{"success":false,"error":"nome and whatsapp are required"}`, http.StatusBadRequest)
		return
	}

	if payload.Status == "" {
		payload.Status = "novo"
	}
	if payload.Temperatura == "" {
		payload.Temperatura = "morno"
	}
	if payload.Fonte == "" {
		payload.Fonte = "whatsapp"
	}

	query := `INSERT INTO leads (nome, whatsapp, email, empresa, valor, fonte, status, temperatura, observacoes, created_at, updated_at)
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`

	res, err := s.db.Exec(query, payload.Nome, payload.Whatsapp, payload.Email, payload.Empresa, payload.Valor, payload.Fonte, payload.Status, payload.Temperatura, payload.Observacoes)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
		return
	}

	id, _ := res.LastInsertId()

	lead := Lead{
		ID:          id,
		Nome:        payload.Nome,
		Whatsapp:    payload.Whatsapp,
		Email:       payload.Email,
		Empresa:     payload.Empresa,
		Valor:       payload.Valor,
		Fonte:       payload.Fonte,
		Status:      payload.Status,
		Temperatura: payload.Temperatura,
		Observacoes: payload.Observacoes,
		CreatedAt:   time.Now().Format("2006-01-02 15:04:05"),
		UpdatedAt:   time.Now().Format("2006-01-02 15:04:05"),
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Lead created successfully",
		"lead":    lead,
	})
}

func (s *Server) getLeadByID(w http.ResponseWriter, r *http.Request, idStr string) {
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, `{"success":false,"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	query := `SELECT id, nome, whatsapp, email, empresa, valor, fonte, status, temperatura, observacoes, created_at, updated_at FROM leads WHERE id = ?`
	row := s.db.QueryRow(query, id)

	var lead Lead
	var createdAtStr, updatedAtStr string
	if err := row.Scan(&lead.ID, &lead.Nome, &lead.Whatsapp, &lead.Email, &lead.Empresa, &lead.Valor, &lead.Fonte, &lead.Status, &lead.Temperatura, &lead.Observacoes, &createdAtStr, &updatedAtStr); err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, `{"success":false,"error":"lead not found"}`, http.StatusNotFound)
			return
		}
		http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
		return
	}
	lead.CreatedAt = createdAtStr
	lead.UpdatedAt = updatedAtStr

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"lead":    lead,
	})
}

func (s *Server) listLeads(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	status := q.Get("status")
	temperatura := q.Get("temperatura")
	search := q.Get("search")
	limitStr := q.Get("limit")
	offsetStr := q.Get("offset")

	limit := 50
	offset := 0
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	if offsetStr != "" {
		if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
			offset = o
		}
	}

	baseQuery := "SELECT id, nome, whatsapp, email, empresa, valor, fonte, status, temperatura, observacoes, created_at, updated_at FROM leads WHERE 1=1"
	var args []interface{}

	if status != "" {
		baseQuery += " AND status = ?"
		args = append(args, status)
	}
	if temperatura != "" {
		baseQuery += " AND temperatura = ?"
		args = append(args, temperatura)
	}
	if search != "" {
		baseQuery += " AND (nome LIKE ? OR whatsapp LIKE ? OR email LIKE ? OR empresa LIKE ?)"
		pattern := "%" + search + "%"
		args = append(args, pattern, pattern, pattern, pattern)
	}

	baseQuery += " ORDER BY id DESC LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	rows, err := s.db.Query(baseQuery, args...)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	leads := make([]Lead, 0)
	for rows.Next() {
		var l Lead
		var cAt, uAt string
		if err := rows.Scan(&l.ID, &l.Nome, &l.Whatsapp, &l.Email, &l.Empresa, &l.Valor, &l.Fonte, &l.Status, &l.Temperatura, &l.Observacoes, &cAt, &uAt); err == nil {
			l.CreatedAt = cAt
			l.UpdatedAt = uAt
			leads = append(leads, l)
		}
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"count":   len(leads),
		"leads":   leads,
	})
}

func (s *Server) updateLead(w http.ResponseWriter, r *http.Request, idStr string) {
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, `{"success":false,"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	var payload map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusBadRequest)
		return
	}

	if len(payload) == 0 {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "Lead updated successfully",
		})
		return
	}

	allowedCols := map[string]bool{
		"nome": true, "whatsapp": true, "email": true, "empresa": true,
		"valor": true, "fonte": true, "status": true, "temperatura": true,
		"observacoes": true,
	}

	setClauses := make([]string, 0)
	args := make([]interface{}, 0)

	for col, val := range payload {
		colLower := strings.ToLower(col)
		if allowedCols[colLower] {
			setClauses = append(setClauses, colLower+" = ?")
			args = append(args, val)
		}
	}

	if len(setClauses) == 0 {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "Lead updated successfully",
		})
		return
	}

	setClauses = append(setClauses, "updated_at = CURRENT_TIMESTAMP")
	query := fmt.Sprintf("UPDATE leads SET %s WHERE id = ?", strings.Join(setClauses, ", "))
	args = append(args, id)

	res, err := s.db.Exec(query, args...)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
		return
	}

	rowsAff, _ := res.RowsAffected()
	if rowsAff == 0 {
		http.Error(w, `{"success":false,"error":"lead not found or unchanged"}`, http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Lead updated successfully",
	})
}

func (s *Server) deleteLead(w http.ResponseWriter, r *http.Request, idStr string) {
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, `{"success":false,"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	res, err := s.db.Exec("DELETE FROM leads WHERE id = ?", id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
		return
	}

	rowsAff, _ := res.RowsAffected()
	if rowsAff == 0 {
		http.Error(w, `{"success":false,"error":"lead not found"}`, http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Lead deleted successfully",
	})
}

// HandleLeadStats calculates aggregated stats according to the specification.
func (s *Server) HandleLeadStats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, `{"success":false,"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var stats StatsResponse

	// Total count
	_ = s.db.QueryRow("SELECT COUNT(*) FROM leads").Scan(&stats.Total)

	// Status counts
	_ = s.db.QueryRow("SELECT COUNT(*) FROM leads WHERE LOWER(status) = 'novo'").Scan(&stats.Novos)
	_ = s.db.QueryRow("SELECT COUNT(*) FROM leads WHERE LOWER(status) IN ('em_contato', 'contato')").Scan(&stats.EmContato)
	_ = s.db.QueryRow("SELECT COUNT(*) FROM leads WHERE LOWER(status) = 'negociacao'").Scan(&stats.Negociacao)
	_ = s.db.QueryRow("SELECT COUNT(*) FROM leads WHERE LOWER(status) IN ('fechado', 'ganho')").Scan(&stats.Fechados)
	_ = s.db.QueryRow("SELECT COUNT(*) FROM leads WHERE LOWER(status) IN ('perdido', 'cancelado')").Scan(&stats.Perdidos)

	// Valor total
	var sum sql.NullFloat64
	_ = s.db.QueryRow("SELECT SUM(valor) FROM leads").Scan(&sum)
	if sum.Valid {
		stats.ValorTotal = sum.Float64
	}

	// Conversion percentage: (fechados / total) * 100
	if stats.Total > 0 {
		stats.Conversao = (float64(stats.Fechados) / float64(stats.Total)) * 100.0
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"stats":   stats,
	})
}
