output "mongodb_password" {
  value = module.db.password
  sensitive = true
}
