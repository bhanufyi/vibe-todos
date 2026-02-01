resource "cloudflare_zero_trust_access_application" "todos" {
  account_id       = var.cloudflare_account_id
  name             = "todos.${var.domain}"
  domain           = "todos.${var.domain}"
  type             = "self_hosted"
  session_duration = "24h"
}

resource "cloudflare_zero_trust_access_application" "n8n" {
  account_id       = var.cloudflare_account_id
  name             = "n8n.${var.domain}"
  domain           = "n8n.${var.domain}"
  type             = "self_hosted"
  session_duration = "24h"
}
