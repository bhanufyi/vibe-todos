resource "cloudflare_zero_trust_access_policy" "todos_policy" {
  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.todos.id
  name           = "Allow Bhanu"
  decision       = "allow"
  precedence     = 1

  include {
    email = [var.allowed_email]
  }
}

resource "cloudflare_zero_trust_access_policy" "n8n_policy" {
  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.n8n.id
  name           = "Allow Bhanu"
  decision       = "allow"
  precedence     = 1

  include {
    email = [var.allowed_email]
  }
}

resource "cloudflare_zero_trust_access_policy" "grafana_policy" {
  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.grafana.id
  name           = "Allow Bhanu"
  decision       = "allow"
  precedence     = 1

  include {
    email = [var.allowed_email]
  }
}

resource "cloudflare_zero_trust_access_policy" "typing_policy" {
  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.typing.id
  name           = "Allow Bhanu"
  decision       = "allow"
  precedence     = 1

  include {
    email = [var.allowed_email]
  }
}
