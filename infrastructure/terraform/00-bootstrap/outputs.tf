output "terraform_state_bucket" {
  description = "GCS bucket for Terraform state"
  value       = google_storage_bucket.terraform_state.name
}

output "terraform_service_account" {
  description = "Terraform service account email"
  value       = google_service_account.terraform.email
}
