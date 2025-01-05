variable "domain" {
  description = "The domain name"
  type        = string
}

variable "frontend_ipv4" {
  description = "The frontend IPv4 address"
  type        = string
}

variable "frontend_ipv6" {
  description = "The frontend IPv6 address"
  type        = string
}

variable "backend_ipv4" {
  description = "The backend IPv4 address"
  type        = string
}

variable "backend_ipv6" {
  description = "The backend IPv6 address"
  type        = string
}
