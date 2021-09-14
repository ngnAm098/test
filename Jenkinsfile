node {
    def app

    stage ('Cloning Project'){
        git branch: 'develop', credentialsId: 'github-account', url: 'https://github.com/OAG-Bhutan/elms-frontend.git'
    }
    stage ('Package & Build'){
      sh 'npm install'
      sh 'npm run build --prod'
    }
  //  stage ('Lint'){
  //     sh 'npm run lint'
  //  }
  //  stage ('e2e Test'){
  //     sh 'npm run e2e'
  //  }
    stage ('Build & Push Image') {
       docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            app = docker.build("oagbhutan/elms-frontend")
            app.push()
            sh 'docker rmi registry.hub.docker.com/oagbhutan/elms-frontend:latest'
       }
    }
}
