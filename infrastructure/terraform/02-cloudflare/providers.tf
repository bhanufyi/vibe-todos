terraform {
  required_version = ">= 1.0"

  backend "gcs" {
    bucket = "bhanufyi-terraform-state"
    prefix = "cloudflare"
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
