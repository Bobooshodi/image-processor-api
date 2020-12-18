Requirements 
    - Docker
    - Docker Compose

clone the Repo
    sh "git clone https://github.com/Bobooshodi/image-processor-api.git"

 sh "cd image-processor-api";

 docker-compose up -d --build

 You might want to modify the .env file as needed.

 ------------------------------------------------------------------------------------------

                        Without Docker
 Requirements
    - NPM

clone the Repo
    sh "git clone https://github.com/Bobooshodi/image-processor-api.git"

 sh "cd image-processor-api";

 npm install
 npm run migrate
 npm start



                                NOTE
For the Integration Test, this requires the Server to be running. just start the docker-container, and run npm run test