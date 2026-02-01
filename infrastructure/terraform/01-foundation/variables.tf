variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "bhanufyi"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-west1"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "us-west1-a"
}

variable "github_org" {
  description = "GitHub organization/username"
  type        = string
  default     = "bhanufyi"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "vibe-todos"
}
