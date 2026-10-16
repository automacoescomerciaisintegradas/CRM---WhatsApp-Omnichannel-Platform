package crm

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

// Payment represents a PIX or credit charge linked to a lead.
type Payment struct {
	ID            int64     `json:"id"`
	LeadID        int64     `json:"lead_id"`
	Provider      string    `json:"provider"`
	ExternalID    string    `json:"external_id"`
	Amount        float64   `json:"amount"`
	Status        string    `json:"status"`
	PaymentMethod string    `json:"payment_method"`
	QRCode        string    `json:"qr_code"`
	QRCodeBase64  string    `json:"qr_code_base64"`
	TicketURL     string    `json:"ticket_url"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// HandlePayments routes GET, POST, and PUT for /api/crm/payments.
func (s *Server) HandlePayments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		leadIDStr := r.URL.Query().Get("lead_id")
		statusStr := r.URL.Query().Get("status")

		query := `SELECT id, lead_id, provider, external_id, amount, status, payment_method, qr_code, qr_code_base64, ticket_url, created_at, updated_at FROM payments WHERE 1=1`
		var args []interface{}

		if leadIDStr != "" {
			leadID, err := strconv.ParseInt(leadIDStr, 10, 64)
			if err == nil {
				query += " AND lead_id = ?"
				args = append(args, leadID)
			}
		}
		if statusStr != "" {
			query += " AND status = ?"
			args = append(args, statusStr)
		}

		query += " ORDER BY id DESC"

		rows, err := s.db.Query(query, args...)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		payments := make([]Payment, 0)
		for rows.Next() {
			var p Payment
			var cAt, uAt string
			if err := rows.Scan(&p.ID, &p.LeadID, &p.Provider, &p.ExternalID, &p.Amount, &p.Status, &p.PaymentMethod, &p.QRCode, &p.QRCodeBase64, &p.TicketURL, &cAt, &uAt); err == nil {
				payments = append(payments, p)
			}
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":  true,
			"count":    len(payments),
			"payments": payments,
		})

	case http.MethodPost:
		var payload struct {
			LeadID        int64   `json:"lead_id"`
			Provider      string  `json:"provider"`
			ExternalID    string  `json:"external_id"`
			Amount        float64 `json:"amount"`
			Status        string  `json:"status"`
			PaymentMethod string  `json:"payment_method"`
			QRCode        string  `json:"qr_code"`
			QRCodeBase64  string  `json:"qr_code_base64"`
			TicketURL     string  `json:"ticket_url"`
		}

		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusBadRequest)
			return
		}

		if payload.LeadID == 0 || payload.Amount <= 0 {
			http.Error(w, `{"success":false,"error":"lead_id and valid amount are required"}`, http.StatusBadRequest)
			return
		}

		if payload.Provider == "" {
			payload.Provider = "mercadopago"
		}
		if payload.PaymentMethod == "" {
			payload.PaymentMethod = "pix"
		}
		if payload.Status == "" {
			payload.Status = "pending"
		}

		res, err := s.db.Exec(`INSERT INTO payments (lead_id, provider, external_id, amount, status, payment_method, qr_code, qr_code_base64, ticket_url, created_at, updated_at)
		                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			payload.LeadID, payload.Provider, payload.ExternalID, payload.Amount, payload.Status, payload.PaymentMethod, payload.QRCode, payload.QRCodeBase64, payload.TicketURL)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
			return
		}

		id, _ := res.LastInsertId()

		// Log activity
		_, _ = s.db.Exec(`INSERT INTO activities (lead_id, type, description, metadata, created_at)
		                 VALUES (?, 'payment_created', ?, ?, CURRENT_TIMESTAMP)`,
			payload.LeadID, fmt.Sprintf("PIX payment of R$ %.2f generated (Status: %s)", payload.Amount, payload.Status), "{}")

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "Payment recorded successfully",
			"id":      id,
		})

	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, `{"success":false,"error":"missing payment id"}`, http.StatusBadRequest)
			return
		}

		var payload struct {
			Status string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusBadRequest)
			return
		}

		_, err := s.db.Exec(`UPDATE payments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, payload.Status, idStr)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "Payment updated successfully",
		})

	default:
		http.Error(w, `{"success":false,"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}
