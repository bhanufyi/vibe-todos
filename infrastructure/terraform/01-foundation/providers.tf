terraform {
  required_version = ">= 1.0"

  backend "gcs" {
    bucket = "bhanufyi-terraform-state"
    prefix = "foundation"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
