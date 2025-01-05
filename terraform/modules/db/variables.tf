variable "project_id" {
  description = "The DigitalOcean project ID"
  type        = string
}

variable "backend_droplet_id" {
  description = "The ID of the droplet that should be allowed to connect to the database"
  type        = string
}
