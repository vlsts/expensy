resource "digitalocean_database_cluster" "database" {
  project_id = var.project_id
  name       = "expensy-mongodb-cluster"
  engine     = "mongodb"
  version    = "7"
  size       = "db-s-1vcpu-1gb"
  region     = "fra1"
  node_count = 1
}
