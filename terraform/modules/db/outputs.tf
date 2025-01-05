output "mongodb_cname" {
  value = digitalocean_database_cluster.database.private_host
}

output "mongodb_urn" {
  value = digitalocean_database_cluster.database.urn
}

output "mongodb_password" {
  value = digitalocean_database_user.database_user.password
}
