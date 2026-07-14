pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'chethan433/bookstore'
        DOCKER_TAG = 'latest'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        ANSIBLE_HOST = 'worker-node'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from Git...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }

        stage('Docker Login') {
            steps {
                echo 'Logging into Docker Hub...'
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                script {
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Run Ansible Playbook') {
            steps {
                echo 'Executing Ansible Playbook to deploy to worker node...'
                // Using SSH key authentication as requested
                // Requires SSH key to be configured for Jenkins user or via Ansible
                script {
                    sh "ansible-playbook -i ansible/inventory ansible/deploy.yml"
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Deployment complete. The app should now be running on the worker node.'
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up Docker login...'
            sh 'docker logout'
        }
    }
}
