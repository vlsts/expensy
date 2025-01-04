terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  backend "s3" {
    endpoints = {
      s3 = "https://fra1.digitaloceanspaces.com"
    }

    bucket = "expensy-tfstate"
    key    = "terraform.tfstate"


    # AWS Specific
    skip_credentials_validation = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_s3_checksum            = true
    region                      = "us-east-1"

    # AWS_ACCESS_KEY_ID
    # AWS_SECRET_ACCESS_KEY
  }

  required_version = ">1.9"
}

provider "digitalocean" {
  token = var.do_token
}
