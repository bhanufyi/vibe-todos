resource "cloudflare_record" "todos" {
  zone_id = var.cloudflare_zone_id
  name    = "todos"
  type    = "CNAME"
  content = "${cloudflare_tunnel.main.id}.cfargotunnel.com"
  proxied = true
}

resource "cloudflare_record" "n8n" {
  zone_id = var.cloudflare_zone_id
  name    = "n8n"
  type    = "CNAME"
  content = "${cloudflare_tunnel.main.id}.cfargotunnel.com"
  proxied = true
}

resource "cloudflare_record" "grafana" {
  zone_id = var.cloudflare_zone_id
  name    = "grafana"
  type    = "CNAME"
  content = "${cloudflare_tunnel.main.id}.cfargotunnel.com"
  proxied = true
}

resource "cloudflare_record" "typing" {
  zone_id = var.cloudflare_zone_id
  name    = "typing"
  type    = "CNAME"
  content = "${cloudflare_tunnel.main.id}.cfargotunnel.com"
  proxied = true
}
