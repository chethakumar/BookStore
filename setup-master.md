# Setup Master Node (Jenkins & Ansible)

This guide provides step-by-step instructions to configure the Master Node (e.g., an Ubuntu EC2 instance or VM).

## 1. System Update
```bash
sudo apt update
sudo apt upgrade -y
```

## 2. Install Java (Required for Jenkins)
```bash
sudo apt install openjdk-17-jre -y
java -version
```

## 3. Install Jenkins
```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt-get update
sudo apt-get install jenkins -y
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

## 4. Install Docker
```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install docker-ce -y
sudo systemctl start docker
sudo systemctl enable docker
```

## 5. Add Jenkins and Ubuntu users to Docker group
```bash
sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu
# You must restart Jenkins for this to take effect
sudo systemctl restart jenkins
```

## 6. Install Ansible
```bash
sudo apt update
sudo apt install software-properties-common -y
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install ansible -y
ansible --version
```

## 7. Install Git
```bash
sudo apt install git -y
```

## 8. Generate SSH Keys for Jenkins
To allow Ansible (running via Jenkins) to connect to the worker node without a password:
```bash
sudo su - jenkins
ssh-keygen -t rsa -b 4096 -N ""
# Copy the output of the following command
cat ~/.ssh/id_rsa.pub
exit
```
*You will need to paste this public key into the worker node in the next steps.*
