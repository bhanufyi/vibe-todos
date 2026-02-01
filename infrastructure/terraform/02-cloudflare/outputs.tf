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
