
// Just a useful check if the right environment variables are set,
// if not, tell the user

let requiredEnvironmentVariables = [
    'BITBUCKET_API_TOKEN',
    'BITBUCKET_ORGANISATION_DOMAIN'
];

function requiredFieldsAreValid() {
    let count = requiredEnvironmentVariables.length;
    // let valid = true;
    for (let i = 0; i < count; i++) {
        if (!process.env[requiredEnvironmentVariables[i]]) {
            // TODO: Just check this is a valid JS way to exit a loop, might cause other issues if not correct
            return false;
        }
    }
    return true;
}

if (!requiredFieldsAreValid()) {
    console.log("ERROR: MISSING ENVIRONMENT VARIABLE!");
    console.log("Make sure you have set these environment variables:");
    let display = requiredEnvironmentVariables.reduce((strList, value) => {
        return strList += value + '=xxxxxxxx ';
    }, "");
    console.log(display);
}





var 
    // Requirements
    express = require('express'),
    app = express(),
    request = require('request'),
    rp = require('request-promise'),
    // Default environment variables:
    logstash_name = process.env.LOGSTASH_NAME || "logstash",
    port = process.env.PORT || 3010,
    bitbucket_api_token = process.env.BITBUCKET_API_TOKEN,
    bitbucket_org_url = process.env.BITBUCKET_ORGANISATION_DOMAIN;



app.listen(port, () => {
    console.log('Environment variable PORT is: ' + port);
    console.log('Environment variables LOGSTASH_NAME is: ' + logstash_name);
});



app.get('/users', (req, res) => {
    // Note: In this case http worked and https did not (issues with the https certificate)
    let url = "http://"+bitbucket_org_url+"/rest/api/1.0/admin/users?limit=1000";
    let logstashurl = "http://"+logstash_name+":9071";
    let authtoken = bitbucket_api_token;
    getData(url, authtoken)
        .then((data) => {

            return postData(logstashurl, data);
        })
        .then((data) => {
            console.log("/users success on postData", data);
            res.send(data);
        })
            .catch((err) => {
                console.log("/users err on postData", err);
                res.send(err);
            });
});



function getData(url, authtoken) {
    // Note, the auth token in this case is a base64 string of the syntax: "username:password"
    let headers = {
        'User-Agent': 'request',
        'Authorization' : 'Basic '+ authtoken,
        'Content-Type': 'application/json'
    };
    let options = {url, headers};
    return rp(options).then((data) => {
        console.log("getData result: data", data);
        return data;
    });

}


function postData(url, sendlogstash_data) {

    if (sendlogstash_data === undefined) {
        return;
    }

    let headers = {
        "Content-Type": "application/json"
    };
    
    let options = {
        method: "POST",
        body: JSON.parse(sendlogstash_data),
        url, 
        headers,
        json: true
    };

    return rp(options).then((body) => {
        // Send back the data for logstash so you can see what was sent
        return sendlogstash_data;
    });

}