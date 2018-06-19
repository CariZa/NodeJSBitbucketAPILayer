## Setup a nodejs api layer


### Setup

Initialise your package.json by running:

    npm init

Install these packages:

    npm install nodemon --save-dev
    npm install express --save
    npm install request --save
    npm install request-promise --save

### Create server.js file

Create an server.js file

    touch server.js

### Examples of code

Example code for server.js file:

The requirements:
    
    var 
        // Requirements
        express = require('express'),
        app = express(),
        request = require('request'),
        rp = require('request-promise'),

        // Default environment variables:
        logstash_name = process.env.LOGSTASH_NAME || "logstash",
        port = process.env.PORT || 3000;

Initialise the app and listen on a port:

    app.listen(port, () => {
        console.log('Environment variable PORT is: ' + port);
        console.log('Environment variables LOGSTASH_NAME is: ' + logstash_name);
    });

### Routes

Example get method. This will allow you to go to the nodejs app's url and go to the endpoint you specify: 

    app.get('/members', (req, res) => {
        ...
        let data = ...
        ...
        // Display in the terminal / logs
        console.log(data);
        // Display something on browser screen
        res.send(data);
    });

Example url:

http://127.0.0.1:3000/members


Create a promise chain/request:

#### GET

Note, you can remoce the authtoken if you don't require private authenticated access

    function getData(url, authtoken) {

        let headers = {
            // 'User-Agent': 'request',
            'Authorization' : 'Basic '+ authtoken,
            'Content-Type': 'application/json'
        };
        let options = {url, headers};
        return rp(options).then((body) => {
            return body;
        }, (err) => {
            return err;
        });

    }

#### POST

    function postData(url, data) {

        let headers = {
            "Content-Type": "application/json"
        };
        let options = {
            method: "POST",
            body: JSON.parse(data),
            url, 
            headers,
            json: true
        };

        return rp(options).then((body) => {
            return body;
        }, (err) => {
            return err;
        });

    }

Just a note, you created the rp variables at the top of the file in the requirements section:

    ...
        rp = require('request-promise'),
    ...

## Build the api

### Dockerfile

You can add this to a Dockerfile and then build the image locally to test 

    FROM node:8

    WORKDIR /usr/src/app

    # Bundle app source
    COPY . .

    RUN npm install

    EXPOSE $PORT

    CMD [ "npm", "start" ]


### Build docker image

Build image locally:

    docker build -t nodejsapiname .

Run the image locally to test

    docker run --rm -e ... -p ... nodejsapiname



## Building the bitbucketapi container

Docker build

    docker build -t cariza/bitbucketapi .

Check you are logged in

    docker login

Push the build image to docker hub:

    docker push cariza/bitbucketapi

Test the image locally:

    docker pull cariza/bitbucketapi
    docker run --rm --name bitbucketapi -p 3000:3000 -e BITBUCKET_API_TOKEN=xxxxxxxxx -e BITBUCKET_ORGANISATION_DOMAIN=xxxxxxxxx cariza/bitbucketapi

Daemon mode:

    docker run --rm -d --name bitbucketapi -p 3000:3000 cariza/bitbucketapi