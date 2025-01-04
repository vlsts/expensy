data "digitalocean_project" "project" {
  name = "Expensy"
}

module "db" {
  source     = "./modules/db"
  project_id = data.digitalocean_project.project.id
}

module "vm" {
  source = "./modules/vm"
}

module "domain" {
  source        = "./modules/domain"
  domain        = var.domain
  frontend_ipv4 = module.vm.frontend_ipv4
  frontend_ipv6 = module.vm.frontend_ipv6
  backend_ipv4  = module.vm.backend_ipv4
  backend_ipv6  = module.vm.backend_ipv6
  mongodb_cname  = module.db.mongodb_cname
}

resource "digitalocean_project_resources" "project_resources" {
  project = data.digitalocean_project.project.id
  resources = [
    module.vm.frontend_urn,
    module.vm.backend_urn,
    module.db.mongodb_urn,
    module.domain.domain_urn
  ]
}
