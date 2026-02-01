# GCS bucket for PostgreSQL backups
resource "google_storage_bucket" "pg_backups" {
  name     = "${var.project_id}-pg-backups-${data.google_project.current.number}"
  location = var.region

  uniform_bucket_level_access = true

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 30 # Delete backups older than 30 days
    }
  }

  versioning {
    enabled = false
  }
}
