resource "digitalocean_domain" "domain" {
  name = var.domain
}

resource "digitalocean_record" "frontend_ipv4" {
  domain = digitalocean_domain.domain.name
  type   = "A"
  name   = "@"
  value  = var.frontend_ipv4
}

resource "digitalocean_record" "backend_ipv4" {
  domain = digitalocean_domain.domain.name
  type   = "A"
  name   = "backend"
  value  = var.backend_ipv4
}

resource "digitalocean_record" "frontend_ipv6" {
  domain = digitalocean_domain.domain.name
  type   = "AAAA"
  name   = "@"
  value  = var.frontend_ipv6
}

resource "digitalocean_record" "backend_ipv6" {
  domain = digitalocean_domain.domain.name
  type   = "AAAA"
  name   = "backend"
  value  = var.backend_ipv6
}
