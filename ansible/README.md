# Ansible: Deploy Travel Booking Platform (TBP)

This Ansible playbook builds backend and frontend Docker images, pushes them to Docker Hub, and applies the Kubernetes manifests in `kubernetes/`.

Prerequisites
- Ansible 2.14+ (or later) installed
- Install required collections:

```bash
ansible-galaxy collection install community.docker
ansible-galaxy collection install kubernetes.core
```

- Docker CLI configured (able to build & push)
- Kubernetes cluster reachable and `kubectl` configured (kubeconfig)
- Recommended: use Ansible Vault for `dockerhub_password`

Usage
1. Edit `ansible/vars.yml` and set `dockerhub_password` (or use Ansible Vault):

```bash
ansible-vault encrypt_string 'your_password_here' --name 'dockerhub_password'
```

2. Run the playbook from the `ansible/` directory:

```bash
cd ansible
ansible-playbook -i hosts.ini deploy_tbp.yml
```

Notes
- Paths in `vars.yml` are relative to the `ansible/` directory; adjust if you run from another location.
- The playbook uses `community.docker.docker_image` and `kubernetes.core.k8s` modules; ensure these collections are installed.
- For production, store sensitive values in Vault and consider CI pipelines for image builds.
