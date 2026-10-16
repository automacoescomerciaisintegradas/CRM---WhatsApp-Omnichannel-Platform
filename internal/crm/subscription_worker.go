package crm

import (
	"fmt"
	"log"
	"time"
)

// StartSubscriptionWorker launches a background goroutine to enforce grace period and auto-suspension.
func (s *Server) StartSubscriptionWorker() {
	ticker := time.NewTicker(30 * time.Second)
	go func() {
		log.Println("[Subscription Worker] Background auto-enforcement worker started.")
		for range ticker.C {
			s.runEnforcementCycle()
		}
	}()
}

func (s *Server) runEnforcementCycle() {
	nowStr := time.Now().Format("2006-01-02 15:04:05")

	// 1. Move expired active subscriptions into grace_period
	rows, err := s.db.Query(`
		SELECT s.id, COALESCE(l.whatsapp, ''), COALESCE(l.nome, 'Cliente'), p.grace_period_days, p.price
		FROM subscriptions s
		LEFT JOIN leads l ON l.id = s.lead_id
		LEFT JOIN plans p ON p.id = s.plan_id
		WHERE s.status = 'active' AND s.current_period_end < ?
	`, nowStr)
	if err == nil {
		for rows.Next() {
			var subID, phone, nome string
			var graceDays int
			var price float64
			if err := rows.Scan(&subID, &phone, &nome, &graceDays, &price); err == nil {
				if graceDays <= 0 {
					graceDays = 2
				}
				graceUntil := time.Now().AddDate(0, 0, graceDays).Format("2006-01-02 15:04:05")

				_, _ = s.db.Exec(`UPDATE subscriptions SET status = 'grace_period', grace_until = ?, updated_at = ? WHERE id = ?`,
					graceUntil, nowStr, subID)

				_, _ = s.db.Exec(`INSERT INTO audit_subscription_logs (subscription_id, event_type, description, created_at)
				                  VALUES (?, 'GRACE_WARNING', ?, CURRENT_TIMESTAMP)`,
					subID, fmt.Sprintf("Período de carência ativado até %s.", graceUntil))

				if phone != "" {
					pix := fmt.Sprintf("00020126580014br.gov.bcb.pix0136renovacao_%d520400005303986540%0.2f5802BR5925ACI OMNICHANNEL6009FORTALEZA62070503***6304ABCD", time.Now().Unix(), price)
					go s.sendWhatsAppText(phone, fmt.Sprintf("⚠️ *Aviso de Vencimento - WhatsMiau2*\n\nOlá, *%s*!\nSua assinatura venceu, mas você tem tolerância até *%s* para manter suas mensagens ativas.\n\n📌 *Código PIX para Renovação:*\n```%s```\n\nValor: R$ %.2f", nome, graceUntil, pix, price))
				}
				log.Printf("[Subscription Worker] Subscription %s entered grace_period until %s", subID, graceUntil)
			}
		}
		rows.Close()
	}

	// 2. Suspend / Revoke access for subscriptions that exceeded grace_period
	revokeRows, err := s.db.Query(`
		SELECT s.id, COALESCE(l.whatsapp, ''), COALESCE(l.nome, 'Cliente')
		FROM subscriptions s
		LEFT JOIN leads l ON l.id = s.lead_id
		WHERE s.status = 'grace_period' AND s.grace_until < ?
	`, nowStr)
	if err == nil {
		for revokeRows.Next() {
			var subID, phone, nome string
			if err := revokeRows.Scan(&subID, &phone, &nome); err == nil {
				_, _ = s.db.Exec(`UPDATE subscriptions SET status = 'past_due', updated_at = ? WHERE id = ?`, nowStr, subID)

				_, _ = s.db.Exec(`INSERT INTO audit_subscription_logs (subscription_id, event_type, description, created_at)
				                  VALUES (?, 'ACCESS_REVOKED', 'Acesso suspenso por expiração do período de carência sem pagamento.', CURRENT_TIMESTAMP)`, subID)

				if phone != "" {
					go s.sendWhatsAppText(phone, fmt.Sprintf("🚫 *Acesso Bloqueado - WhatsMiau2*\n\nOlá, *%s*.\nO período de tolerância da sua assinatura expirou e seu acesso aos disparos de WhatsApp foi temporariamente suspenso.\n\nPara restabelecer sua chave de API e grupos imediatamente, regularize sua conta acessando https://crm.iau2.com.br", nome))
				}
				log.Printf("[Subscription Worker] Subscription %s REVOKED (past_due)", subID)
			}
		}
		revokeRows.Close()
	}
}
