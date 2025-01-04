output "mongodb_cname" {
  value = digitalocean_database_cluster.database.private_host
}

output "mongodb_urn" {
  value = digitalocean_database_cluster.database.urn
}
