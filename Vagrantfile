# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.box_version = "20241002.0.0"

  # Hostname
  config.vm.hostname = "ubuntu-jammy"

  # SSH configuration
  config.ssh.username = "vagrant"
  config.ssh.password = "vagrant"
  config.ssh.insert_key = false
  config.ssh.private_key_path = ["D:/vagrant_home/insecure_private_key"]

  # Bridged Network (Mode Pont)
  config.vm.network "public_network", bridge: ENV["VAGRANT_BRIDGE"] || "Intel(R) Wi-Fi 6E AX211 160MHz"

  # VirtualBox Provider Settings
  config.vm.provider "virtualbox" do |vb|
    vb.name = "ubuntu-jammy"
    vb.memory = "2048"
    vb.cpus = 2
  end

  # Shell Provisioning (Idempotent)
  config.vm.provision "shell", inline: <<-SHELL
    set -e
    echo "=== Provisioning VM for CI/CD Docker ==="

    # SSH configuration check and authorized_keys setup
    mkdir -p /home/vagrant/.ssh
    echo 'ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEA6NF8iallvQVp22WDkTkyrtvp9eWW6A8YVr+kz4TjGYe7gHzIw+niNltGEFHzD8+v1I2YJ6oXevct1YeS0o9HZyN1Q9qgCgzUFtdOKLv6IedplqoPkcmF0aYet2PkEDo3MlTBckFXPITAMzF8dJSIFo9D8HfdOV0IAdx4O7PtixWKn5y2hMNG0zQPyUecp4pzC6kivAIhyfHilFR61RGL+GPXQ2MWZWFYbAGjyiYJnAmCP3NOTd0jMZEnDkbUvxhMmBYSdETk1rRgm+R4LOzFUGaHqHDLKLX+FIPKcF96hrucXzcWyLbIbEgE98OHlnVYCzRdK8jlqm8tehUc9c9WhQ==' >> /home/vagrant/.ssh/authorized_keys
    sort -u /home/vagrant/.ssh/authorized_keys -o /home/vagrant/.ssh/authorized_keys
    chmod 700 /home/vagrant/.ssh
    chmod 600 /home/vagrant/.ssh/authorized_keys
    chown -R vagrant:vagrant /home/vagrant/.ssh

    sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config /etc/ssh/sshd_config.d/* 2>/dev/null || true
    sed -i 's/^#*PubkeyAuthentication.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config /etc/ssh/sshd_config.d/* 2>/dev/null || true
    systemctl restart ssh || systemctl restart sshd || true

    # Package updates and prerequisites
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y docker.io git curl

    # Enable and start Docker service, add vagrant user to docker group
    systemctl enable --now docker
    usermod -aG docker vagrant

    # Install Node.js 20 and npm if not already present
    if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d'.' -f1)" != "v20" ]; then
      echo "=== Installing Node.js 20 ==="
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
      apt-get install -y nodejs
    fi

    echo "=== Provisioning Finished ==="
    docker --version
    node -v
    npm -v
    echo "=== Network Interfaces ==="
    ip -br a
  SHELL
end
