output "mongodb_password" {
  value = module.db.mongodb_password
  sensitive = true
}

output "mongodb_host" {
  value = module.db.mongodb_host
}
