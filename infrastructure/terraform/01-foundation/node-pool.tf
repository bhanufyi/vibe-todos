# Primary node pool with Spot VMs
resource "google_container_node_pool" "primary" {
  name     = "primary-pool"
  location = var.zone
  cluster  = google_container_cluster.primary.name

  initial_node_count = 1

  autoscaling {
    min_node_count = 1
    max_node_count = 4
  }

  node_config {
    machine_type = "e2-standard-4" # 4 vCPU, 16GB RAM
    spot         = true            # 70% cost savings

    # Workload Identity
    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    labels = {
      env = "production"
    }

    # Metadata
    metadata = {
      disable-legacy-endpoints = "true"
    }

    # Disk configuration
    disk_size_gb = 50
    disk_type    = "pd-standard"
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  upgrade_settings {
    max_surge       = 1
    max_unavailable = 0
  }
}
