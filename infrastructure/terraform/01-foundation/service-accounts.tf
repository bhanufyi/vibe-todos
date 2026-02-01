# Service Account for Todo App workload identity
resource "google_service_account" "todo_app" {
  account_id   = "todo-app"
  display_name = "Todo App Service Account"
  description  = "Service account for Todo App Kubernetes workload"
}

# Service Account for n8n workload identity
resource "google_service_account" "n8n" {
  account_id   = "n8n-app"
  display_name = "n8n Service Account"
  description  = "Service account for n8n Kubernetes workload"
}

# Grant storage access to todo-app for backups
resource "google_storage_bucket_iam_member" "todo_app_backup" {
  bucket = google_storage_bucket.pg_backups.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.todo_app.email}"
}

# Grant storage access to n8n for backups
resource "google_storage_bucket_iam_member" "n8n_backup" {
  bucket = google_storage_bucket.pg_backups.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.n8n.email}"
}

# Kubernetes Workload Identity bindings
resource "google_service_account_iam_member" "todo_app_workload_identity" {
  service_account_id = google_service_account.todo_app.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[default/todo-app]"
}

resource "google_service_account_iam_member" "n8n_workload_identity" {
  service_account_id = google_service_account.n8n.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[default/n8n]"
}
