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

resource "digitalocean_record" "purelymail_mx" {
  domain = digitalocean_domain.domain.name
  type   = "MX"
  name   = "@"
  priority = 10
  value  = "mailserver.purelymail.com."
}

resource "digitalocean_record" "purelymail_spf" {
  domain = digitalocean_domain.domain.name
  type   = "TXT"
  name   = "@"
  value  = "v=spf1 include:_spf.purelymail.com ~all"
}

resource "digitalocean_record" "purelymail_ownership" {
  domain = digitalocean_domain.domain.name
  type   = "TXT"
  name   = "@"
  value  = "purelymail_ownership_proof=e6ba2e0239b5c05d1314f39054a3531f93b6e02bb2162fd3c5dc15074b31abac2f34c83c4dd09fac9edf2c2204e72149553bdf7a65845cd0df18b534bd2ff10e"
}

resource "digitalocean_record" "purelymail_dkim1" {
  domain = digitalocean_domain.domain.name
  type   = "CNAME"
  name   = "purelymail1._domainkey"
  value  = "key1.dkimroot.purelymail.com."
}

resource "digitalocean_record" "purelymail_dkim2" {
  domain = digitalocean_domain.domain.name
  type   = "CNAME"
  name   = "purelymail2._domainkey"
  value  = "key2.dkimroot.purelymail.com."
}

resource "digitalocean_record" "purelymail_dkim3" {
  domain = digitalocean_domain.domain.name
  type   = "CNAME"
  name   = "purelymail3._domainkey"
  value  = "key3.dkimroot.purelymail.com."
}

resource "digitalocean_record" "purelymail_dmarc" {
  domain = digitalocean_domain.domain.name
  type   = "CNAME"
  name   = "_dmarc"
  value  = "dmarcroot.purelymail.com."
}

resource "digitalocean_record" "corbado_auth" {
  domain = digitalocean_domain.domain.name
  type   = "CNAME"
  name   = "auth"
  value  = "${var.corbado_auth}."
}