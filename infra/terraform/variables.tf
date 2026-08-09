variable "environment" {
  description = "Deployment environment name (dev, prod)."
  type        = string
  default     = "dev"
}

variable "region" {
  description = "Cloud provider region."
  type        = string
  default     = "us-east-1"
}
