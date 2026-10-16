package crm

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

// Message represents an inbound or outbound message logged for a lead.
type Message struct {
	ID         int64     `json:"id"`
	LeadID     int64     `json:"lead_id"`
	Direction  string    `json:"direction"`
	Type       string    `json:"type"`
	Content    string    `json:"content"`
	MediaURL   string    `json:"media_url"`
	Status     string    `json:"status"`
	ExternalID string    `json:"external_id"`
	CreatedAt  time.Time `json:"created_at"`
}

// HandleMessages routes GET and POST for /api/crm/messages.
func (s *Server) HandleMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		leadIDStr := r.URL.Query().Get("lead_id")
		if leadIDStr == "" {
			http.Error(w, `{"success":false,"error":"missing lead_id query parameter"}`, http.StatusBadRequest)
			return
		}

		leadID, err := strconv.ParseInt(leadIDStr, 10, 64)
		if err != nil {
			http.Error(w, `{"success":false,"error":"invalid lead_id"}`, http.StatusBadRequest)
			return
		}

		rows, err := s.db.Query(`SELECT id, lead_id, direction, type, content, media_url, status, external_id, created_at 
		                         FROM messages WHERE lead_id = ? ORDER BY id ASC`, leadID)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		messages := make([]Message, 0)
		for rows.Next() {
			var m Message
			var cAt string
			if err := rows.Scan(&m.ID, &m.LeadID, &m.Direction, &m.Type, &m.Content, &m.MediaURL, &m.Status, &m.ExternalID, &cAt); err == nil {
				messages = append(messages, m)
			}
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":  true,
			"count":    len(messages),
			"messages": messages,
		})

	case http.MethodPost:
		var payload struct {
			LeadID     int64  `json:"lead_id"`
			Direction  string `json:"direction"`
			Type       string `json:"type"`
			Content    string `json:"content"`
			MediaURL   string `json:"media_url"`
			Status     string `json:"status"`
			ExternalID string `json:"external_id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusBadRequest)
			return
		}

		if payload.LeadID == 0 {
			http.Error(w, `{"success":false,"error":"lead_id is required"}`, http.StatusBadRequest)
			return
		}
		if payload.Direction == "" {
			payload.Direction = "outbound"
		}
		if payload.Type == "" {
			payload.Type = "text"
		}
		if payload.Status == "" {
			payload.Status = "sent"
		}

		res, err := s.db.Exec(`INSERT INTO messages (lead_id, direction, type, content, media_url, status, external_id, created_at)
		                       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
			payload.LeadID, payload.Direction, payload.Type, payload.Content, payload.MediaURL, payload.Status, payload.ExternalID)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"success":false,"error":%q}`, err.Error()), http.StatusInternalServerError)
			return
		}

		id, _ := res.LastInsertId()

		// Also record an activity log
		_, _ = s.db.Exec(`INSERT INTO activities (lead_id, type, description, metadata, created_at)
		                 VALUES (?, 'message_sent', ?, ?, CURRENT_TIMESTAMP)`,
			payload.LeadID, fmt.Sprintf("%s message logged: %s", payload.Type, payload.Content), "{}")

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "Message logged successfully",
			"id":      id,
		})

	default:
		http.Error(w, `{"success":false,"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}
