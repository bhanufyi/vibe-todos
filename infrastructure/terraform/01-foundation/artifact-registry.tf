# Artifact Registry for Docker images
resource "google_artifact_registry_repository" "images" {
  location      = var.region
  repository_id = "todo-app"
  format        = "DOCKER"
  description   = "Docker images for Vibe Todos app"

  cleanup_policies {
    id     = "keep-minimum"
    action = "KEEP"
    most_recent_versions {
      keep_count = 5
    }
  }

  cleanup_policies {
    id     = "delete-old"
    action = "DELETE"
    condition {
      older_than = "604800s" # 7 days
    }
  }
}
