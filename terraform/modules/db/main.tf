resource "digitalocean_database_cluster" "database" {
  project_id = var.project_id
  name       = "expensy-mongodb-cluster"
  engine     = "mongodb"
  version    = "7"
  size       = "db-s-1vcpu-1gb"
  region     = "fra1"
  node_count = 1
}

resource "digitalocean_database_user" "database_user" {
  cluster_id = digitalocean_database_cluster.database.id
  name       = "expensyadmin"
}

# resource "digitalocean_database_firewall" "mongo_backend_allow_rule" {
#   cluster_id = digitalocean_database_cluster.database.id

#   rule {
#     type  = "droplet"
#     value = var.backend_droplet_id
#   }
# }
