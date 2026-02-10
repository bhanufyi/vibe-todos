output "tunnel_id" {
  description = "Cloudflare Tunnel ID"
  value       = cloudflare_tunnel.main.id
}

output "tunnel_name" {
  description = "Cloudflare Tunnel name"
  value       = cloudflare_tunnel.main.name
}

output "tunnel_secret" {
  description = "Cloudflare Tunnel secret"
  value       = random_password.tunnel_secret.result
  sensitive   = true
}

output "google_access_redirect_url" {
  description = "Google OAuth redirect URL for Cloudflare Access"
  value       = cloudflare_zero_trust_access_identity_provider.google.config[0].redirect_url
}
