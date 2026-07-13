# Book Store Management System

A modern, responsive frontend-only application for a Book Store, deployed using a complete DevOps CI/CD pipeline.

## Project Architecture Diagram

```mermaid
graph TD
    Developer([Developer]) -->|git push| GitHub[GitHub Repository]
    GitHub -->|Webhook| Jenkins[Jenkins Server\n(Java + Docker + Ansible)]
    
    subgraph CI/CD Pipeline
        Jenkins -->|1. Checkout| Jenkins
        Jenkins -->|2. Docker Build| DockerImage[Docker Image\nvikas636/bookstore:latest]
        Jenkins -->|3. Docker Login & Push| DockerHub[(Docker Hub)]
        Jenkins -->|4. ansible-playbook| Ansible[Ansible]
    end
    
    Ansible -->|SSH| WorkerNode[Worker Node\n(Docker + Nginx)]
    
    subgraph Worker Environment
        WorkerNode -->|docker pull| DockerHub
        WorkerNode -->|docker run| NginxContainer[Nginx Container\nPort 80]
    end
    
    NginxContainer -->|Serves Web App| WebBrowser([Web Browser])
```

## Features
- **Modern UI**: Built with HTML, CSS, JavaScript, and Bootstrap 5.
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices.
- **Dark/Light Mode**: User preference toggle for theme switching.
- **Dynamic Interactions**: Smooth scrolling, category filtering, and scroll-to-top button.
- **Form Validation**: Frontend-only validation for adding books and contact forms.
- **Optimized Delivery**: Nginx configured with gzip compression, caching, and security headers.

## DevOps Stack
- **Docker**: Containerization using Nginx.
- **Jenkins**: CI/CD pipeline automation.
- **Ansible**: Configuration management and deployment on the worker node.
- **Nginx**: High-performance web server.

## Jenkins Pipeline Explanation

The `Jenkinsfile` orchestrates the entire deployment process with the following stages:
1. **Checkout**: Pulls the latest source code from the GitHub repository.
2. **Build Docker Image**: Creates a new Docker image (`vikas636/bookstore:latest`) containing the Nginx web server and our frontend files.
3. **Docker Login**: Authenticates securely with Docker Hub using Jenkins credentials.
4. **Push Docker Image**: Pushes the newly built image to Docker Hub so it can be accessed by the worker node.
5. **Run Ansible Playbook**: Triggers `deploy.yml` using Ansible to connect to the worker node via SSH.
6. **Verify Deployment**: Confirms the deployment sequence completed successfully.

## Docker Commands

To run this project locally without Jenkins or Ansible, use the following Docker commands:

### Build the image
```bash
docker build -t vikas636/bookstore:latest .
```

### Run the container
```bash
docker run -d --name bookstore-app -p 80:80 vikas636/bookstore:latest
```

### Stop and remove the container
```bash
docker stop bookstore-app
docker rm bookstore-app
```

### Push to Docker Hub (for CI/CD)
```bash
docker login
docker push vikas636/bookstore:latest
```

## Ansible Commands

To test the Ansible deployment manually from your master node to the worker node:

```bash
# Navigate to the ansible directory
cd ansible

# Run the deployment playbook
ansible-playbook -i inventory deploy.yml
```

## Screenshots

*(Placeholders for screenshots)*
- **Home Page**: `![Home Page](images/screenshot-home.jpg)`
- **Books Collection**: `![Books Page](images/screenshot-books.jpg)`
- **Dark Mode**: `![Dark Mode](images/screenshot-darkmode.jpg)`

## Troubleshooting

### Jenkins Pipeline Fails at Docker Build
- Ensure the Jenkins user has permissions to run Docker commands (`sudo usermod -aG docker jenkins`).
- Restart Jenkins after adding the user to the docker group.

### Ansible SSH Connection Fails
- Verify the worker node IP in `ansible/inventory` is correct.
- Ensure the Jenkins server's SSH public key (`~/.ssh/id_rsa.pub`) is added to the worker node's `~/.ssh/authorized_keys`.
- Check if port 22 is open on the worker node.

### Nginx Serves 404 or Default Page
- Ensure the Docker volume mappings or `COPY` commands in the Dockerfile correctly point to `src/main/webapp/`.
- Verify no other service is occupying port 80 on the worker node.
