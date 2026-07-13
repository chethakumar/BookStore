# Setup Worker Node

This guide provides step-by-step instructions to configure the Worker Node where the Book Store application will be deployed.

## 1. System Update
```bash
sudo apt update
sudo apt upgrade -y
```

## 2. Install OpenSSH Server (Usually pre-installed)
```bash
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo systemctl start ssh
```

## 3. Install Docker
```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install docker-ce -y
sudo systemctl start docker
sudo systemctl enable docker
```

## 4. Add Ubuntu user to Docker group
```bash
sudo usermod -aG docker ubuntu
# Apply group changes without logging out
newgrp docker
```

## 5. Configure SSH Access from Master Node
To allow the Master Node (Ansible) to execute commands on this Worker Node, add the Master Node's public SSH key.

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```
*Paste the contents of the `id_rsa.pub` generated on the Master Node (Jenkins user) into this file and save it.*

```bash
chmod 600 ~/.ssh/authorized_keys
```

## 6. Verify Connection (from Master Node)
Go back to the Master Node and test the connection as the `jenkins` user:
```bash
sudo su - jenkins
ssh ubuntu@<WORKER_NODE_IP>
```
If you can log in without a password, the setup is complete!
