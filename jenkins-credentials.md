# Jenkins Credentials Configuration

To successfully run the CI/CD pipeline, you need to configure credentials in Jenkins for Docker Hub.

## 1. Docker Hub Credentials

The Jenkins pipeline needs to log in to Docker Hub to push the built image (`vikas636/bookstore:latest`).

1. Log in to your Jenkins Dashboard.
2. Go to **Manage Jenkins** > **Credentials**.
3. Under the *Stores scoped to Jenkins*, click on **(global)**.
4. Click on **Add Credentials**.
5. Fill in the form:
   - **Kind**: Username with password
   - **Scope**: Global
   - **Username**: `vikas636` (Your Docker Hub username)
   - **Password**: *Your Docker Hub password or Personal Access Token (PAT)*
   - **ID**: `docker-hub-credentials` *(This must exactly match the `DOCKER_CREDENTIALS_ID` in the Jenkinsfile)*
   - **Description**: Docker Hub Credentials for Book Store App
6. Click **Create**.

## 2. SSH Configuration for Ansible

Ansible connects to the worker node via SSH. In this setup, we rely on the SSH key of the Jenkins user on the Master node.

1. As outlined in `setup-master.md`, ensure you generated an SSH key for the `jenkins` user:
   ```bash
   sudo su - jenkins
   ssh-keygen -t rsa
   ```
2. You must copy the public key (`~/.ssh/id_rsa.pub`) into the `~/.ssh/authorized_keys` file on the **Worker Node** for the user `ubuntu` (or whichever user you defined in `ansible/inventory`).
3. To prevent Ansible from prompting to accept the host key on the first run, the `ansible.cfg` in this project has `host_key_checking = False` set.

## 3. GitHub Webhook (Optional but recommended)

To trigger the Jenkins pipeline automatically on `git push`:

1. In Jenkins, ensure the **GitHub Integration Plugin** is installed.
2. In your Jenkins Pipeline job configuration, check **GitHub hook trigger for GITScm polling**.
3. Go to your GitHub Repository > **Settings** > **Webhooks**.
4. Click **Add webhook**.
5. Set Payload URL to: `http://<YOUR_JENKINS_IP>:8080/github-webhook/`
6. Content type: `application/json`
7. Click **Add webhook**.
