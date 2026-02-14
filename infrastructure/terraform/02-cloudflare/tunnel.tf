resource "random_password" "tunnel_secret" {
  length  = 64
  special = false
}

resource "cloudflare_tunnel" "main" {
  account_id = var.cloudflare_account_id
  name       = "k8s-tunnel"
  secret     = random_password.tunnel_secret.result
}

resource "cloudflare_tunnel_config" "main" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_tunnel.main.id

  config {
    ingress_rule {
      hostname = "todos.${var.domain}"
      service  = "http://todo-app-web:3000"
    }

    ingress_rule {
      hostname = "typing.${var.domain}"
      service  = "http://typing-app:3000"
    }

    ingress_rule {
      hostname = "n8n.${var.domain}"
      service  = "http://n8n:5678"
    }

    ingress_rule {
      hostname = "grafana.${var.domain}"
      service  = "http://prometheus-grafana.monitoring:3000"
    }

    ingress_rule {
      service = "http_status:404"
    }
  }
}
