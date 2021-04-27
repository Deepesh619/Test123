
//const express = require(['express']);
//import express from '../../node_modules/express';
 //= require('express')
//const app = app();
//const axios = require('axios');
//import app from '../../app.js'; 
//console.log(app);
/*var querystring = require('querystring');
var https = require('https');

var payload = [
    {
        "keys":{
            "ContactKey": "0033B00000V9hUFQAZ"
                },
        "values":{
            "Email":"akhil.passi12@accenture.com"
                }
    }];*/
    var authTokens = {};
    var payload = {};
    var connection = new Postmonger.Session();

connection.trigger('ready');
connection.on('requestedTokens', onGetTokens);
connection.on('initActivity',function(data){
    console.log(data);
    if (data) {
        payload = data;
    }
    document.getElementById('DEName').value= payload['arguments'].execute.inArguments[0].DEName;
}); 

//to check the DE data we need evendefid
//Deepesh
 /*var eventDefinitionKey;
connection.trigger('requestTriggerEventDefinition');

connection.on('requestedTriggerEventDefinition',
function(eventDefinitionModel) {
    if(eventDefinitionModel){

        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        console.log(">>>Event Definition Key " + eventDefinitionKey);
        //If you want to see all
        console.log('>>>Request Trigger', 
        JSON.stringify(eventDefinitionModel));
    }

}); */
var eventDefinitionKey;
connection.on("requestedTriggerEventDefinition", function (
    eventDefinitionModel
  ) {
    if (eventDefinitionModel) {
      definition = eventDefinitionModel;
      eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
    }
  });

connection.on('clickedNext',function(){
    var DEName = document.getElementById('DEName').value;
    console.log('DEName is : '+ DEName);
    payload['arguments'].execute.inArguments = [{
        "tokens": authTokens,
        //"Email": "abc@gmail.com",
        //"Email": "{{Contact.Default.Email}}",
        //"Email": "{{Contact.Attribute.CustomActivityTest.Email}}",
        "ContactKey" : "{{Contact.Attribute.CustomActivityTest.ContactKey}}",
        //"Email": "{{Contact.Attribute." + eventDefinitionKey +".\"Email\"}}",
        "Email": "{{Event."+ eventDefinitionKey +".Email}}",
        //"ContactKey" : "12345678",
        //"Email":"{{Event.1234.Email}}",
       "DEName" : DEName
    }];
   
    payload['arguments'].execute.useJwt = true;
    payload['configurationArguments'].save.useJwt = true;
    payload['metaData'].isConfigured = true;
    payload['key'] = 'REST-1';
    payload['type'] = 'REST';
    console.log(payload);
    connection.trigger('updateActivity', payload);
});


function onGetTokens(tokens) {
    console.log(tokens);
    authTokens = tokens;
}

function insertDE() {
    
  /*  app.set('port', (process.env.PORT || 5000))
    app.use(__dirname + '/public')

    app.get('/connecttoMCData', function(request, responsefromWeb) {
	
        axios({;
            method: 'post',
            url: 'https://www.exacttargetapis.com/hub/v1/dataevents/key:CustomActivityTest/rowset',
            data: payload,
            headers:{
               'Authorization': 'Bearer ' + authTokens,
               'Content-Type': 'application/json',
            }
          })
            .then(function(response) {
                    var json = response;
              console.log(json);
              responsefromWeb.send(json);
            }) 
             .catch(function (error) {
                console.log(error);
            });
    })

    console.log(payload); */
}
//module.exports.insertDE=insertDE;