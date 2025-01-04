resource "digitalocean_ssh_key" "ssh_key" {
  name       = "Terraform SSH Key"
  public_key = file("login.pub")
}

resource "digitalocean_droplet" "frontend" {
  image    = "ubuntu-24-10-x64"
  name     = "frontend"
  region   = "fra1"
  size     = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.ssh_key.fingerprint]
  ipv6     = true
}

resource "digitalocean_droplet" "backend" {
  image    = "ubuntu-24-10-x64"
  name     = "backend"
  region   = "fra1"
  size     = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.ssh_key.fingerprint]
  ipv6     = true
}
