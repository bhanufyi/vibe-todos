output "cluster_name" {
  description = "GKE cluster name"
  value       = google_container_cluster.primary.name
}

output "cluster_location" {
  description = "GKE cluster location"
  value       = google_container_cluster.primary.location
}

output "artifact_registry_url" {
  description = "Artifact Registry URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.images.repository_id}"
}

output "workload_identity_provider" {
  description = "Workload Identity Provider for GitHub Actions"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "github_actions_sa" {
  description = "GitHub Actions service account email"
  value       = google_service_account.github_actions.email
}

output "todo_app_sa" {
  description = "Todo App service account email"
  value       = google_service_account.todo_app.email
}

output "n8n_sa" {
  description = "n8n service account email"
  value       = google_service_account.n8n.email
}

output "pg_backup_bucket" {
  description = "PostgreSQL backup bucket"
  value       = google_storage_bucket.pg_backups.name
}

output "project_number" {
  description = "GCP Project Number"
  value       = data.google_project.current.number
}

data "google_project" "current" {
  project_id = var.project_id
}
