variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for bhanu.fyi"
  type        = string
}

variable "domain" {
  description = "Base domain"
  type        = string
  default     = "bhanu.fyi"
}

variable "allowed_email" {
  description = "Email allowed to access via Zero Trust"
  type        = string
  default     = "bhanuprasadcherukuvada2000@gmail.com"
}

variable "google_oauth_client_id" {
  description = "Google OAuth client ID for Cloudflare Zero Trust"
  type        = string
  sensitive   = true
}

variable "google_oauth_client_secret" {
  description = "Google OAuth client secret for Cloudflare Zero Trust"
  type        = string
  sensitive   = true
}
