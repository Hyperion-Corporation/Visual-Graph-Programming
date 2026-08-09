# ansible/

> **Optional.** Config-management/provisioning for an optionally-hosted
> instance of VGP's backend (`backend/`) on a bare-metal or VM target
> outside the container/k8s world (e.g. a bastion host, a self-hosted CI
> runner). Not needed if you always run the backend as the Tauri app's
> local sidecar — delete this directory in that case.

```bash
ansible-playbook -i inventory/hosts.ini playbook.yml
```

| Path | Purpose |
| --- | --- |
| `ansible.cfg` | Local Ansible config (inventory path, SSH settings) |
| `inventory/hosts.ini` | Target hosts, grouped |
| `playbook.yml` | Entry-point playbook, applies the `app` role |
| `roles/app/` | Example role: installs and configures the backend on a host |
