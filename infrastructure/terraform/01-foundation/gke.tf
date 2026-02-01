# GKE Standard Cluster (zonal for free tier)
resource "google_container_cluster" "primary" {
  name     = "todo-cluster"
  location = var.zone

  # We manage node pools separately
  remove_default_node_pool = true
  initial_node_count       = 1

  # Enable Workload Identity
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Network configuration
  network    = "default"
  subnetwork = "default"

  # Release channel for auto-upgrades
  release_channel {
    channel = "REGULAR"
  }

  # Minimal logging to reduce costs
  logging_config {
    enable_components = ["SYSTEM_COMPONENTS"]
  }

  # Minimal monitoring to reduce costs
  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
    managed_prometheus {
      enabled = false
    }
  }

  # Enable network policy
  network_policy {
    enabled  = true
    provider = "CALICO"
  }

  addons_config {
    http_load_balancing {
      disabled = true # We use Cloudflare Tunnel
    }
    horizontal_pod_autoscaling {
      disabled = false
    }
    network_policy_config {
      disabled = false
    }
  }

  # Binary authorization
  binary_authorization {
    evaluation_mode = "DISABLED"
  }

  deletion_protection = false
}
