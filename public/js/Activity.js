
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
    document.getElementById('srcCloumnName1').value= payload['arguments'].execute.inArguments[0].srcCloumnName1;
    document.getElementById('pkDestCloumnName1').value= payload['arguments'].execute.inArguments[0].pkDestCloumnName1;
    document.getElementById('srcCloumnName2').value= payload['arguments'].execute.inArguments[0].srcCloumnName2;
    document.getElementById('destCloumnName2').value= payload['arguments'].execute.inArguments[0].destCloumnName2;
}); 


 var eventDefinitionKey;
connection.trigger('requestTriggerEventDefinition');

connection.on('requestedTriggerEventDefinition',
function(eventDefinitionModel) {
console.log('EVENT definition from req trigger Event- '+JSON.stringify(eventDefinitionModel));
    if(eventDefinitionModel){

        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        console.log(">>>Event Definition Key " + eventDefinitionKey);
        //If you want to see all
        console.log('>>>Request Trigger', 
        JSON.stringify(eventDefinitionModel));
    }

}); 


connection.on('clickedNext',function(){
    var DEName = document.getElementById('DEName').value;
    var srcCloumnName1 = document.getElementById('srcCloumnName1').value;
    var pkDestCloumnName1 = document.getElementById('pkDestCloumnName1').value;
    var srcCloumnName2 = document.getElementById('srcCloumnName2').value;
    var destCloumnName2 = document.getElementById('destCloumnName2').value;
    console.log('DEName is : '+ DEName);
    payload['arguments'].execute.inArguments = [{
        "tokens": authTokens,
        "srcCloumnName1" : "{{Event."+ eventDefinitionKey +"."+srcCloumnName1+"}}",
        "srcCloumnName2": "{{Event."+ eventDefinitionKey +"."+srcCloumnName2+"}}",
        "DEName" : DEName,
        "pkDestCloumnName1" : pkDestCloumnName1,
        "destCloumnName2" : destCloumnName2
    }];
   
    payload['arguments'].execute.useJwt = true;
    payload['configurationArguments'].save.useJwt = true;
    payload['metaData'].isConfigured = true;
    payload['key'] = 'REST-1';
    payload['type'] = 'REST';
    console.log('Total PAyload: - '+JSON.stringify(payload));
    connection.trigger('updateActivity', payload);
});


function onGetTokens(tokens) {
    console.log("Authtoken from Activity : "+tokens);
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