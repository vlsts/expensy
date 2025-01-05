output "mongodb_password" {
  value = module.db.mongodb_password
  sensitive = true
}
