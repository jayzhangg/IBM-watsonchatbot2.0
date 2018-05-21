/*************************************************************************************************

  Define global variables for NPM packages and Cloud Foundry environment

*************************************************************************************************/
"use strict";

var express = require('express'),
    cfenv = require("cfenv"),
    appEnv = cfenv.getAppEnv(),
    app = express(),
    bodyParser = require('body-parser'),
    watson = require('watson-developer-cloud');

var AssistantV1 = require('watson-developer-cloud/assistant/v1');

/************************************************************************************************* 
  
  Start the server 
  
*************************************************************************************************/
app.use(bodyParser()); 

app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});

/*************************************************************************************************

 Watson Conversation

*************************************************************************************************/
var conversation = new AssistantV1({ 
    version: '2018-02-16',
    username: 'd7c168d5-1cec-4a55-87b7-a3c2f5b73ff6',
    password: 'SmR0PHyNBTQV'
});

// Allow clients to interact with the bot
app.post('/api/bot', function(req, res) {
    
    console.log("Got request for Flower Bot");
    console.log("Request is: ",req);

    var workspace = '5d2a6a41-3c44-4595-957e-ecd29184e807'; // Set to your Conversation workspace ID

    if (!workspace) {
        console.log("No workspace detected. Cannot run the Watson Conversation service.");
    }

    var params = {
        workspace_id: workspace,
        context: {}, // Null context indicates new conversation
        input: {}    // Holder for message
    };

    // Update options to send to conversation service with the user input and a context if one exists
    if (req.body) {
        if (req.body.input) {
            params.input = req.body.input;
        }

        if (req.body.context) {
            params.context = req.body.context;
        }
    }

    // Send message to the conversation service with the current context
    conversation.message(params, function(err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            return res.status(err.code || 500).json(err);
        }

        console.log("Response: ", data);

        return res.json(data);
    });

}); // End app.post '/api/bot'

