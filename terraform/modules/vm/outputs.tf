output "frontend_ipv4" {
  value = digitalocean_droplet.frontend.ipv4_address
}

output "frontend_ipv6" {
  value = digitalocean_droplet.frontend.ipv6_address
}

output "backend_ipv4" {
  value = digitalocean_droplet.backend.ipv4_address
}

output "backend_ipv6" {
  value = digitalocean_droplet.backend.ipv6_address
}

output "frontend_urn" {
  value = digitalocean_droplet.frontend.urn
}

output "backend_urn" {
  value = digitalocean_droplet.backend.urn
}

output "backend_id" {
  value = digitalocean_droplet.backend.id
}
